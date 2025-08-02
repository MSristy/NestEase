'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '@/types/role.enum';
import { 
  User, 
  Users, 
  Crown, 
  Home, 
  ShoppingCart, 
  Store, 
  Building,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { apiFetch } from '@/lib/utils';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: React.ElementType;
  color: string;
  isCurrent: boolean;
  canSwitch: boolean;
}

export default function RoleSwitcher() {
  const { user, updateUser, checkAuth } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);

  const roleIcons: { [key: string]: React.ElementType } = {
    admin: Crown,
    user: User,
    service_provider: Users,
    buyer: ShoppingCart,
    seller: Store,
    tenant: Home,
    landlord: Building,
  };

  const roleColors: { [key: string]: string } = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    user: 'bg-blue-100 text-blue-800 border-blue-200',
    service_provider: 'bg-green-100 text-green-800 border-green-200',
    buyer: 'bg-orange-100 text-orange-800 border-orange-200',
    seller: 'bg-red-100 text-red-800 border-red-200',
    tenant: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    landlord: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  useEffect(() => {
    if (user) {
      const availableRoles = [
        { id: 'user', name: 'user', displayName: 'Regular User', description: 'Basic user with limited access' },
        { id: 'service_provider', name: 'service_provider', displayName: 'Service Provider', description: 'Offer home services to customers' },
        { id: 'buyer', name: 'buyer', displayName: 'Property Buyer', description: 'Purchase properties from sellers' },
        { id: 'seller', name: 'seller', displayName: 'Property Seller', description: 'Sell properties to buyers' },
        { id: 'tenant', name: 'tenant', displayName: 'Property Tenant', description: 'Rent properties from landlords' },
        { id: 'landlord', name: 'landlord', displayName: 'Property Landlord', description: 'Rent out properties to tenants' },
        ...(user.role === 'admin' ? [{ id: 'admin', name: 'admin', displayName: 'Administrator', description: 'Full system access and management' }] : []),
      ];

      const rolesWithState = availableRoles.map(role => ({
        ...role,
        isCurrent: user.role === role.name,
        canSwitch: user.role !== role.name,
        icon: roleIcons[role.name] || User,
        color: roleColors[role.name] || 'bg-gray-100 text-gray-800 border-gray-200',
      }));

      setRoles(rolesWithState);
    }
  }, [user]);

  const switchRole = async (roleName: string) => {
    if (!user) return;

    setSwitchingRole(roleName);
    try {
      const response = await apiFetch('http://localhost:3001/users/switch-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRole: roleName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to switch role');
      }

      const data = await response.json();
      // Update user context
      updateUser(data.user);
      // Store new token if present and refresh auth context
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.reload(); // Force reload to use new token everywhere
      }
      toast.success(`Successfully switched to ${ROLE_DISPLAY_NAMES[roleName as keyof typeof ROLE_DISPLAY_NAMES] || roleName}`);
      // Update roles state
      setRoles(prev => prev.map(role => ({
        ...role,
        isCurrent: role.name === roleName,
        canSwitch: role.name !== roleName,
      })));
    } catch (error) {
      console.error('Error switching role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to switch role');
    } finally {
      setSwitchingRole(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Please log in to manage your roles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Role Display */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CheckCircle className="h-5 w-5" />
            Current Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={`${roleColors[user.role] || 'bg-gray-100 text-gray-800'} text-sm font-medium px-3 py-1`}>
              {ROLE_DISPLAY_NAMES[user.role as keyof typeof ROLE_DISPLAY_NAMES] || 'User'}
            </Badge>
            <p className="text-sm text-gray-600">
              {ROLE_DESCRIPTIONS[user.role as keyof typeof ROLE_DESCRIPTIONS] || 'Basic user access'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Available Roles */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Available Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id} 
                className={`relative transition-all duration-200 hover:shadow-md ${
                  role.isCurrent ? 'ring-2 ring-blue-500 bg-blue-50/30' : 'hover:bg-gray-50/50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{role.displayName}</CardTitle>
                        <CardDescription className="text-sm">
                          {role.description}
                        </CardDescription>
                      </div>
                    </div>
                    {role.isCurrent && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Current
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    onClick={() => switchRole(role.name)}
                    disabled={role.isCurrent || switchingRole === role.name}
                    variant={role.isCurrent ? "outline" : "default"}
                    className="w-full"
                    size="sm"
                  >
                    {switchingRole === role.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Switching...
                      </>
                    ) : role.isCurrent ? (
                      'Current Role'
                    ) : (
                      'Switch to This Role'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Information Section */}
      <Card className="bg-gray-50/50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-base text-gray-700">About Role Switching</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>You can switch between different roles to access different features</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Each role provides access to specific functionality and permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Your account data and preferences are preserved across role switches</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Admin role can only be assigned by existing administrators</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 