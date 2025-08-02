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
exports.Property = exports.PropertyStatus = exports.PropertyType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const property_booking_entity_1 = require("./property-booking.entity");
const save_and_swap_entity_1 = require("../save-and-swap/entities/save-and-swap.entity");
var PropertyType;
(function (PropertyType) {
    PropertyType["RENT"] = "RENT";
    PropertyType["SALE"] = "SALE";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["AVAILABLE"] = "AVAILABLE";
    PropertyStatus["PENDING"] = "PENDING";
    PropertyStatus["BOOKED"] = "BOOKED";
    PropertyStatus["SOLD"] = "SOLD";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
let Property = class Property {
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "yourName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "yourPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "yourEmail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "zipCode", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Property.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Property.prototype, "bedrooms", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Property.prototype, "bathrooms", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Property.prototype, "squareFeet", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyType,
        default: PropertyType.RENT
    }),
    __metadata("design:type", String)
], Property.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyStatus,
        default: PropertyStatus.AVAILABLE
    }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Array)
], Property.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "bachelorFriendly", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Property.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.properties),
    __metadata("design:type", user_entity_1.User)
], Property.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_booking_entity_1.PropertyBooking, booking => booking.property),
    __metadata("design:type", Array)
], Property.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => save_and_swap_entity_1.SaveAndSwap, saveAndSwap => saveAndSwap.property),
    __metadata("design:type", Array)
], Property.prototype, "saveAndSwaps", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "updatedAt", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)()
], Property);
//# sourceMappingURL=property.entity.js.map