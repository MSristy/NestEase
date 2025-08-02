import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { AddSwapService } from './add-swap.service';
import { AddSwap } from '../entities/add-swap.entity';

// src/swap/dto/create-add-swap.dto.ts
export class CreateAddSwapDto {
  title: string;
  description: string;
  category: string;
  item_condition: string;
  location: string;
}


@Controller('add-swap')
export class AddSwapController {
  constructor(private readonly addSwapService: AddSwapService) {}

  @Post()
  async create(@Body() createAddSwapDto: CreateAddSwapDto): Promise<AddSwap> {
    try {
      // Validate required fields
      const requiredFields: (keyof CreateAddSwapDto)[] = [
        'title',
        'category',
        
        'item_condition',
        'description',
        'location'
      ];
      
      for (const field of requiredFields) {
        if (!createAddSwapDto[field]) {
          throw new BadRequestException(`Missing required field: ${field}`);
        }
      }

      return await this.addSwapService.create(createAddSwapDto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create swap item');
    }
  }

  
} 