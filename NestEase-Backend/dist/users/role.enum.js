"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_DESCRIPTIONS = exports.ROLE_DISPLAY_NAMES = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
    Role["SERVICE_PROVIDER"] = "service_provider";
    Role["PROPERTY_OWNER"] = "property_owner";
    Role["TENANT"] = "tenant";
    Role["LANDLORD"] = "landlord";
    Role["BUYER"] = "buyer";
    Role["SELLER"] = "seller";
})(Role || (exports.Role = Role = {}));
exports.ROLE_DISPLAY_NAMES = {
    [Role.USER]: 'User',
    [Role.ADMIN]: 'Admin',
    [Role.SERVICE_PROVIDER]: 'Service Provider',
    [Role.PROPERTY_OWNER]: 'Property Owner',
    [Role.TENANT]: 'Tenant',
    [Role.LANDLORD]: 'Landlord',
    [Role.BUYER]: 'Buyer',
    [Role.SELLER]: 'Seller'
};
exports.ROLE_DESCRIPTIONS = {
    [Role.USER]: 'Basic user with limited access',
    [Role.ADMIN]: 'System administrator with full access',
    [Role.SERVICE_PROVIDER]: 'Can provide home services',
    [Role.PROPERTY_OWNER]: 'Can list and manage properties',
    [Role.TENANT]: 'Can rent properties',
    [Role.LANDLORD]: 'Can manage rental properties',
    [Role.BUYER]: 'Can purchase properties',
    [Role.SELLER]: 'Can sell properties and items'
};
//# sourceMappingURL=role.enum.js.map