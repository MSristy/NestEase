import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyType, PropertyStatus, Property } from './property.entity';
import { User } from '../users/entities/user.entity';
import { PropertyBooking } from './property-booking.entity';
import { PropertyPurchase } from './entities/property-purchase.entity';
import { StripeService } from '../payment/stripe.service';
import { ApplinkService } from '../applink/applink.service';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PropertyBooking)
    private propertyBookingRepository: Repository<PropertyBooking>,
    @InjectRepository(PropertyPurchase)
    private propertyPurchaseRepository: Repository<PropertyPurchase>,
    private stripeService: StripeService,
    private applinkService: ApplinkService,
  ) {}

  async create(createPropertyDto: Partial<Property>, ownerId: number): Promise<Property> {
    const owner = await this.usersRepository.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');
    
    console.log('Received createPropertyDto:', JSON.stringify(createPropertyDto, null, 2));
    console.log('Amenities from DTO:', createPropertyDto.amenities);
    console.log('Amenities type:', typeof createPropertyDto.amenities);
    console.log('Is amenities array?', Array.isArray(createPropertyDto.amenities));
    
    const amenities = Array.isArray(createPropertyDto.amenities) ? createPropertyDto.amenities : [];
    console.log('Processed amenities:', amenities);
    
    const property = this.propertiesRepository.create({ ...createPropertyDto, amenities, owner });
    console.log('Property to save:', JSON.stringify(property, null, 2));
    
    const savedProperty = await this.propertiesRepository.save(property);
    console.log('Saved property amenities:', savedProperty.amenities);
    
    return savedProperty;
  }

  async findAll(type?: PropertyType, status?: PropertyStatus): Promise<Property[]> {
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    return this.propertiesRepository.find({ where, relations: ['owner'] });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: Partial<Property>, ownerId: number): Promise<Property> {
    const property = await this.findOne(id);
    if (property.owner.id !== ownerId) {
      throw new UnauthorizedException('You can only update your own properties');
    }
    Object.assign(property, updatePropertyDto);
    return this.propertiesRepository.save(property);
  }

  async remove(id: string, ownerId: number): Promise<void> {
    const property = await this.findOne(id);
    if (property.owner.id !== ownerId) {
      throw new UnauthorizedException('You can only delete your own properties');
    }
    await this.propertiesRepository.remove(property);
  }

  async verifyProperty(id: string): Promise<Property> {
    const property = await this.findOne(id);
    property.isVerified = true;
    return this.propertiesRepository.save(property);
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return this.propertiesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  // Tenant books rental property
  async bookProperty(propertyId: string, tenantId: number): Promise<PropertyBooking> {
    const property = await this.findOne(propertyId);
    if (property.type !== PropertyType.RENT || property.status !== PropertyStatus.AVAILABLE) {
      throw new NotFoundException('Property not available for rent');
    }
    const tenant = await this.usersRepository.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    
    property.status = PropertyStatus.PENDING;
    await this.propertiesRepository.save(property);
    
    const booking = this.propertyBookingRepository.create({
      property: property as any,
      tenant,
      checkInDate: new Date(),
      checkOutDate: new Date(),
      totalPrice: property.price,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    });
    const savedBooking = await this.propertyBookingRepository.save(booking);

    // Send SMS notifications
    await this.sendPropertyBookingSMS(property, tenant, savedBooking);

    return savedBooking;
  }

  /**
   * Send SMS notifications for property bookings
   */
  private async sendPropertyBookingSMS(
    property: Property,
    tenant: User,
    booking: PropertyBooking
  ): Promise<void> {
    if (!this.applinkService.isConfigured()) {
      return;
    }

    try {
      // Notify tenant
      if (tenant.phone && tenant.smsNotifications) {
        const tenantMessage = `Your property booking request for ${property.title} (${property.address}) has been submitted. Booking ID: ${booking.id}. Waiting for landlord approval.`;
        await this.applinkService.sendSMS(tenant.phone, tenantMessage);
      }

      // Notify property owner
      const owner = property.owner;
      if (owner && owner.phone && owner.smsNotifications) {
        const ownerMessage = `New booking request from ${tenant.name} for your property "${property.title}" at ${property.address}. Booking ID: ${booking.id}. Please review in your dashboard.`;
        await this.applinkService.sendSMS(owner.phone, ownerMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      this.logger.error(`Failed to send property booking SMS: ${errorMessage}`);
      // Don't throw - SMS failure shouldn't break booking flow
    }
  }

  // Get tenant's bookings
  async getMyBookings(userId: number): Promise<any[]> {
    const bookings = await this.propertyBookingRepository.find({
      where: { tenant: { id: userId } },
      relations: ['property', 'property.owner'],
      order: { createdAt: 'DESC' },
    });
    
    return bookings.map(booking => ({
      ...booking,
      property: {
        ...booking.property,
        owner: {
          id: booking.property.owner.id,
          name: booking.property.owner.name,
          email: booking.property.owner.email,
        }
      }
    }));
  }

  // Get landlord's pending requests
  async getPendingRequests(ownerId: number): Promise<any[]> {
    const bookings = await this.propertyBookingRepository.find({
      where: { 
        property: { owner: { id: ownerId } },
        status: 'PENDING'
      },
      relations: ['property', 'tenant'],
      order: { createdAt: 'DESC' },
    });
    
    return bookings.map(booking => ({
      ...booking,
      tenant: {
        id: booking.tenant.id,
        name: booking.tenant.name,
        email: booking.tenant.email,
      }
    }));
  }

  // Get landlord's pending purchases
  async getPendingPurchases(ownerId: number): Promise<any[]> {
    const purchases = await this.propertyPurchaseRepository.find({
      where: { 
        property: { owner: { id: ownerId } },
        status: 'PENDING'
      },
      relations: ['property', 'buyer'],
      order: { createdAt: 'DESC' },
    });
    
    return purchases.map(purchase => ({
      ...purchase,
      buyer: {
        id: purchase.buyer.id,
        name: purchase.buyer.name,
        email: purchase.buyer.email,
      }
    }));
  }

  // Landlord approves booking
  async approveBooking(bookingId: string, ownerId: number): Promise<PropertyBooking> {
    const booking = await this.propertyBookingRepository.findOne({
      where: { id: bookingId },
      relations: ['property', 'property.owner'],
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.property.owner.id !== ownerId) {
      throw new UnauthorizedException('You can only approve bookings for your own properties');
    }
    if (booking.status !== 'PENDING') throw new BadRequestException('Booking is not pending');
    
    booking.status = 'CONFIRMED';
    booking.property.status = PropertyStatus.BOOKED;
    await this.propertiesRepository.save(booking.property);
    return await this.propertyBookingRepository.save(booking);
  }

  // Landlord rejects booking
  async rejectBooking(bookingId: string, reason: string, ownerId: number): Promise<PropertyBooking> {
    const booking = await this.propertyBookingRepository.findOne({
      where: { id: bookingId },
      relations: ['property', 'property.owner'],
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.property.owner.id !== ownerId) {
      throw new UnauthorizedException('You can only reject bookings for your own properties');
    }
    if (booking.status !== 'PENDING') throw new BadRequestException('Booking is not pending');
    
    booking.status = 'REJECTED';
    booking.rejectionReason = reason;
    booking.property.status = PropertyStatus.AVAILABLE;
    await this.propertiesRepository.save(booking.property);
    return await this.propertyBookingRepository.save(booking);
  }

  // Process payment for approved booking
  async processPayment(bookingId: string, paymentMethod: string, userId: number): Promise<any> {
    const booking = await this.propertyBookingRepository.findOne({
      where: { id: bookingId, tenant: { id: userId } },
      relations: ['property'],
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Only confirmed bookings can be paid for');
    }
    if (booking.paymentStatus === 'PAID') {
      throw new BadRequestException('Payment already completed');
    }

    if (paymentMethod === 'online') {
      // Create Stripe payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: Math.round(booking.totalPrice * 100), // Convert to cents
        currency: 'bdt',
        description: `Property booking: ${booking.property.title}`,
      });

      // Update booking with payment intent
      booking.paymentIntentId = paymentIntent.id;
      await this.propertyBookingRepository.save(booking);

      return {
        clientSecret: paymentIntent.client_secret,
        bookingId: booking.id,
        amount: booking.totalPrice,
      };
    } else {
      // Cash payment - mark as paid
      booking.paymentStatus = 'PAID';
      booking.status = 'COMPLETED';
      await this.propertyBookingRepository.save(booking);
      
      return {
        success: true,
        message: 'Payment processed successfully',
        bookingId: booking.id,
      };
    }
  }

  // Get booking details for payment
  async getPaymentDetails(bookingId: string, userId: number): Promise<any> {
    const booking = await this.propertyBookingRepository.findOne({
      where: { id: bookingId, tenant: { id: userId } },
      relations: ['property'],
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    
    return {
      bookingId: booking.id,
      propertyTitle: booking.property.title,
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    };
  }

  // Buyer buys property for sale
  async buyProperty(propertyId: string, buyerId: number): Promise<PropertyPurchase> {
    const property = await this.findOne(propertyId);
    if (property.type !== PropertyType.SALE || property.status !== PropertyStatus.AVAILABLE) {
      throw new NotFoundException('Property not available for sale');
    }
    const buyer = await this.usersRepository.findOne({ where: { id: buyerId } });
    if (!buyer) throw new NotFoundException('Buyer not found');
    property.status = PropertyStatus.PENDING;
    await this.propertiesRepository.save(property);
    const purchase = this.propertyPurchaseRepository.create({
      property: property as any,
      buyer,
      totalPrice: property.price,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    });
    return await this.propertyPurchaseRepository.save(purchase);
  }

  // Tenant/Buyer: My bookings/purchases
  async getBookingsByUser(userId: number): Promise<any[]> {
    const bookings = await this.propertyBookingRepository.find({
      where: { tenant: { id: userId } },
      relations: ['property'],
    });
    const purchases = await this.propertyPurchaseRepository.find({
      where: { buyer: { id: userId } },
      relations: ['property'],
    });
    return [
      ...bookings.map(b => ({ ...b.property, status: b.status, bookingId: b.id })),
      ...purchases.map(p => ({ ...p.property, status: p.status, purchaseId: p.id })),
    ];
  }

  // Seller: Get pending purchase requests for their properties
  async getPendingPurchasesForOwner(ownerId: number): Promise<any[]> {
    const purchases = await this.propertyPurchaseRepository.find({
      where: { status: 'PENDING' },
      relations: ['property', 'buyer', 'property.owner'],
    });
    return purchases
      .filter(p => p.property && p.property.owner && p.property.owner.id === ownerId)
      .map(p => ({
        ...p,
        property: {
          id: p.property.id,
          title: p.property.title,
          address: p.property.address,
          city: p.property.city,
          state: p.property.state,
        },
        buyer: {
          id: p.buyer.id,
          name: p.buyer.name,
          email: p.buyer.email,
        },
      }));
  }

  // Seller approves purchase
  async approvePurchase(purchaseId: string): Promise<PropertyPurchase> {
    const purchase = await this.propertyPurchaseRepository.findOne({
      where: { id: purchaseId },
      relations: ['property'],
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    if (purchase.status !== 'PENDING') throw new Error('Purchase is not pending');
    purchase.status = 'CONFIRMED';
    purchase.property.status = PropertyStatus.SOLD;
    await this.propertiesRepository.save(purchase.property);
    return await this.propertyPurchaseRepository.save(purchase);
  }

  // Seller rejects purchase
  async rejectPurchase(purchaseId: string, reason: string): Promise<PropertyPurchase> {
    const purchase = await this.propertyPurchaseRepository.findOne({
      where: { id: purchaseId },
      relations: ['property'],
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    if (purchase.status !== 'PENDING') throw new Error('Purchase is not pending');
    purchase.status = 'REJECTED';
    purchase.rejectionReason = reason;
    purchase.property.status = PropertyStatus.AVAILABLE;
    await this.propertiesRepository.save(purchase.property);
    return await this.propertyPurchaseRepository.save(purchase);
  }
} 