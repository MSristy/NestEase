import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/property.entity';
import { ServiceProvider } from '../service-providers/entities/service-provider.entity';
import { SaveAndSwap } from '../save-and-swap/entities/save-and-swap.entity';
import { AddSwap } from '../add-swap/entities/add-swap.entity';
import { SellProduct } from '../sell/sell.entity';
import { ItemOffer } from '../offer/entities/item-offer.entity';
import { JobApplication } from '../careers/entities/job-application.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(ServiceProvider)
    private serviceProvidersRepository: Repository<ServiceProvider>,
    @InjectRepository(SaveAndSwap)
    private saveAndSwapRepository: Repository<SaveAndSwap>,
    @InjectRepository(AddSwap)
    private addSwapRepository: Repository<AddSwap>,
    @InjectRepository(SellProduct)
    private sellProductRepository: Repository<SellProduct>,
    @InjectRepository(ItemOffer)
    private itemOfferRepository: Repository<ItemOffer>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
  ) {}

  // User Management
  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserStatus(id: number, isActive: boolean) {
    const user = await this.getUserById(id);
    user.isActive = isActive;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    return this.usersRepository.remove(user);
  }

  // Property Management
  async getAllProperties() {
    return this.propertiesRepository.find({
      relations: ['owner'],
    });
  }

  async getPropertyById(id: string) {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async verifyProperty(id: string) {
    const property = await this.getPropertyById(id);
    property.isVerified = true;
    return this.propertiesRepository.save(property);
  }

  async deleteProperty(id: string) {
    const property = await this.getPropertyById(id);
    return this.propertiesRepository.remove(property);
  }

  // Service Provider Management
  async getAllServiceProviders() {
    return this.serviceProvidersRepository.find({
      relations: ['owner'],
    });
  }

  async getServiceProviderById(id: number) {
    const serviceProvider = await this.serviceProvidersRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }
    return serviceProvider;
  }

  async verifyServiceProvider(id: number) {
    const serviceProvider = await this.getServiceProviderById(id);
    serviceProvider.isVerified = true;
    return this.serviceProvidersRepository.save(serviceProvider);
  }

  async deleteServiceProvider(id: number) {
    const serviceProvider = await this.getServiceProviderById(id);
    return this.serviceProvidersRepository.remove(serviceProvider);
  }

  // Save & Swap Management
  async getAllSaveAndSwaps() {
    return this.saveAndSwapRepository.find({
      relations: ['user', 'property'],
    });
  }

  async getSaveAndSwapById(id: number) {
    const saveAndSwap = await this.saveAndSwapRepository.findOne({
      where: { id },
      relations: ['user', 'property'],
    });
    if (!saveAndSwap) {
      throw new NotFoundException('Save and Swap not found');
    }
    return saveAndSwap;
  }

  async completeSaveAndSwap(id: number) {
    const saveAndSwap = await this.getSaveAndSwapById(id);
    saveAndSwap.isCompleted = true;
    return this.saveAndSwapRepository.save(saveAndSwap);
  }

  async deleteSaveAndSwap(id: number) {
    const saveAndSwap = await this.getSaveAndSwapById(id);
    return this.saveAndSwapRepository.remove(saveAndSwap);
  }

  // Barter Items Management - Add Swap Items
  async getAllAddSwapItems() {
    return this.addSwapRepository.find();
  }

  async getAddSwapItemById(id: number) {
    const item = await this.addSwapRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Add Swap item not found');
    }
    return item;
  }

  async deleteAddSwapItem(id: number) {
    const item = await this.getAddSwapItemById(id);
    return this.addSwapRepository.remove(item);
  }

  // Barter Items Management - Sell Products
  async getAllSellProducts() {
    return this.sellProductRepository.find();
  }

  async getSellProductById(id: number) {
    const item = await this.sellProductRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Sell product not found');
    }
    return item;
  }

  async deleteSellProduct(id: number) {
    const item = await this.getSellProductById(id);
    return this.sellProductRepository.remove(item);
  }

  // Barter Items Management - Item Offers
  async getAllItemOffers() {
    return this.itemOfferRepository.find();
  }

  async getItemOfferById(id: number) {
    const item = await this.itemOfferRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item offer not found');
    }
    return item;
  }

  async deleteItemOffer(id: number) {
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
    const [
      totalUsers,
      totalProperties,
      verifiedProperties,
      totalServiceProviders,
      totalAddSwapItems,
      totalSellProducts,
      totalItemOffers,
      totalJobApplications,
    ] = await Promise.all([
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
    const [
      totalUsers,
      activeUsers,
      totalProperties,
      verifiedProperties,
      totalServiceProviders,
      verifiedServiceProviders,
      totalSaveAndSwaps,
      completedSaveAndSwaps,
      totalAddSwapItems,
      totalSellProducts,
      totalItemOffers,
    ] = await Promise.all([
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
  async promoteUserToAdmin(userId: number) {
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
} 