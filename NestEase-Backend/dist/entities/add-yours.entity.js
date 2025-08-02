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
exports.AddYours = void 0;
const typeorm_1 = require("typeorm");
let AddYours = class AddYours {
};
exports.AddYours = AddYours;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AddYours.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AddYours.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AddYours.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AddYours.prototype, "transaction_type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], AddYours.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_condition' }),
    __metadata("design:type", String)
], AddYours.prototype, "itemCondition", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], AddYours.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AddYours.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AddYours.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AddYours.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AddYours.prototype, "owner_name", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AddYours.prototype, "swap_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AddYours.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AddYours.prototype, "original_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], AddYours.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AddYours.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AddYours.prototype, "updated_at", void 0);
exports.AddYours = AddYours = __decorate([
    (0, typeorm_1.Entity)('add_yours')
], AddYours);
//# sourceMappingURL=add-yours.entity.js.map