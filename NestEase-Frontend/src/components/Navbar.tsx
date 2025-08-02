'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, Settings, User, Users, Mail, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '@/types/role.enum';
import RoleSwitcher from './RoleSwitcher';
import { useNotifications } from '@/context/NotificationContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const isActive = (path: string) => pathname === path;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'service_provider':
        return <Users className="h-3 w-3" />;
      case 'property_owner':
      case 'landlord':
        return <User className="h-3 w-3" />;
      case 'tenant':
      case 'buyer':
      case 'seller':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            NestEase
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/properties"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/properties') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Properties
            </Link>
            <Link
              href="/service-providers"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/service-providers')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Service Providers
            </Link>
            <Link
              href="/save-and-swap"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/save-and-swap')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Save & Swap
            </Link>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>
                    Notifications
                    <button onClick={markAllAsRead} className="ml-2 text-xs text-blue-600 underline">Mark all as read</button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {Array.isArray(notifications) && notifications.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">No notifications</div>
                    ) : (
                      Array.isArray(notifications) &&
                      notifications.map((n: any, i: number) => (
                        <DropdownMenuItem key={i} className={`flex flex-col items-start gap-1 py-3 ${!n.read ? 'bg-blue-50' : ''}`}>
                          <span className="font-medium">{n.message}</span>
                          <span className="text-xs text-muted-foreground">{new Date(n.createdAt || '').toLocaleString()}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Current Role Display */}
                  <DropdownMenuItem className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm">Current Role</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {ROLE_DISPLAY_NAMES[user.role as keyof typeof ROLE_DISPLAY_NAMES] || 'User'}
                    </Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => setIsRoleDialogOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Role Switch</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Move Dialog outside DropdownMenu for proper modal behavior */}
              <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Role Management
                    </DialogTitle>
                  </DialogHeader>
                  <RoleSwitcher />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 