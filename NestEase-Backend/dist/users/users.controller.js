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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const notification_service_1 = require("./notification.service");
let UsersController = class UsersController {
    constructor(usersService, notificationService) {
        this.usersService = usersService;
        this.notificationService = notificationService;
    }
    findAll() {
        return this.usersService.findAll();
    }
    create(user) {
        return this.usersService.create(user);
    }
    updateRole(email, role) {
        return this.usersService.updateRole(email, role);
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, updateData) {
        return this.usersService.updateProfile(req.user.id, updateData);
    }
    async uploadAvatar(file, req) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        const avatarUrl = `http://localhost:3001/uploads/avatars/${file.filename}`;
        return this.usersService.updateAvatar(req.user.id, avatarUrl);
    }
    async changePassword(req, body) {
        const { oldPassword, newPassword } = body;
        if (!oldPassword || !newPassword) {
            return { message: 'Old password and new password are required.' };
        }
        return this.usersService.changePassword(req.user.id, oldPassword, newPassword);
    }
    async getNotifications(req) {
        return this.usersService.getNotifications(req.user.id);
    }
    async updateNotifications(req, body) {
        return this.usersService.updateNotifications(req.user.id, body);
    }
    async getUserNotifications(req) {
        return this.notificationService.getUserNotifications(req.user.id);
    }
    async markNotificationAsRead(req, id) {
        await this.notificationService.markAsRead(parseInt(id), req.user.id);
        return { success: true, message: 'Notification marked as read' };
    }
    async markAllNotificationsAsRead(req) {
        await this.notificationService.markAllAsRead(req.user.id);
        return { success: true, message: 'All notifications marked as read' };
    }
    async deleteNotification(req, id) {
        await this.notificationService.deleteNotification(parseInt(id), req.user.id);
        return { success: true, message: 'Notification deleted' };
    }
    async getPrivacy(req) {
        return this.usersService.getPrivacy(req.user.id);
    }
    async updatePrivacy(req, body) {
        return this.usersService.updatePrivacy(req.user.id, body);
    }
    async deleteProfile(req) {
        return this.usersService.deleteProfile(req.user.id);
    }
    async getAddresses(req) {
        return this.usersService.getAddresses(req.user.id);
    }
    async addAddress(req, address) {
        return this.usersService.addAddress(req.user.id, address);
    }
    async deleteAddress(req, id) {
        return this.usersService.deleteAddress(req.user.id, parseInt(id));
    }
    async getConnectedAccounts(req) {
        return this.usersService.getConnectedAccounts(req.user.id);
    }
    async connectAccount(req, account) {
        return this.usersService.connectAccount(req.user.id, account);
    }
    async disconnectAccount(req, id) {
        return this.usersService.disconnectAccount(req.user.id, parseInt(id));
    }
    async getCustomization(req) {
        return this.usersService.getCustomization(req.user.id);
    }
    async updateCustomization(req, customization) {
        return this.usersService.updateCustomization(req.user.id, customization);
    }
    async getCurrentUser(req) {
        const user = await this.usersService.findById(req.user.id);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        return {
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        };
    }
    checkRole(req) {
        var _a, _b;
        return {
            user: req.user,
            role: (_a = req.user) === null || _a === void 0 ? void 0 : _a.role,
            isAdmin: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin',
            message: 'Role check endpoint'
        };
    }
    getAvailableRoles(req) {
        var _a;
        // Get all available roles except admin (admin can only be assigned by other admins)
        const availableRoles = [
            { value: 'user', label: 'User', description: 'Basic user with limited access' },
            { value: 'service_provider', label: 'Service Provider', description: 'Can provide home services' },
            { value: 'property_owner', label: 'Property Owner', description: 'Can list and manage properties' },
            { value: 'tenant', label: 'Tenant', description: 'Can rent properties' },
            { value: 'landlord', label: 'Landlord', description: 'Can manage rental properties' },
            { value: 'buyer', label: 'Buyer', description: 'Can purchase properties' },
            { value: 'seller', label: 'Seller', description: 'Can sell properties and items' }
        ];
        // If user is admin, they can also assign admin role
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin') {
            availableRoles.push({
                value: 'admin',
                label: 'Admin',
                description: 'System administrator with full access'
            });
        }
        return availableRoles;
    }
    async switchRole(req, body) {
        return this.usersService.switchRole(req.user.id, body.newRole);
    }
    // Temporary endpoint to make current user admin (remove after use)
    async makeAdmin(req) {
        return this.usersService.updateRole(req.user.email, 'admin');
    }
    async testDatabase(req) {
        try {
            const user = await this.usersService.findById(req.user.id);
            console.log('Test DB - Found user:', user);
            return {
                success: true,
                user: user,
                message: 'Database connection working'
            };
        }
        catch (error) {
            console.error('Test DB - Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                message: 'Database connection failed'
            };
        }
    }
    getJwtPayload(req) {
        return { user: req.user };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':email/role'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('profile/avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/avatars',
            filename: (_req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (_req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('notifications'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user-notifications'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('notifications/:id/read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('notifications/read-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "markAllNotificationsAsRead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('notifications/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('privacy'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPrivacy", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('privacy'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePrivacy", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('addresses'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('addresses'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addAddress", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('addresses/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAddress", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('connected-accounts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getConnectedAccounts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('connected-accounts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "connectAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('connected-accounts/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "disconnectAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('customization'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCustomization", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('customization'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCustomization", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('current-user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('check-role'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "checkRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('available-roles'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAvailableRoles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('switch-role'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "switchRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('make-admin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "makeAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('test-db'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "testDatabase", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('debug-jwt'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getJwtPayload", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        notification_service_1.NotificationService])
], UsersController);
//# sourceMappingURL=users.controller.js.map