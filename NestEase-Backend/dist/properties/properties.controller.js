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
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const properties_service_1 = require("./properties.service");
const property_entity_1 = require("./property.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/role.enum");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
let PropertiesController = class PropertiesController {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    // Public endpoints - no authentication required
    findAll(type, status) {
        return this.propertiesService.findAll(type, status);
    }
    getPropertiesByOwner(ownerId) {
        return this.propertiesService.getPropertiesByOwner(Number(ownerId));
    }
    findOne(id) {
        return this.propertiesService.findOne(id);
    }
    // Protected endpoints - require authentication
    create(createPropertyDto, req) {
        return this.propertiesService.create(createPropertyDto, req.user.id);
    }
    // Landlord gets pending booking requests for their properties
    getPendingRequests(req) {
        return this.propertiesService.getPendingRequests(req.user.id);
    }
    // Seller gets pending purchase requests for their properties
    getPendingPurchases(req) {
        return this.propertiesService.getPendingPurchases(req.user.id);
    }
    // Landlord/Seller: My properties
    getMyProperties(req) {
        return this.propertiesService.getPropertiesByOwner(req.user.id);
    }
    // Tenant/Buyer: My bookings/purchases
    getMyBookings(req) {
        return this.propertiesService.getMyBookings(req.user.id);
    }
    // Landlord posts rental property
    createRental(createPropertyDto, req) {
        return this.propertiesService.create(Object.assign(Object.assign({}, createPropertyDto), { type: property_entity_1.PropertyType.RENT }), req.user.id);
    }
    // Seller posts property for sale
    createSale(createPropertyDto, req) {
        return this.propertiesService.create(Object.assign(Object.assign({}, createPropertyDto), { type: property_entity_1.PropertyType.SALE }), req.user.id);
    }
    // Tenant books rental property
    bookProperty(propertyId, req) {
        return this.propertiesService.bookProperty(propertyId, req.user.id);
    }
    // Buyer buys property for sale
    buyProperty(id, req) {
        return this.propertiesService.buyProperty(id, req.user.id);
    }
    update(id, updatePropertyDto, req) {
        return this.propertiesService.update(id, updatePropertyDto, req.user.id);
    }
    remove(id, req) {
        return this.propertiesService.remove(id, req.user.id);
    }
    verifyProperty(id) {
        return this.propertiesService.verifyProperty(id);
    }
    async uploadImages(files) {
        const urls = files.map(file => `/uploads/properties/${file.filename}`);
        return { urls };
    }
    // Landlord approves a booking
    approveBooking(bookingId, req) {
        return this.propertiesService.approveBooking(bookingId, req.user.id);
    }
    // Seller approves a purchase
    approvePurchase(purchaseId) {
        return this.propertiesService.approvePurchase(purchaseId);
    }
    // Seller rejects a purchase
    rejectPurchase(purchaseId, reason) {
        return this.propertiesService.rejectPurchase(purchaseId, reason);
    }
    // Landlord rejects a booking
    rejectBooking(bookingId, body, req) {
        return this.propertiesService.rejectBooking(bookingId, body.reason, req.user.id);
    }
    // Process payment for approved booking
    processPayment(bookingId, body, req) {
        return this.propertiesService.processPayment(bookingId, body.paymentMethod, req.user.id);
    }
    // Get booking details for payment
    getPaymentDetails(bookingId, req) {
        return this.propertiesService.getPaymentDetails(bookingId, req.user.id);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('owner/:ownerId'),
    __param(0, (0, common_1.Param)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getPropertiesByOwner", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('pending-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('pending-purchases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getPendingPurchases", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getMyProperties", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('USER'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Post)('rent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "createRental", null);
__decorate([
    (0, common_1.Post)('sale'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "createSale", null);
__decorate([
    (0, common_1.Post)(':id/book'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TENANT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "bookProperty", null);
__decorate([
    (0, common_1.Post)(':id/buy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BUYER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "buyProperty", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "verifyProperty", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/properties',
            filename: (req, file, cb) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)('bookings/:id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "approveBooking", null);
__decorate([
    (0, common_1.Post)('purchases/:purchaseId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Param)('purchaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "approvePurchase", null);
__decorate([
    (0, common_1.Post)('purchases/:purchaseId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Param)('purchaseId')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "rejectPurchase", null);
__decorate([
    (0, common_1.Post)('bookings/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PROPERTY_OWNER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "rejectBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/payment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('USER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('bookings/:id/payment-details'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('USER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getPaymentDetails", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map