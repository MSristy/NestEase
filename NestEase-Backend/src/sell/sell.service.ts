import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellProduct } from './sell.entity';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(SellProduct)
    private sellProductRepository: Repository<SellProduct>,
  ) {}

  async createSellProduct(productData: {
    owner_name: string;
    owner_phone: string;
    owner_email: string;
    product_name: string;
    price: number;
    category: string;
    product_condition: string;
    location: string;
    description: string;
    images: string;
  }): Promise<SellProduct> {
    try {
      const product = this.sellProductRepository.create(productData);
      return await this.sellProductRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create sell product: ${error.message}`);
      }
      throw new Error('Failed to create sell product');
    }
  }

  async getAllSellProducts(): Promise<SellProduct[]> {
    try {
      return await this.sellProductRepository.find();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch sell products: ${error.message}`);
      }
      throw new Error('Failed to fetch sell products');
    }
  }

  async getSellProduct(id: number): Promise<SellProduct> {
    try {
      const product = await this.sellProductRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Sell product not found');
      }
      return product;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch sell product: ${error.message}`);
      }
      throw new Error('Failed to fetch sell product');
    }
  }
} 