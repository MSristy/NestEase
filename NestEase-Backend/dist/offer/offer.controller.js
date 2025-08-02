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
exports.OfferController = void 0;
const common_1 = require("@nestjs/common");
const offer_service_1 = require("./offer.service");
let OfferController = class OfferController {
    constructor(offerService) {
        this.offerService = offerService;
    }
    async create(createOfferDto) {
        try {
            console.log('Received create request with data:', createOfferDto);
            if (!createOfferDto.owner_name || !createOfferDto.product_name || !createOfferDto.price) {
                console.log('Missing required fields');
                throw new common_1.HttpException('Required fields are missing', common_1.HttpStatus.BAD_REQUEST);
            }
            const offer = await this.offerService.create(createOfferDto);
            console.log('Created offer successfully:', offer);
            return {
                success: true,
                data: offer
            };
        }
        catch (error) {
            console.error('Error creating offer:', error);
            return {
                success: false,
                message: error.message || 'Failed to create offer'
            };
        }
    }
    async findAll(category) {
        try {
            console.log('Received findAll request');
            const offers = await this.offerService.findAll();
            console.log('Found offers:', offers);
            return {
                success: true,
                data: offers
            };
        }
        catch (error) {
            console.error('Error fetching offers:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch offers'
            };
        }
    }
    async findOne(id) {
        try {
            console.log('Received findOne request for id:', id);
            const offer = await this.offerService.findOne(+id);
            if (!offer) {
                console.log('Offer not found');
                throw new common_1.HttpException('Offer not found', common_1.HttpStatus.NOT_FOUND);
            }
            console.log('Found offer:', offer);
            return {
                success: true,
                data: offer
            };
        }
        catch (error) {
            console.error('Error fetching offer:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch offer'
            };
        }
    }
};
exports.OfferController = OfferController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "findOne", null);
exports.OfferController = OfferController = __decorate([
    (0, common_1.Controller)('add-offer'),
    __metadata("design:paramtypes", [offer_service_1.OfferService])
], OfferController);
//# sourceMappingURL=offer.controller.js.map