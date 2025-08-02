import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemOffer } from './entities/item-offer.entity';

interface CreateOfferDto {
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  product_name: string;
  price: number;
  discount?: number;
  category?: string;
  product_condition?: string;
  location?: string;
  description?: string;
  images?: string;
}

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(ItemOffer)
    private itemOfferRepository: Repository<ItemOffer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<ItemOffer> {
    try {
      console.log('Creating offer with data:', createOfferDto);
      const offer = new ItemOffer();
      Object.assign(offer, {
        ...createOfferDto,
        owner_phone: createOfferDto.owner_phone || null,
        owner_email: createOfferDto.owner_email || null
      });
      const savedOffer = await this.itemOfferRepository.save(offer);
      console.log('Created offer:', savedOffer);
      return savedOffer;
    } catch (error: any) {
      console.error('Error in create offer:', error);
      throw new Error(`Failed to create offer: ${error.message}`);
    }
  }

  async findAll(): Promise<ItemOffer[]> {
    try {
      console.log('Finding all offers...');
      const offers = await this.itemOfferRepository.find({
        order: { created_at: 'DESC' }
      });
      console.log('Found offers:', offers);
      return offers;
    } catch (error: any) {
      console.error('Error in findAll offers:', error);
      throw new Error(`Failed to fetch offers: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<ItemOffer> {
    try {
      console.log('Finding offer with id:', id);
      const offer = await this.itemOfferRepository.findOne({ where: { id } });
      if (!offer) {
        console.log('Offer not found');
        throw new NotFoundException(`Offer with ID ${id} not found`);
      }
      console.log('Found offer:', offer);
      return offer;
    } catch (error: any) {
      console.error('Error in findOne offer:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch offer: ${error.message}`);
    }
  }

  async createOffer(offerData: {
    owner_name: string;
    product_name: string;
    price: number;
    discount: number;
    category: string;
    product_condition: string;
    location: string;
    description: string;
    images: string;
  }): Promise<ItemOffer> {
    try {
      const offer = this.itemOfferRepository.create(offerData);
      return await this.itemOfferRepository.save(offer);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create offer: ${error.message}`);
      }
      throw new Error('Failed to create offer');
    }
  }

  async getAllOffers(category?: string): Promise<ItemOffer[]> {
    try {
      if (category) {
        return await this.itemOfferRepository.find({
          where: { category },
          order: { created_at: 'DESC' }
        });
      }
      return await this.itemOfferRepository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch offers: ${error.message}`);
      }
      throw new Error('Failed to fetch offers');
    }
  }

  async getOffer(id: number): Promise<ItemOffer> {
    try {
      const offer = await this.itemOfferRepository.findOne({ where: { id } });
      if (!offer) {
        throw new NotFoundException('Offer not found');
      }
      return offer;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch offer: ${error.message}`);
      }
      throw new Error('Failed to fetch offer');
    }
  }
} 