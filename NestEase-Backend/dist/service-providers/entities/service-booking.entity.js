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
exports.ServiceBooking = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const service_provider_entity_1 = require("../service-provider.entity");
let ServiceBooking = class ServiceBooking {
};
exports.ServiceBooking = ServiceBooking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ServiceBooking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ServiceBooking.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_provider_entity_1.ServiceProvider, serviceProvider => serviceProvider.bookings),
    __metadata("design:type", service_provider_entity_1.ServiceProvider)
], ServiceBooking.prototype, "serviceProvider", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ServiceBooking.prototype, "serviceDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceBooking.prototype, "serviceTime", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], ServiceBooking.prototype, "requestedServices", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ServiceBooking.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ServiceBooking.prototype, "finalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
        default: 'PENDING'
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "paymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ServiceBooking.prototype, "paymentDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ServiceBooking.prototype, "isRefundable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], ServiceBooking.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ServiceBooking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ServiceBooking.prototype, "updatedAt", void 0);
exports.ServiceBooking = ServiceBooking = __decorate([
    (0, typeorm_1.Entity)()
], ServiceBooking);
//# sourceMappingURL=service-booking.entity.js.map