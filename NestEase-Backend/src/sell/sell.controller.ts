import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { SellService } from './sell.service';

@Controller('add-sell')
export class SellController {
  constructor(private readonly sellService: SellService) {}

  @Post()
  async addSellProduct(@Body() productData: {
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
  }) {
    try {
      const result = await this.sellService.createSellProduct(productData);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  }

  @Get()
  async getAllSellProducts() {
    try {
      const products = await this.sellService.getAllSellProducts();
      return { success: true, data: products };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  }

  @Get(':id')
  async getSellProduct(@Param('id') id: string) {
    try {
      const product = await this.sellService.getSellProduct(parseInt(id));
      if (!product) {
        throw new NotFoundException('Sell product not found');
      }
      return { success: true, data: product };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'Failed to fetch sell product' };
    }
  }
} 