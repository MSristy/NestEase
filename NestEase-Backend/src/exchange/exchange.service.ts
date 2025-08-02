import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeProduct } from './entities/exchange-product.entity';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(ExchangeProduct)
    private exchangeRepository: Repository<ExchangeProduct>,
  ) {}

  async createExchangeProduct(exchangeData: Partial<ExchangeProduct>): Promise<ExchangeProduct> {
    try {
      // Validate required fields
      const requiredFields = ['yourName', 'productName', 'category', 'itemCondition', 'location', 'description', 'images'];
      const missingFields = requiredFields.filter(field => !exchangeData[field as keyof ExchangeProduct]);
      
      if (missingFields.length > 0) {
        throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create new exchange product instance with the correct property names
      const exchangeProduct = new ExchangeProduct();
      exchangeProduct.yourName = exchangeData.yourName!;
      exchangeProduct.yourPhone = exchangeData.yourPhone || '';
      exchangeProduct.yourEmail = exchangeData.yourEmail || '';
      exchangeProduct.productName = exchangeData.productName!;
      exchangeProduct.category = exchangeData.category!;
      exchangeProduct.itemCondition = exchangeData.itemCondition!;
      exchangeProduct.location = exchangeData.location!;
      exchangeProduct.description = exchangeData.description!;
      exchangeProduct.images = exchangeData.images!;
      exchangeProduct.status = exchangeData.status || 'pending';
      exchangeProduct.createdAt = new Date();

      // Save to database
      const savedProduct = await this.exchangeRepository.save(exchangeProduct);
      
      if (!savedProduct) {
        throw new BadRequestException('Failed to save exchange product');
      }

      return savedProduct;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create exchange product: ' + (error as Error).message);
    }
  }

  async getAllExchangeProducts(): Promise<ExchangeProduct[]> {
    try {
      return await this.exchangeRepository.find({
        order: {
          createdAt: 'DESC'
        }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch exchange products: ' + (error as Error).message);
    }
  }

  async getExchangeProductById(id: number): Promise<ExchangeProduct> {
    try {
      const product = await this.exchangeRepository.findOne({ where: { id } });
      if (!product) {
        throw new BadRequestException('Exchange product not found');
      }
      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch exchange product: ' + (error as Error).message);
    }
  }

  async getExchangeProductsByUserEmail(email: string): Promise<ExchangeProduct[]> {
    try {
      const products = await this.exchangeRepository.find({
        where: { yourEmail: email },
        order: {
          createdAt: 'DESC'
        }
      });
      return products;
    } catch (error) {
      throw new BadRequestException('Failed to fetch exchange products: ' + (error as Error).message);
    }
  }

  // Get pending exchange requests for a user (where they are the owner)
  async getPendingRequestsForUser(userEmail: string): Promise<ExchangeProduct[]> {
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
    } catch (error) {
      throw new BadRequestException('Failed to fetch pending requests: ' + (error as Error).message);
    }
  }

  // Accept an exchange request
  async acceptExchangeRequest(id: number, userEmail: string): Promise<ExchangeProduct> {
    try {
      const product = await this.exchangeRepository.findOne({ 
        where: { 
          id,
          yourEmail: userEmail 
        } 
      });
      
      if (!product) {
        throw new BadRequestException('Exchange product not found or you are not the owner');
      }

      if (product.status !== 'pending') {
        throw new BadRequestException('This exchange request is not pending');
      }

      product.status = 'accepted';
      return await this.exchangeRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to accept exchange request: ' + (error as Error).message);
    }
  }

  // Decline an exchange request
  async declineExchangeRequest(id: number, userEmail: string): Promise<ExchangeProduct> {
    try {
      const product = await this.exchangeRepository.findOne({ 
        where: { 
          id,
          yourEmail: userEmail 
        } 
      });
      
      if (!product) {
        throw new BadRequestException('Exchange product not found or you are not the owner');
      }

      if (product.status !== 'pending') {
        throw new BadRequestException('This exchange request is not pending');
      }

      product.status = 'declined';
      return await this.exchangeRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to decline exchange request: ' + (error as Error).message);
    }
  }
} 