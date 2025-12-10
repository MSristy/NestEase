export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SERVICE_PROVIDER = 'service_provider',
  PROPERTY_OWNER = 'property_owner',
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  BUYER = 'buyer',
  SELLER = 'seller'
}

export const ROLE_DISPLAY_NAMES = {
  [Role.USER]: 'User',
  [Role.ADMIN]: 'Admin',
  [Role.SERVICE_PROVIDER]: 'Service Provider',
  [Role.PROPERTY_OWNER]: 'Property Owner',
  [Role.TENANT]: 'Tenant',
  [Role.LANDLORD]: 'Landlord',
  [Role.BUYER]: 'Buyer',
  [Role.SELLER]: 'Seller'
};

export const ROLE_DESCRIPTIONS = {
  [Role.USER]: 'Basic user with limited access',
  [Role.ADMIN]: 'System administrator with full access',
  [Role.SERVICE_PROVIDER]: 'Can provide home services',
  [Role.PROPERTY_OWNER]: 'Can list and manage properties',
  [Role.TENANT]: 'Can rent properties',
  [Role.LANDLORD]: 'Can manage rental properties',
  [Role.BUYER]: 'Can purchase properties',
  [Role.SELLER]: 'Can sell properties and items'
}; 
