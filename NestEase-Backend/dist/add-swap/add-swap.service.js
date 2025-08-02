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
exports.AddSwapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const add_swap_entity_1 = require("./entities/add-swap.entity");
let AddSwapService = class AddSwapService {
    constructor(addSwapRepository) {
        this.addSwapRepository = addSwapRepository;
    }
    async getSwapItem(id) {
        try {
            const item = await this.addSwapRepository.findOne({ where: { id } });
            if (!item) {
                throw new common_1.NotFoundException('Swap item not found');
            }
            return {
                success: true,
                data: {
                    id: item.id,
                    title: item.product_name,
                    category: item.category,
                    condition: item.item_condition,
                    description: item.description,
                    location: item.location,
                    imageUrl: `http://localhost:3001${item.images}`,
                    owner: {
                        name: item.owner_name,
                        phone: item.owner_phone,
                        email: item.owner_email,
                        swaps: 0,
                        rating: 0,
                    }
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Error fetching swap item:', error);
            throw new common_1.BadRequestException('Failed to fetch swap item');
        }
    }
    async getSwapItems(category) {
        try {
            const queryBuilder = this.addSwapRepository.createQueryBuilder('swap');
            if (category) {
                queryBuilder.where('swap.category = :category', { category });
            }
            const items = await queryBuilder.getMany();
            return {
                success: true,
                data: items.map(item => ({
                    id: item.id,
                    title: item.product_name,
                    category: item.category,
                    condition: item.item_condition,
                    description: item.description,
                    location: item.location,
                    imageUrl: `http://localhost:3001${item.images}`,
                    owner: {
                        name: item.owner_name,
                        swaps: 0,
                        rating: 0,
                    }
                }))
            };
        }
        catch (error) {
            console.error('Error fetching swap items:', error);
            throw new common_1.BadRequestException('Failed to fetch swap items');
        }
    }
    async getSwapItemsByUser(email) {
        try {
            const items = await this.addSwapRepository.find({
                where: { owner_email: email }
            });
            return {
                success: true,
                data: items.map(item => ({
                    id: item.id,
                    title: item.product_name,
                    category: item.category,
                    condition: item.item_condition,
                    description: item.description,
                    location: item.location,
                    image: item.images,
                    ownerName: item.owner_name,
                    phoneNumber: item.owner_phone,
                    email: item.owner_email,
                    createdAt: item.createdAt
                }))
            };
        }
        catch (error) {
            console.error('Error fetching user swap items:', error);
            throw new common_1.BadRequestException('Failed to fetch user swap items');
        }
    }
    async createSwapItem(formData) {
        var _a;
        // Validate required fields
        const requiredFields = [
            'owner_name',
            'owner_phone',
            'owner_email',
            'product_name',
            'category',
            'item_condition',
            'location',
            'description',
            'images',
        ];
        for (const field of requiredFields) {
            if (!((_a = formData[field]) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new common_1.BadRequestException(`${field.replace('_', ' ')} is required`);
            }
        }
        // Validate field lengths
        if (formData.owner_name.length > 100) {
            throw new common_1.BadRequestException('Owner name must be less than 100 characters');
        }
        if (formData.owner_phone.length > 20) {
            throw new common_1.BadRequestException('Phone number must be less than 20 characters');
        }
        if (formData.owner_email.length > 255) {
            throw new common_1.BadRequestException('Email must be less than 255 characters');
        }
        if (formData.product_name.length > 100) {
            throw new common_1.BadRequestException('Product name must be less than 100 characters');
        }
        if (formData.category.length > 50) {
            throw new common_1.BadRequestException('Category must be less than 50 characters');
        }
        if (formData.item_condition.length > 50) {
            throw new common_1.BadRequestException('Condition must be less than 50 characters');
        }
        if (formData.location.length > 100) {
            throw new common_1.BadRequestException('Location must be less than 100 characters');
        }
        if (formData.description.length > 1000) {
            throw new common_1.BadRequestException('Description must be less than 1000 characters');
        }
        try {
            const swapItem = this.addSwapRepository.create({
                owner_name: formData.owner_name.trim(),
                owner_phone: formData.owner_phone.trim(),
                owner_email: formData.owner_email.trim(),
                product_name: formData.product_name.trim(),
                category: formData.category.trim(),
                item_condition: formData.item_condition.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                images: formData.images,
            });
            const savedItem = await this.addSwapRepository.save(swapItem);
            return {
                success: true,
                data: savedItem,
            };
        }
        catch (error) {
            console.error('Error saving swap item:', error);
            throw new common_1.BadRequestException('Failed to save swap item to database');
        }
    }
};
exports.AddSwapService = AddSwapService;
exports.AddSwapService = AddSwapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(add_swap_entity_1.AddSwap)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddSwapService);
//# sourceMappingURL=add-swap.service.js.map