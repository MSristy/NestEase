import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddSwap } from './entities/add-swap.entity';

interface SwapItemFormData {
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  product_name: string;
  category: string;
  item_condition: string;
  location: string;
  description: string;
  images: string;
}

@Injectable()
export class AddSwapService {
  constructor(
    @InjectRepository(AddSwap)
    private addSwapRepository: Repository<AddSwap>,
  ) {}

  async getSwapItem(id: number) {
    try {
      const item = await this.addSwapRepository.findOne({ where: { id } });
      
      if (!item) {
        throw new NotFoundException('Swap item not found');
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching swap item:', error);
      throw new BadRequestException('Failed to fetch swap item');
    }
  }

  async getSwapItems(category?: string) {
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
    } catch (error) {
      console.error('Error fetching swap items:', error);
      throw new BadRequestException('Failed to fetch swap items');
    }
  }

  async getSwapItemsByUser(email: string) {
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
    } catch (error) {
      console.error('Error fetching user swap items:', error);
      throw new BadRequestException('Failed to fetch user swap items');
    }
  }

  async createSwapItem(formData: SwapItemFormData) {
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
    ] as const;

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        throw new BadRequestException(`${field.replace('_', ' ')} is required`);
      }
    }

    // Validate field lengths
    if (formData.owner_name.length > 100) {
      throw new BadRequestException('Owner name must be less than 100 characters');
    }
    if (formData.owner_phone.length > 20) {
      throw new BadRequestException('Phone number must be less than 20 characters');
    }
    if (formData.owner_email.length > 255) {
      throw new BadRequestException('Email must be less than 255 characters');
    }
    if (formData.product_name.length > 100) {
      throw new BadRequestException('Product name must be less than 100 characters');
    }
    if (formData.category.length > 50) {
      throw new BadRequestException('Category must be less than 50 characters');
    }
    if (formData.item_condition.length > 50) {
      throw new BadRequestException('Condition must be less than 50 characters');
    }
    if (formData.location.length > 100) {
      throw new BadRequestException('Location must be less than 100 characters');
    }
    if (formData.description.length > 1000) {
      throw new BadRequestException('Description must be less than 1000 characters');
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
    } catch (error) {
      console.error('Error saving swap item:', error);
      throw new BadRequestException('Failed to save swap item to database');
    }
  }
} 