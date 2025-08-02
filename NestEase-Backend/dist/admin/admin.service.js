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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const property_entity_1 = require("../properties/property.entity");
const service_provider_entity_1 = require("../service-providers/entities/service-provider.entity");
const save_and_swap_entity_1 = require("../save-and-swap/entities/save-and-swap.entity");
const add_swap_entity_1 = require("../add-swap/entities/add-swap.entity");
const sell_entity_1 = require("../sell/sell.entity");
const item_offer_entity_1 = require("../offer/entities/item-offer.entity");
const job_application_entity_1 = require("../careers/entities/job-application.entity");
let AdminService = class AdminService {
    constructor(usersRepository, propertiesRepository, serviceProvidersRepository, saveAndSwapRepository, addSwapRepository, sellProductRepository, itemOfferRepository, jobApplicationRepository) {
        this.usersRepository = usersRepository;
        this.propertiesRepository = propertiesRepository;
        this.serviceProvidersRepository = serviceProvidersRepository;
        this.saveAndSwapRepository = saveAndSwapRepository;
        this.addSwapRepository = addSwapRepository;
        this.sellProductRepository = sellProductRepository;
        this.itemOfferRepository = itemOfferRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }
    // User Management
    async getAllUsers() {
        return this.usersRepository.find();
    }
    async getUserById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUserStatus(id, isActive) {
        const user = await this.getUserById(id);
        user.isActive = isActive;
        return this.usersRepository.save(user);
    }
    async deleteUser(id) {
        const user = await this.getUserById(id);
        return this.usersRepository.remove(user);
    }
    // Property Management
    async getAllProperties() {
        return this.propertiesRepository.find({
            relations: ['owner'],
        });
    }
    async getPropertyById(id) {
        const property = await this.propertiesRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        return property;
    }
    async verifyProperty(id) {
        const property = await this.getPropertyById(id);
        property.isVerified = true;
        return this.propertiesRepository.save(property);
    }
    async deleteProperty(id) {
        const property = await this.getPropertyById(id);
        return this.propertiesRepository.remove(property);
    }
    // Service Provider Management
    async getAllServiceProviders() {
        return this.serviceProvidersRepository.find({
            relations: ['owner'],
        });
    }
    async getServiceProviderById(id) {
        const serviceProvider = await this.serviceProvidersRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!serviceProvider) {
            throw new common_1.NotFoundException('Service provider not found');
        }
        return serviceProvider;
    }
    async verifyServiceProvider(id) {
        const serviceProvider = await this.getServiceProviderById(id);
        serviceProvider.isVerified = true;
        return this.serviceProvidersRepository.save(serviceProvider);
    }
    async deleteServiceProvider(id) {
        const serviceProvider = await this.getServiceProviderById(id);
        return this.serviceProvidersRepository.remove(serviceProvider);
    }
    // Save & Swap Management
    async getAllSaveAndSwaps() {
        return this.saveAndSwapRepository.find({
            relations: ['user', 'property'],
        });
    }
    async getSaveAndSwapById(id) {
        const saveAndSwap = await this.saveAndSwapRepository.findOne({
            where: { id },
            relations: ['user', 'property'],
        });
        if (!saveAndSwap) {
            throw new common_1.NotFoundException('Save and Swap not found');
        }
        return saveAndSwap;
    }
    async completeSaveAndSwap(id) {
        const saveAndSwap = await this.getSaveAndSwapById(id);
        saveAndSwap.isCompleted = true;
        return this.saveAndSwapRepository.save(saveAndSwap);
    }
    async deleteSaveAndSwap(id) {
        const saveAndSwap = await this.getSaveAndSwapById(id);
        return this.saveAndSwapRepository.remove(saveAndSwap);
    }
    // Barter Items Management - Add Swap Items
    async getAllAddSwapItems() {
        return this.addSwapRepository.find();
    }
    async getAddSwapItemById(id) {
        const item = await this.addSwapRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Add Swap item not found');
        }
        return item;
    }
    async deleteAddSwapItem(id) {
        const item = await this.getAddSwapItemById(id);
        return this.addSwapRepository.remove(item);
    }
    // Barter Items Management - Sell Products
    async getAllSellProducts() {
        return this.sellProductRepository.find();
    }
    async getSellProductById(id) {
        const item = await this.sellProductRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Sell product not found');
        }
        return item;
    }
    async deleteSellProduct(id) {
        const item = await this.getSellProductById(id);
        return this.sellProductRepository.remove(item);
    }
    // Barter Items Management - Item Offers
    async getAllItemOffers() {
        return this.itemOfferRepository.find();
    }
    async getItemOfferById(id) {
        const item = await this.itemOfferRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Item offer not found');
        }
        return item;
    }
    async deleteItemOffer(id) {
        const item = await this.getItemOfferById(id);
        return this.itemOfferRepository.remove(item);
    }
    // Get barter stats for debugging
    async getBarterStats() {
        const addSwapItems = await this.addSwapRepository.count();
        const sellProducts = await this.sellProductRepository.count();
        const itemOffers = await this.itemOfferRepository.count();
        return {
            addSwapItems,
            sellProducts,
            itemOffers,
            total: addSwapItems + sellProducts + itemOffers
        };
    }
    // Get public stats for about page
    async getPublicStats() {
        const [totalUsers, totalProperties, verifiedProperties, totalServiceProviders, totalAddSwapItems, totalSellProducts, totalItemOffers, totalJobApplications,] = await Promise.all([
            this.usersRepository.count(),
            this.propertiesRepository.count(),
            this.propertiesRepository.count({ where: { isVerified: true } }),
            this.serviceProvidersRepository.count(),
            this.addSwapRepository.count(),
            this.sellProductRepository.count(),
            this.itemOfferRepository.count(),
            this.jobApplicationRepository.count(),
        ]);
        return {
            users: {
                total: totalUsers,
            },
            properties: {
                total: totalProperties,
                verified: verifiedProperties,
            },
            serviceProviders: {
                total: totalServiceProviders,
            },
            barterItems: {
                addSwapItems: totalAddSwapItems,
                sellProducts: totalSellProducts,
                itemOffers: totalItemOffers,
                total: totalAddSwapItems + totalSellProducts + totalItemOffers,
            },
            jobApplications: {
                total: totalJobApplications,
            },
        };
    }
    // Dashboard Stats
    async getDashboardStats() {
        const [totalUsers, activeUsers, totalProperties, verifiedProperties, totalServiceProviders, verifiedServiceProviders, totalSaveAndSwaps, completedSaveAndSwaps, totalAddSwapItems, totalSellProducts, totalItemOffers,] = await Promise.all([
            this.usersRepository.count(),
            this.usersRepository.count({ where: { isActive: true } }),
            this.propertiesRepository.count(),
            this.propertiesRepository.count({ where: { isVerified: true } }),
            this.serviceProvidersRepository.count(),
            this.serviceProvidersRepository.count({ where: { isVerified: true } }),
            this.saveAndSwapRepository.count(),
            this.saveAndSwapRepository.count({ where: { isCompleted: true } }),
            this.addSwapRepository.count(),
            this.sellProductRepository.count(),
            this.itemOfferRepository.count(),
        ]);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
            },
            properties: {
                total: totalProperties,
                verified: verifiedProperties,
            },
            serviceProviders: {
                total: totalServiceProviders,
                verified: verifiedServiceProviders,
            },
            saveAndSwaps: {
                total: totalSaveAndSwaps,
                completed: completedSaveAndSwaps,
            },
            barterItems: {
                addSwapItems: totalAddSwapItems,
                sellProducts: totalSellProducts,
                itemOffers: totalItemOffers,
            },
        };
    }
    // Admin Management
    async promoteUserToAdmin(userId) {
        const user = await this.getUserById(userId);
        user.role = 'admin';
        return this.usersRepository.save(user);
    }
    async getAllAdmins() {
        return this.usersRepository.find({
            where: { role: 'admin' },
            select: ['id', 'name', 'email', 'role', 'createdAt']
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(2, (0, typeorm_1.InjectRepository)(service_provider_entity_1.ServiceProvider)),
    __param(3, (0, typeorm_1.InjectRepository)(save_and_swap_entity_1.SaveAndSwap)),
    __param(4, (0, typeorm_1.InjectRepository)(add_swap_entity_1.AddSwap)),
    __param(5, (0, typeorm_1.InjectRepository)(sell_entity_1.SellProduct)),
    __param(6, (0, typeorm_1.InjectRepository)(item_offer_entity_1.ItemOffer)),
    __param(7, (0, typeorm_1.InjectRepository)(job_application_entity_1.JobApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map