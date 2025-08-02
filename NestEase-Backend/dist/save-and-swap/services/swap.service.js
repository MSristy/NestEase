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
exports.SwapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const swap_item_entity_1 = require("../entities/swap-item.entity");
const swap_request_entity_1 = require("../entities/swap-request.entity");
const stripe_service_1 = require("../../payment/stripe.service");
const user_entity_1 = require("../../users/user.entity");
let SwapService = class SwapService {
    constructor(swapItemRepository, swapRequestRepository, userRepository, stripeService) {
        this.swapItemRepository = swapItemRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }
    async createSwapItem(createDto, userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const swapItem = this.swapItemRepository.create(Object.assign(Object.assign({}, createDto), { owner: user }));
        return this.swapItemRepository.save(swapItem);
    }
    async findAllSwapItems() {
        return this.swapItemRepository.find({
            relations: ['owner'],
        });
    }
    async findOneSwapItem(id) {
        const swapItem = await this.swapItemRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!swapItem) {
            throw new common_1.NotFoundException('Swap item not found');
        }
        return swapItem;
    }
    async createSwapRequest(createDto, userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const requestedItem = await this.findOneSwapItem(createDto.requestedItemId);
        const offeredItem = await this.findOneSwapItem(createDto.offeredItemId);
        if (offeredItem.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You can only offer items that you own');
        }
        const swapRequest = this.swapRequestRepository.create({
            requester: user,
            requestedItem,
            offeredItem,
            status: 'PENDING',
        });
        return this.swapRequestRepository.save(swapRequest);
    }
    async acceptSwapRequest(id, userId) {
        const swapRequest = await this.swapRequestRepository.findOne({
            where: { id },
            relations: ['requestedItem', 'offeredItem', 'requester'],
        });
        if (!swapRequest) {
            throw new common_1.NotFoundException('Swap request not found');
        }
        if (swapRequest.requestedItem.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You can only accept swap requests for your items');
        }
        if (swapRequest.status !== 'PENDING') {
            throw new common_1.BadRequestException('This swap request is no longer pending');
        }
        swapRequest.status = 'ACCEPTED';
        return this.swapRequestRepository.save(swapRequest);
    }
    async rejectSwapRequest(id, userId) {
        const swapRequest = await this.swapRequestRepository.findOne({
            where: { id },
            relations: ['requestedItem', 'offeredItem', 'requester'],
        });
        if (!swapRequest) {
            throw new common_1.NotFoundException('Swap request not found');
        }
        if (swapRequest.requestedItem.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You can only reject swap requests for your items');
        }
        if (swapRequest.status !== 'PENDING') {
            throw new common_1.BadRequestException('This swap request is no longer pending');
        }
        swapRequest.status = 'REJECTED';
        return this.swapRequestRepository.save(swapRequest);
    }
    async findAllSwapRequests(userId) {
        return this.swapRequestRepository.find({
            where: [
                { requester: { id: userId } },
                { requestedItem: { owner: { id: userId } } },
            ],
            relations: ['requester', 'requestedItem', 'offeredItem'],
        });
    }
    async completeSwap(id, userId) {
        const swapRequest = await this.swapRequestRepository.findOne({
            where: { id },
            relations: ['requestedItem', 'offeredItem', 'requester'],
        });
        if (!swapRequest) {
            throw new common_1.NotFoundException('Swap request not found');
        }
        if (swapRequest.status !== 'ACCEPTED') {
            throw new common_1.BadRequestException('Can only complete accepted swap requests');
        }
        if (swapRequest.requester.id !== userId && swapRequest.requestedItem.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to complete this swap');
        }
        // Update item ownership
        const tempOwner = swapRequest.requestedItem.owner;
        swapRequest.requestedItem.owner = swapRequest.offeredItem.owner;
        swapRequest.offeredItem.owner = tempOwner;
        await this.swapItemRepository.save([swapRequest.requestedItem, swapRequest.offeredItem]);
        swapRequest.status = 'COMPLETED';
        return this.swapRequestRepository.save(swapRequest);
    }
    async addReview(requestId, userId, rating, review) {
        const request = await this.swapRequestRepository.findOne({
            where: { id: requestId },
            relations: ['requester', 'requestedItem', 'offeredItem']
        });
        if (!request) {
            throw new common_1.NotFoundException('Swap request not found');
        }
        if (request.requester.id !== userId && request.requestedItem.owner.id !== userId) {
            throw new common_1.BadRequestException('Only participants can add reviews');
        }
        if (request.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Can only review completed swaps');
        }
        request.rating = rating;
        request.review = review;
        return await this.swapRequestRepository.save(request);
    }
};
exports.SwapService = SwapService;
exports.SwapService = SwapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(swap_item_entity_1.SwapItem)),
    __param(1, (0, typeorm_1.InjectRepository)(swap_request_entity_1.SwapRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_service_1.StripeService])
], SwapService);
//# sourceMappingURL=swap.service.js.map