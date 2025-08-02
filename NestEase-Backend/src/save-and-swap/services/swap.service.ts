import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwapItem } from '../entities/swap-item.entity';
import { SwapRequest } from '../entities/swap-request.entity';
import { CreateSwapItemDto } from '../dto/create-swap-item.dto';
import { CreateSwapRequestDto } from '../dto/create-swap-request.dto';
import { StripeService } from '../../payment/stripe.service';
import { User } from '../../users/user.entity';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(SwapItem)
    private swapItemRepository: Repository<SwapItem>,
    @InjectRepository(SwapRequest)
    private swapRequestRepository: Repository<SwapRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private stripeService: StripeService
  ) {}

  async createSwapItem(createDto: CreateSwapItemDto, userId: string): Promise<SwapItem> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const swapItem = this.swapItemRepository.create({
      ...createDto,
      owner: user,
    });

    return this.swapItemRepository.save(swapItem);
  }

  async findAllSwapItems(): Promise<SwapItem[]> {
    return this.swapItemRepository.find({
      relations: ['owner'],
    });
  }

  async findOneSwapItem(id: string): Promise<SwapItem> {
    const swapItem = await this.swapItemRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!swapItem) {
      throw new NotFoundException('Swap item not found');
    }

    return swapItem;
  }

  async createSwapRequest(createDto: CreateSwapRequestDto, userId: string): Promise<SwapRequest> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const requestedItem = await this.findOneSwapItem(createDto.requestedItemId);
    const offeredItem = await this.findOneSwapItem(createDto.offeredItemId);

    if (offeredItem.owner.id !== userId) {
      throw new UnauthorizedException('You can only offer items that you own');
    }

    const swapRequest = this.swapRequestRepository.create({
      requester: user,
      requestedItem,
      offeredItem,
      status: 'PENDING',
    });

    return this.swapRequestRepository.save(swapRequest);
  }

  async acceptSwapRequest(id: string, userId: string): Promise<SwapRequest> {
    const swapRequest = await this.swapRequestRepository.findOne({
      where: { id },
      relations: ['requestedItem', 'offeredItem', 'requester'],
    });

    if (!swapRequest) {
      throw new NotFoundException('Swap request not found');
    }

    if (swapRequest.requestedItem.owner.id !== userId) {
      throw new UnauthorizedException('You can only accept swap requests for your items');
    }

    if (swapRequest.status !== 'PENDING') {
      throw new BadRequestException('This swap request is no longer pending');
    }

    swapRequest.status = 'ACCEPTED';
    return this.swapRequestRepository.save(swapRequest);
  }

  async rejectSwapRequest(id: string, userId: string): Promise<SwapRequest> {
    const swapRequest = await this.swapRequestRepository.findOne({
      where: { id },
      relations: ['requestedItem', 'offeredItem', 'requester'],
    });

    if (!swapRequest) {
      throw new NotFoundException('Swap request not found');
    }

    if (swapRequest.requestedItem.owner.id !== userId) {
      throw new UnauthorizedException('You can only reject swap requests for your items');
    }

    if (swapRequest.status !== 'PENDING') {
      throw new BadRequestException('This swap request is no longer pending');
    }

    swapRequest.status = 'REJECTED';
    return this.swapRequestRepository.save(swapRequest);
  }

  async findAllSwapRequests(userId: string): Promise<SwapRequest[]> {
    return this.swapRequestRepository.find({
      where: [
        { requester: { id: userId } },
        { requestedItem: { owner: { id: userId } } },
      ],
      relations: ['requester', 'requestedItem', 'offeredItem'],
    });
  }

  async completeSwap(id: string, userId: string): Promise<SwapRequest> {
    const swapRequest = await this.swapRequestRepository.findOne({
      where: { id },
      relations: ['requestedItem', 'offeredItem', 'requester'],
    });

    if (!swapRequest) {
      throw new NotFoundException('Swap request not found');
    }

    if (swapRequest.status !== 'ACCEPTED') {
      throw new BadRequestException('Can only complete accepted swap requests');
    }

    if (swapRequest.requester.id !== userId && swapRequest.requestedItem.owner.id !== userId) {
      throw new UnauthorizedException('You are not authorized to complete this swap');
    }

    // Update item ownership
    const tempOwner = swapRequest.requestedItem.owner;
    swapRequest.requestedItem.owner = swapRequest.offeredItem.owner;
    swapRequest.offeredItem.owner = tempOwner;

    await this.swapItemRepository.save([swapRequest.requestedItem, swapRequest.offeredItem]);

    swapRequest.status = 'COMPLETED';
    return this.swapRequestRepository.save(swapRequest);
  }

  async addReview(
    requestId: string,
    userId: string,
    rating: number,
    review: string
  ): Promise<SwapRequest> {
    const request = await this.swapRequestRepository.findOne({
      where: { id: requestId },
      relations: ['requester', 'requestedItem', 'offeredItem']
    });

    if (!request) {
      throw new NotFoundException('Swap request not found');
    }

    if (request.requester.id !== userId && request.requestedItem.owner.id !== userId) {
      throw new BadRequestException('Only participants can add reviews');
    }

    if (request.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed swaps');
    }

    request.rating = rating;
    request.review = review;

    return await this.swapRequestRepository.save(request);
  }
} 