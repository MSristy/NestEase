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
exports.PropertyPurchase = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const property_entity_1 = require("../property.entity");
let PropertyPurchase = class PropertyPurchase {
};
exports.PropertyPurchase = PropertyPurchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PropertyPurchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property),
    __metadata("design:type", property_entity_1.Property)
], PropertyPurchase.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], PropertyPurchase.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PropertyPurchase.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING'
    }),
    __metadata("design:type", String)
], PropertyPurchase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
        default: 'PENDING'
    }),
    __metadata("design:type", String)
], PropertyPurchase.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PropertyPurchase.prototype, "paymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PropertyPurchase.prototype, "paymentDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PropertyPurchase.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PropertyPurchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PropertyPurchase.prototype, "updatedAt", void 0);
exports.PropertyPurchase = PropertyPurchase = __decorate([
    (0, typeorm_1.Entity)()
], PropertyPurchase);
//# sourceMappingURL=property-purchase.entity.js.map