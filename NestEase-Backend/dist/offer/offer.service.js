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
exports.OfferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_offer_entity_1 = require("./entities/item-offer.entity");
let OfferService = class OfferService {
    constructor(itemOfferRepository) {
        this.itemOfferRepository = itemOfferRepository;
    }
    async create(createOfferDto) {
        try {
            console.log('Creating offer with data:', createOfferDto);
            const offer = new item_offer_entity_1.ItemOffer();
            Object.assign(offer, Object.assign(Object.assign({}, createOfferDto), { owner_phone: createOfferDto.owner_phone || null, owner_email: createOfferDto.owner_email || null }));
            const savedOffer = await this.itemOfferRepository.save(offer);
            console.log('Created offer:', savedOffer);
            return savedOffer;
        }
        catch (error) {
            console.error('Error in create offer:', error);
            throw new Error(`Failed to create offer: ${error.message}`);
        }
    }
    async findAll() {
        try {
            console.log('Finding all offers...');
            const offers = await this.itemOfferRepository.find({
                order: { created_at: 'DESC' }
            });
            console.log('Found offers:', offers);
            return offers;
        }
        catch (error) {
            console.error('Error in findAll offers:', error);
            throw new Error(`Failed to fetch offers: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            console.log('Finding offer with id:', id);
            const offer = await this.itemOfferRepository.findOne({ where: { id } });
            if (!offer) {
                console.log('Offer not found');
                throw new common_1.NotFoundException(`Offer with ID ${id} not found`);
            }
            console.log('Found offer:', offer);
            return offer;
        }
        catch (error) {
            console.error('Error in findOne offer:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch offer: ${error.message}`);
        }
    }
    async createOffer(offerData) {
        try {
            const offer = this.itemOfferRepository.create(offerData);
            return await this.itemOfferRepository.save(offer);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create offer: ${error.message}`);
            }
            throw new Error('Failed to create offer');
        }
    }
    async getAllOffers(category) {
        try {
            if (category) {
                return await this.itemOfferRepository.find({
                    where: { category },
                    order: { created_at: 'DESC' }
                });
            }
            return await this.itemOfferRepository.find({
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch offers: ${error.message}`);
            }
            throw new Error('Failed to fetch offers');
        }
    }
    async getOffer(id) {
        try {
            const offer = await this.itemOfferRepository.findOne({ where: { id } });
            if (!offer) {
                throw new common_1.NotFoundException('Offer not found');
            }
            return offer;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error instanceof Error) {
                throw new Error(`Failed to fetch offer: ${error.message}`);
            }
            throw new Error('Failed to fetch offer');
        }
    }
};
exports.OfferService = OfferService;
exports.OfferService = OfferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_offer_entity_1.ItemOffer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OfferService);
//# sourceMappingURL=offer.service.js.map