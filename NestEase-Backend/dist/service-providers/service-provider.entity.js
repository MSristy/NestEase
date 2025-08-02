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
exports.ServiceProvider = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const service_booking_entity_1 = require("./entities/service-booking.entity");
let ServiceProvider = class ServiceProvider {
};
exports.ServiceProvider = ServiceProvider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ServiceProvider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.serviceProvider),
    __metadata("design:type", user_entity_1.User)
], ServiceProvider.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_booking_entity_1.ServiceBooking, booking => booking.serviceProvider),
    __metadata("design:type", Array)
], ServiceProvider.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceProvider.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceProvider.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ServiceProvider.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceProvider.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], ServiceProvider.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ServiceProvider.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ServiceProvider.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ServiceProvider.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceProvider.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ServiceProvider.prototype, "contactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 2, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], ServiceProvider.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ServiceProvider.prototype, "totalRatings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ServiceProvider.prototype, "totalReviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceProvider.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ServiceProvider.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], ServiceProvider.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ServiceProvider.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ServiceProvider.prototype, "updatedAt", void 0);
exports.ServiceProvider = ServiceProvider = __decorate([
    (0, typeorm_1.Entity)('service_providers')
], ServiceProvider);
//# sourceMappingURL=service-provider.entity.js.map