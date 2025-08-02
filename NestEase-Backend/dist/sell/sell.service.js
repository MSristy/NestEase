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
exports.SellService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sell_entity_1 = require("./sell.entity");
let SellService = class SellService {
    constructor(sellProductRepository) {
        this.sellProductRepository = sellProductRepository;
    }
    async createSellProduct(productData) {
        try {
            const product = this.sellProductRepository.create(productData);
            return await this.sellProductRepository.save(product);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create sell product: ${error.message}`);
            }
            throw new Error('Failed to create sell product');
        }
    }
    async getAllSellProducts() {
        try {
            return await this.sellProductRepository.find();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch sell products: ${error.message}`);
            }
            throw new Error('Failed to fetch sell products');
        }
    }
    async getSellProduct(id) {
        try {
            const product = await this.sellProductRepository.findOne({ where: { id } });
            if (!product) {
                throw new common_1.NotFoundException('Sell product not found');
            }
            return product;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error instanceof Error) {
                throw new Error(`Failed to fetch sell product: ${error.message}`);
            }
            throw new Error('Failed to fetch sell product');
        }
    }
};
exports.SellService = SellService;
exports.SellService = SellService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sell_entity_1.SellProduct)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SellService);
//# sourceMappingURL=sell.service.js.map