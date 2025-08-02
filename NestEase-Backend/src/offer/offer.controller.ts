import { Controller, Post, Body, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OfferService } from './offer.service';
import { ItemOffer } from './entities/item-offer.entity';

interface CreateOfferDto {
  owner_name: string;
  product_name: string;
  price: number;
  discount?: number;
  [key: string]: any;
}

@Controller('add-offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto): Promise<{ success: boolean; data?: ItemOffer; message?: string }> {
    try {
      console.log('Received create request with data:', createOfferDto);
      if (!createOfferDto.owner_name || !createOfferDto.product_name || !createOfferDto.price) {
        console.log('Missing required fields');
        throw new HttpException('Required fields are missing', HttpStatus.BAD_REQUEST);
      }

      const offer = await this.offerService.create(createOfferDto);
      console.log('Created offer successfully:', offer);
      return {
        success: true,
        data: offer
      };
    } catch (error: any) {
      console.error('Error creating offer:', error);
      return {
        success: false,
        message: error.message || 'Failed to create offer'
      };
    }
  }

  @Get()
  async findAll(@Query('category') category?: string): Promise<{ success: boolean; data?: ItemOffer[]; message?: string }> {
    try {
      console.log('Received findAll request');
      const offers = await this.offerService.findAll();
      console.log('Found offers:', offers);
      return {
        success: true,
        data: offers
      };
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch offers'
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ success: boolean; data?: ItemOffer; message?: string }> {
    try {
      console.log('Received findOne request for id:', id);
      const offer = await this.offerService.findOne(+id);
      if (!offer) {
        console.log('Offer not found');
        throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
      }
      console.log('Found offer:', offer);
      return {
        success: true,
        data: offer
      };
    } catch (error: any) {
      console.error('Error fetching offer:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch offer'
      };
    }
  }
} 