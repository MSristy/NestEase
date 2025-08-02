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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    // User Management
    getAllUsers() {
        return this.adminService.getAllUsers();
    }
    getUserById(id) {
        return this.adminService.getUserById(id);
    }
    updateUserStatus(id, isActive) {
        return this.adminService.updateUserStatus(id, isActive);
    }
    deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    // Property Management
    getAllProperties() {
        return this.adminService.getAllProperties();
    }
    getPropertyById(id) {
        return this.adminService.getPropertyById(id);
    }
    verifyProperty(id) {
        return this.adminService.verifyProperty(id);
    }
    deleteProperty(id) {
        return this.adminService.deleteProperty(id);
    }
    // Service Provider Management
    getAllServiceProviders() {
        return this.adminService.getAllServiceProviders();
    }
    getServiceProviderById(id) {
        return this.adminService.getServiceProviderById(id);
    }
    verifyServiceProvider(id) {
        return this.adminService.verifyServiceProvider(id);
    }
    deleteServiceProvider(id) {
        return this.adminService.deleteServiceProvider(id);
    }
    // Save & Swap Management
    getAllSaveAndSwaps() {
        return this.adminService.getAllSaveAndSwaps();
    }
    getSaveAndSwapById(id) {
        return this.adminService.getSaveAndSwapById(id);
    }
    completeSaveAndSwap(id) {
        return this.adminService.completeSaveAndSwap(id);
    }
    deleteSaveAndSwap(id) {
        return this.adminService.deleteSaveAndSwap(id);
    }
    // Add Swap Items Management
    getAllAddSwapItems() {
        return this.adminService.getAllAddSwapItems();
    }
    getAddSwapItemById(id) {
        return this.adminService.getAddSwapItemById(id);
    }
    deleteAddSwapItem(id) {
        return this.adminService.deleteAddSwapItem(id);
    }
    // Sell Products Management
    getAllSellProducts() {
        return this.adminService.getAllSellProducts();
    }
    getSellProductById(id) {
        return this.adminService.getSellProductById(id);
    }
    deleteSellProduct(id) {
        return this.adminService.deleteSellProduct(id);
    }
    // Item Offers Management
    getAllItemOffers() {
        return this.adminService.getAllItemOffers();
    }
    getItemOfferById(id) {
        return this.adminService.getItemOfferById(id);
    }
    deleteItemOffer(id) {
        return this.adminService.deleteItemOffer(id);
    }
    // Test endpoint to check barter items data
    getBarterStats() {
        return this.adminService.getBarterStats();
    }
    // Test endpoint to check user role
    testRole(req) {
        var _a;
        return {
            user: req.user,
            role: (_a = req.user) === null || _a === void 0 ? void 0 : _a.role,
            message: 'Role test endpoint'
        };
    }
    // Promote user to admin (only accessible by existing admins)
    async promoteUserToAdmin(req, body) {
        return this.adminService.promoteUserToAdmin(body.userId);
    }
    // Get all admin users
    async getAllAdmins() {
        return this.adminService.getAllAdmins();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('users/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('properties'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllProperties", null);
__decorate([
    (0, common_1.Get)('property/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPropertyById", null);
__decorate([
    (0, common_1.Post)('property/:id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyProperty", null);
__decorate([
    (0, common_1.Delete)('property/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteProperty", null);
__decorate([
    (0, common_1.Get)('service-providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllServiceProviders", null);
__decorate([
    (0, common_1.Get)('service-providers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getServiceProviderById", null);
__decorate([
    (0, common_1.Put)('service-providers/:id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyServiceProvider", null);
__decorate([
    (0, common_1.Delete)('service-providers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteServiceProvider", null);
__decorate([
    (0, common_1.Get)('save-and-swaps'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllSaveAndSwaps", null);
__decorate([
    (0, common_1.Get)('save-and-swaps/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSaveAndSwapById", null);
__decorate([
    (0, common_1.Put)('save-and-swaps/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "completeSaveAndSwap", null);
__decorate([
    (0, common_1.Delete)('save-and-swaps/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteSaveAndSwap", null);
__decorate([
    (0, common_1.Get)('add-swap-items'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllAddSwapItems", null);
__decorate([
    (0, common_1.Get)('add-swap-items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAddSwapItemById", null);
__decorate([
    (0, common_1.Delete)('add-swap-items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteAddSwapItem", null);
__decorate([
    (0, common_1.Get)('sell-products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllSellProducts", null);
__decorate([
    (0, common_1.Get)('sell-products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSellProductById", null);
__decorate([
    (0, common_1.Delete)('sell-products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteSellProduct", null);
__decorate([
    (0, common_1.Get)('item-offers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllItemOffers", null);
__decorate([
    (0, common_1.Get)('item-offers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getItemOfferById", null);
__decorate([
    (0, common_1.Delete)('item-offers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteItemOffer", null);
__decorate([
    (0, common_1.Get)('barter-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getBarterStats", null);
__decorate([
    (0, common_1.Get)('test-role'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "testRole", null);
__decorate([
    (0, common_1.Post)('promote-user'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "promoteUserToAdmin", null);
__decorate([
    (0, common_1.Get)('admins'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAdmins", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map