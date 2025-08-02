import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ServiceProvider } from './entities/service-provider.entity';
import { User } from '../users/entities/user.entity';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { Booking, BookingStatus, PaymentStatus, PaymentMethod } from '../bookings/entities/booking.entity';
import { NotificationService } from '../users/notification.service';
import { NotificationType } from '../users/entities/notification.entity';

@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectRepository(ServiceProvider)
    private serviceProviderRepository: Repository<ServiceProvider>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private notificationService: NotificationService,
  ) {}

  async create(createServiceProviderDto: CreateServiceProviderDto, userId: number, imagePaths: string[] = []): Promise<ServiceProvider> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert services string to array if needed
    const servicesArray = typeof createServiceProviderDto.services === 'string' 
      ? [createServiceProviderDto.services] 
      : createServiceProviderDto.services || [];

    const serviceProviderData = {
      businessName: createServiceProviderDto.businessName,
      serviceType: createServiceProviderDto.serviceType,
      description: createServiceProviderDto.description,
      phone: createServiceProviderDto.phone,
      address: createServiceProviderDto.address,
      city: createServiceProviderDto.city,
      state: createServiceProviderDto.state,
      zipCode: createServiceProviderDto.zipCode,
      services: servicesArray,
      images: imagePaths,
      isActive: true,
      isVerified: false,
      rating: createServiceProviderDto.rating || 0.00,
      totalRatings: 0,
      totalReviews: 0,
      owner: user,
    };

    const serviceProvider = this.serviceProviderRepository.create(serviceProviderData);
    return this.serviceProviderRepository.save(serviceProvider);
  }

  async findAll(): Promise<ServiceProvider[]> {
    return this.serviceProviderRepository.find({
      relations: ['owner'],
    });
  }

  async checkProfile(userId: number): Promise<{ hasProfile: boolean }> {
    const serviceProvider = await this.serviceProviderRepository.findOne({
      where: { owner: { id: userId } },
    });
    
    return { hasProfile: !!serviceProvider };
  }

  async findOne(id: number): Promise<ServiceProvider> {
    const serviceProvider = await this.serviceProviderRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }

    return serviceProvider;
  }

  async update(id: number, updateServiceProviderDto: UpdateServiceProviderDto, userId: number): Promise<ServiceProvider> {
    const serviceProvider = await this.findOne(id);

    if (serviceProvider.owner.id !== userId) {
      throw new UnauthorizedException('You are not authorized to update this service provider');
    }

    Object.assign(serviceProvider, updateServiceProviderDto);
    return this.serviceProviderRepository.save(serviceProvider);
  }

  async remove(id: number, userId: number): Promise<void> {
    const serviceProvider = await this.findOne(id);

    if (serviceProvider.owner.id !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this service provider');
    }

    await this.serviceProviderRepository.remove(serviceProvider);
  }

  async bookService(serviceId: number, bookingData: any, userId: number) {
    console.log('Service booking started:', { serviceId, bookingData, userId });
    
    try {
      const serviceProvider = await this.findOne(serviceId);
      if (!serviceProvider) {
        console.error('Service provider not found:', serviceId);
        throw new NotFoundException('Service provider not found');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        console.error('User not found:', userId);
        throw new NotFoundException('User not found');
      }

      console.log('Found service provider and user:', { 
        serviceProvider: serviceProvider.businessName, 
        user: user.name 
      });

      // Check for time conflicts (existing bookings at the same time)
      const existingBookings = await this.checkTimeConflicts(serviceId, bookingData.serviceDate, bookingData.serviceTime, bookingData.duration);
      if (existingBookings.length > 0) {
        console.error('Time conflict detected:', existingBookings);
        throw new BadRequestException('This time slot is already booked. Please choose a different time.');
      }

      // Calculate bill based on duration and service type
      const basePrice = this.getBasePrice(serviceProvider.serviceType);
      const duration = parseInt(bookingData.duration) || 1;
      const totalAmount = basePrice * duration;

      console.log('=== PRICING CALCULATION DEBUG ===');
      console.log('Service Type:', serviceProvider.serviceType);
      console.log('Base Price:', basePrice);
      console.log('Duration:', duration);
      console.log('Total Amount:', totalAmount);
      console.log('================================');

      // Create booking with payment fields
      const booking = this.bookingRepository.create({
        serviceProviderId: serviceId,
        customerId: userId,
        serviceType: serviceProvider.serviceType,
        serviceDate: bookingData.serviceDate,
        serviceTime: bookingData.serviceTime,
        duration: duration,
        address: bookingData.address,
        notes: bookingData.description,
        status: BookingStatus.PENDING_APPROVAL,
        totalAmount: totalAmount,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.PENDING,
      });

      const savedBooking = await this.bookingRepository.save(booking);

      const result = {
        success: true,
        message: 'Service booking request submitted successfully. Waiting for provider approval.',
        booking: {
          id: savedBooking.id,
          serviceProvider: serviceProvider.businessName,
          customer: user.name,
          serviceDate: bookingData.serviceDate,
          serviceTime: bookingData.serviceTime,
          duration: duration,
          address: bookingData.address,
          notes: bookingData.description,
          status: 'pending_approval',
          totalAmount: totalAmount
        }
      };

      console.log('Booking completed successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in bookService:', error);
      throw error;
    }
  }

  private async checkTimeConflicts(serviceId: number, serviceDate: string, serviceTime: string, duration: number): Promise<Booking[]> {
    const newBookingStart = new Date(`${serviceDate}T${serviceTime}:00.000Z`);
    const newBookingEnd = new Date(newBookingStart.getTime() + duration * 60 * 60 * 1000);

    // Find existing bookings for the same provider that are not rejected or cancelled.
    const existingBookings = await this.bookingRepository.find({
      where: {
        serviceProviderId: serviceId,
        status: In([BookingStatus.APPROVED, BookingStatus.PENDING_APPROVAL]),
      },
    });

    // Check for overlaps
    const conflictingBookings = existingBookings.filter(existingBooking => {
      const existingStart = new Date(`${existingBooking.serviceDate}T${existingBooking.serviceTime}:00.000Z`);
      const existingEnd = new Date(existingStart.getTime() + existingBooking.duration * 60 * 60 * 1000);

      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return newBookingStart < existingEnd && newBookingEnd > existingStart;
    });

    return conflictingBookings;
  }

  private getBasePrice(serviceType: string): number {
    console.log('Getting base price for service type:', serviceType);
    
    const priceMap: { [key: string]: number } = {
      // Exact matches from database
      'AC Repair': 1200,
      'Electrical': 1000,
      'Moving': 1500,
      'Cleaning': 500,
      'Plumbing': 800,
      'Carpentry': 700,
      'Painting': 600,
      'Gardening': 500,
      'Security': 1200,
      'Maintenance': 800,
      'TV Repair': 800,
      'Other': 600,
      
      // Additional variations
      'ac repair': 1200,
      'electrical': 1000,
      'moving': 1500,
      'cleaning': 500,
      'plumbing': 800,
      'carpentry': 700,
      'painting': 600,
      'gardening': 500,
      'security': 1200,
      'maintenance': 800,
      'tv repair': 800,
      'other': 600,
      
      // Common variations
      'AC': 1200,
      'Electric': 1000,
      'Move': 1500,
      'Clean': 500,
      'Plumb': 800,
      'Carpenter': 700,
      'Paint': 600,
      'Garden': 500,
      'Secure': 1200,
      'Maintain': 800,
      'TV': 800,
    };
    
    const basePrice = priceMap[serviceType] || 600;
    console.log(`Base price for "${serviceType}": ${basePrice} Tk`);
    
    return basePrice;
  }

  async toggleFavorite(serviceId: number, userId: number) {
    const serviceProvider = await this.findOne(serviceId);
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }

    // For now, just return a success response
    // In a real application, you would manage favorites in a separate table
    return {
      success: true,
      message: 'Favorite toggled successfully',
      isFavorite: true
    };
  }

  async getFavorites(userId: number) {
    // For now, return empty array
    // In a real application, you would query favorites from database
    return [];
  }

  async getBookings(userId: number) {
    // Get all bookings for the customer (user)
    const bookings = await this.bookingRepository.find({
      where: { customerId: userId },
      relations: ['serviceProvider', 'serviceProvider.owner'],
      order: { createdAt: 'DESC' },
    });

    return bookings.map(booking => ({
      id: booking.id,
      service: {
        id: booking.serviceProvider.id,
        businessName: booking.serviceProvider.businessName,
        description: booking.serviceProvider.description,
        serviceType: booking.serviceProvider.serviceType,
        phone: booking.serviceProvider.phone,
        address: booking.serviceProvider.address,
        city: booking.serviceProvider.city,
        state: booking.serviceProvider.state,
        zipCode: booking.serviceProvider.zipCode,
        services: booking.serviceProvider.services,
        images: booking.serviceProvider.images,
        isActive: booking.serviceProvider.isActive,
        isVerified: booking.serviceProvider.isVerified,
        rating: booking.serviceProvider.rating,
        totalRatings: 0, // Default value since field might not exist
        totalReviews: 0, // Default value since field might not exist
        createdAt: booking.serviceProvider.createdAt,
        updatedAt: booking.serviceProvider.updatedAt,
        ownerId: booking.serviceProvider.owner.id,
        user: {
          id: booking.serviceProvider.owner.id,
          name: booking.serviceProvider.owner.name,
          email: booking.serviceProvider.owner.email,
        }
      },
      date: booking.serviceDate,
      time: booking.serviceTime,
      status: booking.status,
      address: booking.address,
      notes: booking.notes,
      duration: booking.duration,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus || PaymentStatus.PENDING,
      paymentMethod: booking.paymentMethod || PaymentMethod.PENDING,
      billId: booking.billId,
    }));
  }

  async getServiceHistory(userId: number) {
    // Get completed bookings for the customer
    const bookings = await this.bookingRepository.find({
      where: { 
        customerId: userId,
        status: BookingStatus.COMPLETED 
      },
      relations: ['serviceProvider'],
      order: { createdAt: 'DESC' },
    });

    return bookings.map(booking => ({
      id: booking.serviceProvider.id,
      businessName: booking.serviceProvider.businessName,
      description: booking.serviceProvider.description,
      serviceType: booking.serviceProvider.serviceType,
      phone: booking.serviceProvider.phone,
      address: booking.serviceProvider.address,
      city: booking.serviceProvider.city,
      state: booking.serviceProvider.state,
      zipCode: booking.serviceProvider.zipCode,
      services: booking.serviceProvider.services,
      images: booking.serviceProvider.images,
      isActive: booking.serviceProvider.isActive,
      isVerified: booking.serviceProvider.isVerified,
      rating: booking.serviceProvider.rating,
      totalRatings: 0, // Default value since field might not exist
      totalReviews: 0, // Default value since field might not exist
      createdAt: booking.serviceProvider.createdAt,
      updatedAt: booking.serviceProvider.updatedAt,
      ownerId: booking.serviceProvider.owner.id,
    }));
  }

  async getMyBookings(userId: number) {
    // First, find the service provider profile for the logged-in user.
    const serviceProviderProfile = await this.serviceProviderRepository.findOne({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });

    // If the user doesn't have a service provider profile, they have no bookings to manage.
    if (!serviceProviderProfile) {
      console.log(`[Dashboard] No service provider profile found for user ID: ${userId}. Returning empty array.`);
      return [];
    }

    console.log(`[Dashboard] Found service provider profile ID: ${serviceProviderProfile.id} for user ID: ${userId}. Fetching bookings.`);

    // Now, get bookings using the service provider's profile ID.
    const bookings = await this.bookingRepository.find({
      where: { serviceProviderId: serviceProviderProfile.id },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });

    console.log(`[Dashboard] Found ${bookings.length} bookings for service provider profile ID: ${serviceProviderProfile.id}.`);

    return bookings.map(booking => ({
      id: booking.id,
      customer: booking.customer.name,
      customerEmail: booking.customer.email,
      serviceType: booking.serviceType,
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      duration: booking.duration,
      address: booking.address,
      notes: booking.notes,
      status: booking.status,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
      rejectionReason: booking.rejectionReason,
    }));
  }

  async approveBooking(bookingId: number, userId: number) {
    const serviceProviderProfile = await this.serviceProviderRepository.findOne({ where: { owner: { id: userId } } });
    if (!serviceProviderProfile) {
      throw new UnauthorizedException('You do not have a service provider profile.');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, serviceProviderId: serviceProviderProfile.id },
      relations: ['customer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not authorized to modify it.');
    }

    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Booking is not in pending approval status');
    }

    booking.status = BookingStatus.APPROVED;
    await this.bookingRepository.save(booking);

    // Send notification to customer
    await this.notificationService.createNotification(
      booking.customerId,
      NotificationType.SERVICE,
      'Service Booking Approved',
      `Your booking for ${booking.serviceType} on ${booking.serviceDate} at ${booking.serviceTime} has been approved.`
    );

    return {
      success: true,
      message: 'Booking approved successfully',
      booking: {
        id: booking.id,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    };
  }

  async rejectBooking(bookingId: number, userId: number, reason: string) {
    const serviceProviderProfile = await this.serviceProviderRepository.findOne({ where: { owner: { id: userId } } });
    if (!serviceProviderProfile) {
      throw new UnauthorizedException('You do not have a service provider profile.');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, serviceProviderId: serviceProviderProfile.id },
      relations: ['customer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not authorized to modify it.');
    }

    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Booking is not in pending approval status');
    }

    booking.status = BookingStatus.REJECTED;
    booking.rejectionReason = reason;
    await this.bookingRepository.save(booking);

    // Send notification to customer
    await this.notificationService.createNotification(
      booking.customerId,
      NotificationType.SERVICE,
      'Service Booking Rejected',
      `Your booking for ${booking.serviceType} on ${booking.serviceDate} at ${booking.serviceTime} was rejected. Reason: ${reason}`
    );

    return {
      success: true,
      message: 'Booking rejected successfully',
      booking: {
        id: booking.id,
        status: booking.status,
        rejectionReason: reason,
        updatedAt: booking.updatedAt
      }
    };
  }

  async cancelBooking(bookingId: number, userId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, customerId: userId }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not authorized to cancel it.');
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new BadRequestException('Only approved bookings can be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    await this.bookingRepository.save(booking);

    return {
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        id: booking.id,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    };
  }

  async processPayment(bookingId: number, userId: number, paymentMethod: 'cash' | 'online') {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, customerId: userId },
      relations: ['serviceProvider', 'serviceProvider.owner']
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not authorized to process payment.');
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new BadRequestException('Payment can only be processed for approved bookings');
    }

    if (booking.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Payment has already been processed for this booking');
    }

    booking.paymentStatus = PaymentStatus.PAID;
    booking.paymentMethod = paymentMethod === 'cash' ? PaymentMethod.CASH : PaymentMethod.ONLINE;
    booking.billId = `BILL-${booking.id}-${Date.now()}`;
    await this.bookingRepository.save(booking);

    // Generate bill after payment
    const bill = {
      billId: booking.billId,
      serviceProvider: booking.serviceProvider.businessName,
      customer: booking.customer.name,
      customerEmail: booking.customer.email,
      serviceType: booking.serviceType,
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      duration: booking.duration,
      basePrice: this.getBasePrice(booking.serviceType),
      totalAmount: booking.totalAmount,
      address: booking.address,
      notes: booking.notes,
      status: 'paid',
      paymentMethod: paymentMethod,
      createdAt: new Date(),
      items: [
        {
          description: `${booking.serviceType} Service`,
          quantity: booking.duration,
          unitPrice: this.getBasePrice(booking.serviceType),
          total: booking.totalAmount
        }
      ]
    };

    return {
      success: true,
      message: paymentMethod === 'online' 
        ? 'Online payment processed successfully' 
        : 'Cash payment confirmed. Please pay the provider on service completion.',
      booking: {
        id: booking.id,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        billId: booking.billId,
        updatedAt: booking.updatedAt
      },
      bill: bill
    };
  }

  async getPaymentOptions(bookingId: number, userId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, customerId: userId },
      relations: ['serviceProvider']
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not authorized to access it.');
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new BadRequestException('Payment options are only available for approved bookings');
    }

    if (booking.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Payment has already been processed for this booking');
    }

    return {
      bookingId: booking.id,
      serviceProvider: booking.serviceProvider.businessName,
      serviceType: booking.serviceType,
      totalAmount: booking.totalAmount,
      paymentOptions: [
        {
          method: 'cash',
          label: 'Pay Cash',
          description: 'Pay the provider on service completion',
          icon: '💵'
        },
        {
          method: 'online',
          label: 'Pay Online',
          description: 'Pay now with card or digital payment',
          icon: '💳'
        }
      ]
    };
  }

  async completeService(bookingId: number, userId: number) {
    const serviceProviderProfile = await this.serviceProviderRepository.findOne({ where: { owner: { id: userId } } });
    if (!serviceProviderProfile) {
      throw new UnauthorizedException('You do not have a service provider profile.');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, serviceProviderId: serviceProviderProfile.id }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not authorized to complete it.');
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new BadRequestException('Only approved bookings can be marked as completed');
    }

    if (booking.paymentStatus !== PaymentStatus.PAID) {
      throw new BadRequestException('Payment must be completed before marking service as completed');
    }

    booking.status = BookingStatus.COMPLETED;
    await this.bookingRepository.save(booking);

    return {
      success: true,
      message: 'Service marked as completed successfully',
      booking: {
        id: booking.id,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    };
  }
} 