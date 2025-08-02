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
exports.ExchangeProduct = void 0;
const typeorm_1 = require("typeorm");
let ExchangeProduct = class ExchangeProduct {
};
exports.ExchangeProduct = ExchangeProduct;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExchangeProduct.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'your_name', length: 255 }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "yourName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'your_phone', length: 20, nullable: true }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "yourPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'your_email', length: 255, nullable: true }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "yourEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', length: 255 }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_condition', length: 20 }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "itemCondition", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        length: 20,
        default: 'pending'
    }),
    __metadata("design:type", String)
], ExchangeProduct.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExchangeProduct.prototype, "createdAt", void 0);
exports.ExchangeProduct = ExchangeProduct = __decorate([
    (0, typeorm_1.Entity)('exchange_product')
], ExchangeProduct);
//# sourceMappingURL=exchange-product.entity.js.map