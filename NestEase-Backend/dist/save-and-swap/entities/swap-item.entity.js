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
exports.SwapItem = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const swap_request_entity_1 = require("./swap-request.entity");
let SwapItem = class SwapItem {
};
exports.SwapItem = SwapItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SwapItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.swapItems),
    __metadata("design:type", user_entity_1.User)
], SwapItem.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwapItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SwapItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwapItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SwapItem.prototype, "estimatedValue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwapItem.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SwapItem.prototype, "preferredSwapCategories", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], SwapItem.prototype, "additionalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['AVAILABLE', 'PENDING', 'SWAPPED', 'INACTIVE'],
        default: 'AVAILABLE'
    }),
    __metadata("design:type", String)
], SwapItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SwapItem.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => swap_request_entity_1.SwapRequest, request => request.offeredItem),
    __metadata("design:type", Array)
], SwapItem.prototype, "offeredSwapRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => swap_request_entity_1.SwapRequest, request => request.requestedItem),
    __metadata("design:type", Array)
], SwapItem.prototype, "receivedSwapRequests", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwapItem.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SwapItem.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], SwapItem.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SwapItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SwapItem.prototype, "updatedAt", void 0);
exports.SwapItem = SwapItem = __decorate([
    (0, typeorm_1.Entity)('swap_items')
], SwapItem);
//# sourceMappingURL=swap-item.entity.js.map