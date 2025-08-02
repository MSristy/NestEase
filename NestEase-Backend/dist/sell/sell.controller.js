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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellController = void 0;
const common_1 = require("@nestjs/common");
const sell_service_1 = require("./sell.service");
let SellController = class SellController {
    constructor(sellService) {
        this.sellService = sellService;
    }
    async addSellProduct(productData) {
        try {
            const result = await this.sellService.createSellProduct(productData);
            return { success: true, data: result };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
    async getAllSellProducts() {
        try {
            const products = await this.sellService.getAllSellProducts();
            return { success: true, data: products };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
    async getSellProduct(id) {
        try {
            const product = await this.sellService.getSellProduct(parseInt(id));
            if (!product) {
                throw new common_1.NotFoundException('Sell product not found');
            }
            return { success: true, data: product };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return { success: false, message: error.message };
            }
            return { success: false, message: 'Failed to fetch sell product' };
        }
    }
};
exports.SellController = SellController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellController.prototype, "addSellProduct", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SellController.prototype, "getAllSellProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellController.prototype, "getSellProduct", null);
exports.SellController = SellController = __decorate([
    (0, common_1.Controller)('add-sell'),
    __metadata("design:paramtypes", [sell_service_1.SellService])
], SellController);
//# sourceMappingURL=sell.controller.js.map