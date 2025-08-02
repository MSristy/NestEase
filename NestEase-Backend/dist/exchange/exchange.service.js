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
exports.ExchangeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exchange_product_entity_1 = require("./entities/exchange-product.entity");
let ExchangeService = class ExchangeService {
    constructor(exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }
    async createExchangeProduct(exchangeData) {
        try {
            // Validate required fields
            const requiredFields = ['yourName', 'productName', 'category', 'itemCondition', 'location', 'description', 'images'];
            const missingFields = requiredFields.filter(field => !exchangeData[field]);
            if (missingFields.length > 0) {
                throw new common_1.BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
            }
            // Create new exchange product instance with the correct property names
            const exchangeProduct = new exchange_product_entity_1.ExchangeProduct();
            exchangeProduct.yourName = exchangeData.yourName;
            exchangeProduct.yourPhone = exchangeData.yourPhone || '';
            exchangeProduct.yourEmail = exchangeData.yourEmail || '';
            exchangeProduct.productName = exchangeData.productName;
            exchangeProduct.category = exchangeData.category;
            exchangeProduct.itemCondition = exchangeData.itemCondition;
            exchangeProduct.location = exchangeData.location;
            exchangeProduct.description = exchangeData.description;
            exchangeProduct.images = exchangeData.images;
            exchangeProduct.status = exchangeData.status || 'pending';
            exchangeProduct.createdAt = new Date();
            // Save to database
            const savedProduct = await this.exchangeRepository.save(exchangeProduct);
            if (!savedProduct) {
                throw new common_1.BadRequestException('Failed to save exchange product');
            }
            return savedProduct;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create exchange product: ' + error.message);
        }
    }
    async getAllExchangeProducts() {
        try {
            return await this.exchangeRepository.find({
                order: {
                    createdAt: 'DESC'
                }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch exchange products: ' + error.message);
        }
    }
    async getExchangeProductById(id) {
        try {
            const product = await this.exchangeRepository.findOne({ where: { id } });
            if (!product) {
                throw new common_1.BadRequestException('Exchange product not found');
            }
            return product;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch exchange product: ' + error.message);
        }
    }
    async getExchangeProductsByUserEmail(email) {
        try {
            const products = await this.exchangeRepository.find({
                where: { yourEmail: email },
                order: {
                    createdAt: 'DESC'
                }
            });
            return products;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch exchange products: ' + error.message);
        }
    }
    // Get pending exchange requests for a user (where they are the owner)
    async getPendingRequestsForUser(userEmail) {
        try {
            const requests = await this.exchangeRepository.find({
                where: {
                    yourEmail: userEmail,
                    status: 'pending'
                },
                order: {
                    createdAt: 'DESC'
                }
            });
            return requests;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch pending requests: ' + error.message);
        }
    }
    // Accept an exchange request
    async acceptExchangeRequest(id, userEmail) {
        try {
            const product = await this.exchangeRepository.findOne({
                where: {
                    id,
                    yourEmail: userEmail
                }
            });
            if (!product) {
                throw new common_1.BadRequestException('Exchange product not found or you are not the owner');
            }
            if (product.status !== 'pending') {
                throw new common_1.BadRequestException('This exchange request is not pending');
            }
            product.status = 'accepted';
            return await this.exchangeRepository.save(product);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to accept exchange request: ' + error.message);
        }
    }
    // Decline an exchange request
    async declineExchangeRequest(id, userEmail) {
        try {
            const product = await this.exchangeRepository.findOne({
                where: {
                    id,
                    yourEmail: userEmail
                }
            });
            if (!product) {
                throw new common_1.BadRequestException('Exchange product not found or you are not the owner');
            }
            if (product.status !== 'pending') {
                throw new common_1.BadRequestException('This exchange request is not pending');
            }
            product.status = 'declined';
            return await this.exchangeRepository.save(product);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to decline exchange request: ' + error.message);
        }
    }
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exchange_product_entity_1.ExchangeProduct)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExchangeService);
//# sourceMappingURL=exchange.service.js.map