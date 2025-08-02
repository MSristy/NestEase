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
exports.ExchangeController = void 0;
const common_1 = require("@nestjs/common");
const exchange_service_1 = require("./exchange.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ExchangeController = class ExchangeController {
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    async addExchangeProduct(exchangeData) {
        try {
            // Validate required fields
            const requiredFields = ['yourName', 'productName', 'category', 'itemCondition', 'location', 'description', 'images'];
            const missingFields = requiredFields.filter(field => !exchangeData[field]);
            if (missingFields.length > 0) {
                throw new common_1.BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
            }
            // Validate field lengths
            if (exchangeData.yourName && exchangeData.yourName.length > 255) {
                throw new common_1.BadRequestException('Name must be less than 255 characters');
            }
            if (exchangeData.yourPhone && exchangeData.yourPhone.length > 20) {
                throw new common_1.BadRequestException('Phone number must be less than 20 characters');
            }
            if (exchangeData.yourEmail && exchangeData.yourEmail.length > 255) {
                throw new common_1.BadRequestException('Email must be less than 255 characters');
            }
            if (exchangeData.productName && exchangeData.productName.length > 255) {
                throw new common_1.BadRequestException('Product name must be less than 255 characters');
            }
            if (exchangeData.category && exchangeData.category.length > 100) {
                throw new common_1.BadRequestException('Category must be less than 100 characters');
            }
            if (exchangeData.itemCondition && exchangeData.itemCondition.length > 20) {
                throw new common_1.BadRequestException('Item condition must be less than 20 characters');
            }
            if (exchangeData.location && exchangeData.location.length > 255) {
                throw new common_1.BadRequestException('Location must be less than 255 characters');
            }
            const result = await this.exchangeService.createExchangeProduct(exchangeData);
            return { success: true, data: result };
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
            const products = await this.exchangeService.getAllExchangeProducts();
            return { success: true, data: products };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch exchange products: ' + error.message);
        }
    }
    async getExchangeProductById(id) {
        try {
            const product = await this.exchangeService.getExchangeProductById(id);
            if (!product) {
                throw new common_1.BadRequestException('Exchange product not found');
            }
            return { success: true, data: product };
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
            const products = await this.exchangeService.getExchangeProductsByUserEmail(email);
            return { success: true, data: products };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch exchange products: ' + error.message);
        }
    }
    // Get pending exchange requests for approval
    async getPendingRequests(req) {
        try {
            const user = req.user;
            if (!user) {
                throw new common_1.BadRequestException('User not authenticated');
            }
            const requests = await this.exchangeService.getPendingRequestsForUser(user.email);
            return { success: true, data: requests };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch pending requests: ' + error.message);
        }
    }
    // Accept an exchange request
    async acceptExchangeRequest(id, req) {
        try {
            const user = req.user;
            if (!user) {
                throw new common_1.BadRequestException('User not authenticated');
            }
            const result = await this.exchangeService.acceptExchangeRequest(id, user.email);
            return { success: true, data: result };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to accept exchange request: ' + error.message);
        }
    }
    // Decline an exchange request
    async declineExchangeRequest(id, req) {
        try {
            const user = req.user;
            if (!user) {
                throw new common_1.BadRequestException('User not authenticated');
            }
            const result = await this.exchangeService.declineExchangeRequest(id, user.email);
            return { success: true, data: result };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to decline exchange request: ' + error.message);
        }
    }
};
exports.ExchangeController = ExchangeController;
__decorate([
    (0, common_1.Post)('add-exchange'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "addExchangeProduct", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getAllExchangeProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getExchangeProductById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getExchangeProductsByUserEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pending-requests'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "acceptExchangeRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/decline'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "declineExchangeRequest", null);
exports.ExchangeController = ExchangeController = __decorate([
    (0, common_1.Controller)('exchange'),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService])
], ExchangeController);
//# sourceMappingURL=exchange.controller.js.map