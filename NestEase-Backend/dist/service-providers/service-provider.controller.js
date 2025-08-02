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
exports.ServiceProviderController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const service_provider_service_1 = require("./service-provider.service");
const create_service_provider_dto_1 = require("./dto/create-service-provider.dto");
const update_service_provider_dto_1 = require("./dto/update-service-provider.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/role.enum");
let ServiceProviderController = class ServiceProviderController {
    constructor(serviceProviderService) {
        this.serviceProviderService = serviceProviderService;
    }
    create(files, createDto, req) {
        var _a;
        const userId = req.user.id;
        const imagePaths = ((_a = files === null || files === void 0 ? void 0 : files.images) === null || _a === void 0 ? void 0 : _a.map(file => `/uploads/services/${file.filename}`)) || [];
        console.log('Uploaded files:', files);
        console.log('Image paths:', imagePaths);
        // Convert rating to number if it's a string
        if (createDto.rating && typeof createDto.rating === 'string') {
            createDto.rating = parseFloat(createDto.rating);
        }
        return this.serviceProviderService.create(createDto, userId, imagePaths);
    }
    async bookService(id, bookingData, req) {
        console.log('=== BOOKING ENDPOINT DEBUG ===');
        console.log('Service ID:', id);
        console.log('Booking data:', bookingData);
        console.log('User from request:', req.user);
        console.log('User ID:', req.user.id);
        console.log('User role:', req.user.role);
        console.log('User email:', req.user.email);
        console.log('================================');
        const userId = req.user.id;
        const serviceId = parseInt(id);
        if (isNaN(serviceId)) {
            console.error('Invalid service ID:', id);
            throw new common_1.BadRequestException('Invalid service ID');
        }
        try {
            const result = await this.serviceProviderService.bookService(serviceId, bookingData, userId);
            console.log('Booking successful:', result);
            return result;
        }
        catch (error) {
            console.error('Booking failed:', error);
            throw error;
        }
    }
    async toggleFavorite(id, req) {
        const userId = req.user.id;
        const serviceId = parseInt(id);
        if (isNaN(serviceId)) {
            throw new common_1.BadRequestException('Invalid service ID');
        }
        return this.serviceProviderService.toggleFavorite(serviceId, userId);
    }
    async getFavorites(req) {
        const userId = req.user.id;
        return this.serviceProviderService.getFavorites(userId);
    }
    async getBookings(req) {
        const userId = req.user.id;
        return this.serviceProviderService.getBookings(userId);
    }
    async getServiceHistory(req) {
        const userId = req.user.id;
        return this.serviceProviderService.getServiceHistory(userId);
    }
    async getMyBookings(req) {
        const userId = req.user.id;
        return this.serviceProviderService.getMyBookings(userId);
    }
    async approveBooking(bookingId, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.serviceProviderService.approveBooking(bookingIdNum, userId);
    }
    async rejectBooking(bookingId, data, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.serviceProviderService.rejectBooking(bookingIdNum, userId, data.reason);
    }
    async cancelBooking(bookingId, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.serviceProviderService.cancelBooking(bookingIdNum, userId);
    }
    async processPayment(bookingId, data, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        if (!data.paymentMethod || !['cash', 'online'].includes(data.paymentMethod)) {
            throw new common_1.BadRequestException('Invalid payment method. Must be "cash" or "online"');
        }
        return this.serviceProviderService.processPayment(bookingIdNum, userId, data.paymentMethod);
    }
    async getPaymentOptions(bookingId, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.serviceProviderService.getPaymentOptions(bookingIdNum, userId);
    }
    async completeService(bookingId, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.serviceProviderService.completeService(bookingIdNum, userId);
    }
    findAllPublic() {
        return this.serviceProviderService.findAll();
    }
    findAll() {
        return this.serviceProviderService.findAll();
    }
    checkProfile(userId) {
        return this.serviceProviderService.checkProfile(parseInt(userId));
    }
    findOne(id) {
        return this.serviceProviderService.findOne(parseInt(id));
    }
    update(id, updateDto, req) {
        const userId = req.user.id;
        return this.serviceProviderService.update(parseInt(id), updateDto, userId);
    }
    remove(id, req) {
        const userId = req.user.id;
        return this.serviceProviderService.remove(parseInt(id), userId);
    }
};
exports.ServiceProviderController = ServiceProviderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 5 }
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/services',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_service_provider_dto_1.CreateServiceProviderDto, Object]),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/book'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "bookService", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Get)('favorites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "getFavorites", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "getServiceHistory", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Post)('bookings/:bookingId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "approveBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:bookingId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "rejectBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:bookingId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:bookingId/payment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('bookings/:bookingId/payment-options'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "getPaymentOptions", null);
__decorate([
    (0, common_1.Post)('bookings/:bookingId/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceProviderController.prototype, "completeService", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "checkProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_provider_dto_1.UpdateServiceProviderDto, Object]),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceProviderController.prototype, "remove", null);
exports.ServiceProviderController = ServiceProviderController = __decorate([
    (0, common_1.Controller)('service-providers'),
    __metadata("design:paramtypes", [service_provider_service_1.ServiceProviderService])
], ServiceProviderController);
//# sourceMappingURL=service-provider.controller.js.map