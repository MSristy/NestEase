"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        var _a;
        const roles = this.reflector.get('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('=== ROLES GUARD DEBUG ===');
        console.log('Required roles:', roles);
        console.log('User object:', user);
        console.log('User role:', user === null || user === void 0 ? void 0 : user.role);
        // Case-insensitive role comparison with alias support
        const userRole = (_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const requiredRoles = roles.map(role => role.toLowerCase());
        // Role aliases: treat 'landlord', 'seller', and 'property_owner' as equivalent
        const roleAliases = {
            'landlord': ['property_owner', 'seller'],
            'seller': ['property_owner', 'landlord'],
            'property_owner': ['landlord', 'seller'],
        };
        // Check if userRole matches any requiredRole or its aliases
        const rolesMatch = requiredRoles.some(required => {
            if (userRole === required)
                return true;
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
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map