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
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
const book_property_dto_1 = require("./dto/book-property.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/role.enum");
let PropertyController = class PropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    create(createPropertyDto, req) {
        const userId = req.user.id;
        return this.propertyService.create(createPropertyDto, userId);
    }
    findAll() {
        return this.propertyService.findAll();
    }
    findOne(id) {
        return this.propertyService.findOne(id);
    }
    update(id, updatePropertyDto, req) {
        const userId = req.user.id;
        return this.propertyService.update(id, updatePropertyDto, userId);
    }
    remove(id, req) {
        const userId = req.user.id;
        return this.propertyService.remove(id, userId);
    }
    bookProperty(id, bookingDto, req) {
        const userId = req.user.id;
        return this.propertyService.bookProperty(id, userId, bookingDto);
    }
    async confirmBooking(bookingId) {
        return await this.propertyService.confirmBooking(bookingId);
    }
    async cancelBooking(bookingId, reason) {
        return await this.propertyService.cancelBooking(bookingId, reason);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.PROPERTY_OWNER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.PROPERTY_OWNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto, Object]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.PROPERTY_OWNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/book'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, book_property_dto_1.BookPropertyDto, Object]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "bookProperty", null);
__decorate([
    (0, common_1.Post)('bookings/:id/confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "cancelBooking", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('properties'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map