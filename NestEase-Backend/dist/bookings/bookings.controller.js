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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/role.enum");
let BookingsController = class BookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async createBooking(serviceId, bookingData, req) {
        const userId = req.user.id;
        const serviceIdNum = parseInt(serviceId);
        if (isNaN(serviceIdNum)) {
            throw new common_1.BadRequestException('Invalid service ID');
        }
        return this.bookingsService.createBooking(serviceIdNum, bookingData, userId);
    }
    async getMyBookings(req) {
        const userId = req.user.id;
        return this.bookingsService.getMyBookings(userId);
    }
    async getCustomerBookings(req) {
        const userId = req.user.id;
        return this.bookingsService.getCustomerBookings(userId);
    }
    async approveBooking(bookingId, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.bookingsService.approveBooking(bookingIdNum, userId);
    }
    async rejectBooking(bookingId, data, req) {
        const userId = req.user.id;
        const bookingIdNum = parseInt(bookingId);
        if (isNaN(bookingIdNum)) {
            throw new common_1.BadRequestException('Invalid booking ID');
        }
        return this.bookingsService.rejectBooking(bookingIdNum, userId, data.reason);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('service/:serviceId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Param)('serviceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)('customer-bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getCustomerBookings", null);
__decorate([
    (0, common_1.Post)(':bookingId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "approveBooking", null);
__decorate([
    (0, common_1.Post)(':bookingId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SERVICE_PROVIDER),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "rejectBooking", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map