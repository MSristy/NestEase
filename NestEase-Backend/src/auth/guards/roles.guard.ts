import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('=== ROLES GUARD DEBUG ===');
    console.log('Required roles:', roles);
    console.log('User object:', user);
    console.log('User role:', user?.role);
    
    // Case-insensitive role comparison with alias support
    const userRole = user?.role?.toLowerCase();
    const requiredRoles = roles.map(role => role.toLowerCase());

    // Role aliases: treat 'landlord', 'seller', and 'property_owner' as equivalent
    const roleAliases: Record<string, string[]> = {
      'landlord': ['property_owner', 'seller'],
      'seller': ['property_owner', 'landlord'],
      'property_owner': ['landlord', 'seller'],
    };

    // Check if userRole matches any requiredRole or its aliases
    const rolesMatch = requiredRoles.some(required => {
      if (userRole === required) return true;
      const aliases = roleAliases[required] || [];
      return aliases.includes(userRole);
    });
    
    console.log('User role (lowercase):', userRole);
    console.log('Required roles (lowercase):', requiredRoles);
    console.log('Roles match:', rolesMatch);
    
    // Special case: if requiredRoles is only ['user'], allow all except 'service_provider'
    if (requiredRoles.length === 1 && requiredRoles[0] === 'user') {
      const forbiddenRoles = ['service_provider'];
      const isForbidden = forbiddenRoles.includes(userRole);
      console.log('Special USER endpoint: isForbidden:', isForbidden);
      return !isForbidden;
    }
    
    return rolesMatch;
  }
} 