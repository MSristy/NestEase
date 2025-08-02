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
exports.SwapRequest = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const swap_item_entity_1 = require("./swap-item.entity");
let SwapRequest = class SwapRequest {
};
exports.SwapRequest = SwapRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SwapRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.swapRequests),
    __metadata("design:type", user_entity_1.User)
], SwapRequest.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => swap_item_entity_1.SwapItem),
    __metadata("design:type", swap_item_entity_1.SwapItem)
], SwapRequest.prototype, "requestedItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => swap_item_entity_1.SwapItem),
    __metadata("design:type", swap_item_entity_1.SwapItem)
], SwapRequest.prototype, "offeredItem", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING'
    }),
    __metadata("design:type", String)
], SwapRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SwapRequest.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], SwapRequest.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SwapRequest.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SwapRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SwapRequest.prototype, "updatedAt", void 0);
exports.SwapRequest = SwapRequest = __decorate([
    (0, typeorm_1.Entity)()
], SwapRequest);
//# sourceMappingURL=swap-request.entity.js.map