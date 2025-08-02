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
exports.Booking = exports.PaymentMethod = exports.PaymentStatus = exports.BookingStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const service_provider_entity_1 = require("../../service-providers/entities/service-provider.entity");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING_APPROVAL"] = "pending_approval";
    BookingStatus["APPROVED"] = "approved";
    BookingStatus["REJECTED"] = "rejected";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["ONLINE"] = "online";
    PaymentMethod["PENDING"] = "pending";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_provider_entity_1.ServiceProvider, { onDelete: 'CASCADE' }),
    __metadata("design:type", service_provider_entity_1.ServiceProvider)
], Booking.prototype, "serviceProvider", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Booking.prototype, "serviceProviderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Booking.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "serviceType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "serviceDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "serviceTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Booking.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING_APPROVAL
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.PENDING
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)()
], Booking);
//# sourceMappingURL=booking.entity.js.map