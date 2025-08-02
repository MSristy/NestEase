import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyBooking } from './property-booking.entity';
import { BookPropertyDto } from './dto/book-property.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(PropertyBooking)
    private bookingRepository: Repository<PropertyBooking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, userId: number): Promise<Property> {
    const owner = await this.userRepository.findOneBy({ id: userId });
    if (!owner) throw new NotFoundException('Owner not found');
    const property = this.propertyRepository.create({
      ...createPropertyDto,
    });
    property.owner = owner;
    return await this.propertyRepository.save(property);
  }

  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: string): Promise<Property> {
    if (!id) throw new BadRequestException('Invalid ID');
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: number): Promise<Property> {
    const property = await this.findOne(id);
    if (property.owner.id !== userId) {
      throw new UnauthorizedException('You are not authorized to update this property');
    }
    Object.assign(property, updatePropertyDto);
    return await this.propertyRepository.save(property);
  }

  async remove(id: string, userId: number): Promise<void> {
    const property = await this.findOne(id);
    if (property.owner.id !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this property');
    }
    await this.propertyRepository.remove(property);
  }

  async bookProperty(propertyId: string, userId: number, bookingDto: BookPropertyDto): Promise<PropertyBooking> {
    const property = await this.findOne(propertyId);
    const tenant = await this.userRepository.findOneBy({ id: userId });
    if (!property || !tenant) throw new NotFoundException('Property or tenant not found');
    const booking = this.bookingRepository.create();
    booking.property = property;
    booking.tenant = tenant;
    booking.checkInDate = bookingDto.checkInDate;
    booking.checkOutDate = bookingDto.checkOutDate;
    booking.status = 'PENDING';
    booking.paymentStatus = 'PENDING';
    booking.totalPrice = this.calculateTotalPrice(property, bookingDto);
    return await this.bookingRepository.save(booking);
  }

  async confirmBooking(bookingId: string): Promise<PropertyBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['property', 'tenant'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    booking.status = 'CONFIRMED';
    return await this.bookingRepository.save(booking);
  }

  async cancelBooking(bookingId: string, reason: string): Promise<PropertyBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['property', 'tenant'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    booking.status = 'CANCELLED';
    booking.cancellationReason = reason;
    return await this.bookingRepository.save(booking);
  }

  private calculateTotalPrice(property: Property, bookingDto: BookPropertyDto): number {
    const days = Math.ceil(
      (bookingDto.checkOutDate.getTime() - bookingDto.checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return property.price * days;
  }

  async getBookingRequestsForOwner(ownerId: number) {
    const properties = await this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.bookings', 'bookings')
      .leftJoinAndSelect('bookings.tenant', 'tenant')
      .where('property.ownerId = :ownerId', { ownerId })
      .getMany();
    const requests = [];
    for (const property of properties) {
      for (const booking of property.bookings) {
        requests.push({
          ...booking,
          property,
          tenant: booking.tenant,
        });
      }
    }
    return requests;
  }
} 