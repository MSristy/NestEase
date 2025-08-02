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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const service_provider_entity_1 = require("../service-providers/service-provider.entity");
const service_booking_entity_1 = require("../service-providers/service-booking.entity");
const property_entity_1 = require("../properties/property.entity");
const property_booking_entity_1 = require("../properties/property-booking.entity");
const swap_request_entity_1 = require("../properties/swap-request.entity");
const swap_item_entity_1 = require("../save-and-swap/entities/swap-item.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['USER', 'SERVICE_PROVIDER', 'PROPERTY_OWNER', 'ADMIN'],
        default: 'USER'
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => service_provider_entity_1.ServiceProvider, serviceProvider => serviceProvider.user),
    __metadata("design:type", service_provider_entity_1.ServiceProvider)
], User.prototype, "serviceProvider", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_booking_entity_1.ServiceBooking, booking => booking.customer),
    __metadata("design:type", Array)
], User.prototype, "serviceBookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_entity_1.Property, property => property.owner),
    __metadata("design:type", Array)
], User.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_booking_entity_1.PropertyBooking, booking => booking.tenant),
    __metadata("design:type", Array)
], User.prototype, "propertyBookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => swap_request_entity_1.SwapRequest, swapRequest => swapRequest.requester),
    __metadata("design:type", Array)
], User.prototype, "swapRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => swap_item_entity_1.SwapItem, swapItem => swapItem.owner),
    __metadata("design:type", Array)
], User.prototype, "swapItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map