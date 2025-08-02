'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Mail, 
  Phone, 
  Palette, 
  MapPin, 
  Trash2,
  Link as LinkIcon,
  Plus,
  Edit2,
  X,
  Globe,
  CreditCard,
  Settings2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface ConnectedAccount {
  id: number;
  provider: string;
  email: string;
  connectedAt: string;
}

export default function SettingsPage() {
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Privacy Options state
  const [showProfile, setShowProfile] = useState(true);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

  // Theme state
  const [theme, setTheme] = useState('system');
  const [isSavingTheme, setIsSavingTheme] = useState(false);

  // Account Deletion state
  const [isDeleting, setIsDeleting] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isConnectingAccount, setIsConnectingAccount] = useState(false);

  // Customization state
  const [accentColor, setAccentColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');

  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  // Fetch user data and settings on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch profile
    fetch('http://localhost:3001/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      });

    // Fetch notifications
    fetch('http://localhost:3001/users/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.emailNotifications === 'boolean') setEmailNotifications(data.emailNotifications);
        if (typeof data.smsNotifications === 'boolean') setSmsNotifications(data.smsNotifications);
      });

    // Fetch privacy
    fetch('http://localhost:3001/users/privacy', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.showProfile === 'boolean') setShowProfile(data.showProfile);
      });

    // Fetch addresses
    setIsLoadingAddresses(true);
    setAddressError(null);
    fetch('http://localhost:3001/users/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch addresses');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAddresses(data);
        } else {
          setAddresses([]);
          console.warn('Addresses data is not an array:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching addresses:', error);
        setAddressError(error.message);
        setAddresses([]);
      })
      .finally(() => {
        setIsLoadingAddresses(false);
      });

    // Fetch connected accounts
    fetch('http://localhost:3001/users/connected-accounts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setConnectedAccounts(data));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      const result = await response.json();
      if (result) {
        // Update the user state in the auth context
        updateUser(result);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message || 'Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(result.message || 'Failed to change password.');
      }
    } catch (error) {
      toast.error('Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ emailNotifications, smsNotifications }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message || 'Preferences updated.');
      } else {
        toast.error(result.message || 'Failed to update preferences.');
      }
    } catch (error) {
      toast.error('Failed to update preferences.');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSavingPrivacy(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ showProfile }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message || 'Privacy updated.');
      } else {
        toast.error(result.message || 'Failed to update privacy.');
      }
    } catch (error) {
      toast.error('Failed to update privacy.');
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Account deleted. Goodbye!');
        logout();
        router.push('/auth/signup');
      } else {
        toast.error(result.message || 'Failed to delete account.');
      }
    } catch (error) {
      toast.error('Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleThemeChange = async (value: string) => {
    setTheme(value);
    setIsSavingTheme(true);
    try {
      // Here you would typically save the theme preference to your backend
      // For now, we'll just update the local state
      document.documentElement.setAttribute('data-theme', value);
      toast.success('Theme preference saved');
    } catch (error) {
      toast.error('Failed to save theme preference');
    } finally {
      setIsSavingTheme(false);
    }
  };

  // Address handlers
  const handleAddAddress = async () => {
    setIsAddingAddress(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      const result = await response.json();
      if (result) {
        setAddresses([...addresses, result]);
        setNewAddress({});
        toast.success('Address added successfully');
      }
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/users/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter(addr => addr.id !== id));
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  // Connected accounts handlers
  const handleConnectAccount = async (provider: string) => {
    setIsConnectingAccount(true);
    try {
      // Here you would typically implement OAuth flow
      // For now, we'll just simulate it
      const newAccount = {
        id: Date.now(),
        provider,
        email: 'user@example.com',
        connectedAt: new Date().toISOString(),
      };
      setConnectedAccounts([...connectedAccounts, newAccount]);
      toast.success(`Connected to ${provider} successfully`);
    } catch (error) {
      toast.error(`Failed to connect to ${provider}`);
    } finally {
      setIsConnectingAccount(false);
    }
  };

  const handleDisconnectAccount = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/users/connected-accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnectedAccounts(connectedAccounts.filter(acc => acc.id !== id));
      toast.success('Account disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect account');
    }
  };

  // Customization handlers
  const handleSaveCustomization = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/users/customization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          accentColor,
          fontSize,
          language,
        }),
      });
      toast.success('Customization preferences saved');
    } catch (error) {
      toast.error('Failed to save customization preferences');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-muted-foreground">{email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </Card>

            <Card className="p-6 border-red-500">
              <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </h2>
              <p className="mb-4 text-sm text-red-500">
                Warning: This action is irreversible. All your data will be permanently deleted.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="addresses">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Saved Addresses
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                      Add a new address to your profile
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Label (e.g., Home, Work)</Label>
                      <Input
                        value={newAddress.label || ''}
                        onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        value={newAddress.street || ''}
                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={newAddress.city || ''}
                          onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={newAddress.state || ''}
                          onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>ZIP Code</Label>
                      <Input
                        value={newAddress.zipCode || ''}
                        onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddAddress} disabled={isAddingAddress}>
                      {isAddingAddress ? 'Adding...' : 'Add Address'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {isLoadingAddresses ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading addresses...</p>
                </div>
              ) : addressError ? (
                <div className="text-center py-4 text-red-500">
                  <p>{addressError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setAddressError(null);
                      // Retry loading addresses
                      const token = localStorage.getItem('token');
                      if (token) {
                        setIsLoadingAddresses(true);
                        fetch('http://localhost:3001/users/addresses', {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                          .then(res => res.json())
                          .then(data => {
                            if (Array.isArray(data)) {
                              setAddresses(data);
                            } else {
                              setAddresses([]);
                            }
                          })
                          .catch(() => setAddresses([]))
                          .finally(() => setIsLoadingAddresses(false));
                      }
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No addresses saved yet</p>
                  <p className="text-sm mt-1">Add your first address to get started</p>
                </div>
              ) : (
                addresses.map(address => (
                  <Card key={address.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{address.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Connected Accounts
            </h2>

            <div className="space-y-4">
              {connectedAccounts.map(account => (
                <Card key={account.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {account.provider === 'google' && <Globe className="w-5 h-5" />}
                      {account.provider === 'stripe' && <CreditCard className="w-5 h-5" />}
                      <div>
                        <h3 className="font-semibold capitalize">{account.provider}</h3>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleDisconnectAccount(account.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </Card>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                  onClick={() => handleConnectAccount('google')}
                  disabled={isConnectingAccount}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Connect Google
                </Button>
                <Button
                  onClick={() => handleConnectAccount('stripe')}
                  disabled={isConnectingAccount}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Connect Stripe
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <Label>Email Notifications</Label>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <Label>SMS Notifications</Label>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
              <Button onClick={handleSaveNotifications} disabled={isSavingNotifications}>
                {isSavingNotifications ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Options
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <Label>Show my profile to others</Label>
                  </div>
                  <Switch checked={showProfile} onCheckedChange={setShowProfile} />
                </div>
                <Button onClick={handleSavePrivacy} disabled={isSavingPrivacy}>
                  {isSavingPrivacy ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
              </div>
            </Card>

            <Button onClick={handleSaveCustomization} className="w-full">
              Save All Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 