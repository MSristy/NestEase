import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { ServiceProvider } from '../service-providers/entities/service-provider.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(ServiceProvider)
    private serviceProviderRepository: Repository<ServiceProvider>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBooking(serviceId: number, bookingData: any, customerId: number) {
    const serviceProvider = await this.serviceProviderRepository.findOne({ where: { id: serviceId } });
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }

    const customer = await this.userRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check for time conflicts
    const existingBookings = await this.checkTimeConflicts(serviceId, bookingData.serviceDate, bookingData.serviceTime, bookingData.duration);
    if (existingBookings.length > 0) {
      throw new BadRequestException('This time slot is already booked. Please choose a different time.');
    }

    // Calculate total amount
    const basePrice = this.getBasePrice(serviceProvider.serviceType);
    const duration = parseInt(bookingData.duration) || 1;
    const totalAmount = basePrice * duration;

    const booking = this.bookingRepository.create({
      serviceProviderId: serviceId,
      customerId: customerId,
      serviceType: serviceProvider.serviceType,
      serviceDate: bookingData.serviceDate,
      serviceTime: bookingData.serviceTime,
      duration: duration,
      address: bookingData.address,
      notes: bookingData.description,
      status: BookingStatus.PENDING_APPROVAL,
      totalAmount: totalAmount,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Generate bill
    const bill = {
      billId: `BILL-${savedBooking.id}-${Date.now()}`,
      serviceProvider: serviceProvider.businessName,
      customer: customer.name,
      customerEmail: customer.email,
      serviceType: serviceProvider.serviceType,
      serviceDate: bookingData.serviceDate,
      serviceTime: bookingData.serviceTime,
      duration: duration,
      basePrice: basePrice,
      totalAmount: totalAmount,
      address: bookingData.address,
      notes: bookingData.description,
      status: 'pending_approval',
      createdAt: new Date(),
      items: [
        {
          description: `${serviceProvider.serviceType} Service`,
          quantity: duration,
          unitPrice: basePrice,
          total: totalAmount
        }
      ]
    };

    return {
      success: true,
      message: 'Service booking request submitted successfully. Waiting for provider approval.',
      booking: {
        id: savedBooking.id,
        serviceProvider: serviceProvider.businessName,
        customer: customer.name,
        serviceDate: bookingData.serviceDate,
        serviceTime: bookingData.serviceTime,
        duration: duration,
        address: bookingData.address,
        notes: bookingData.description,
        status: 'pending_approval'
      },
      bill: bill
    };
  }

  async getMyBookings(serviceProviderId: number) {
    const bookings = await this.bookingRepository.find({
      where: { serviceProviderId },
      relations: ['customer'],
      order: { createdAt: 'DESC' }
    });

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
      rejectionReason: booking.rejectionReason
    }));
  }

  async getCustomerBookings(customerId: number) {
    const bookings = await this.bookingRepository.find({
      where: { customerId },
      relations: ['serviceProvider'],
      order: { createdAt: 'DESC' }
    });

    return bookings.map(booking => ({
      id: booking.id,
      service: {
        id: booking.serviceProvider.id,
        businessName: booking.serviceProvider.businessName,
        serviceType: booking.serviceProvider.serviceType,
        images: booking.serviceProvider.images
      },
      date: booking.serviceDate,
      time: booking.serviceTime,
      status: booking.status,
      address: booking.address,
      notes: booking.notes
    }));
  }

  async approveBooking(bookingId: number, serviceProviderId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, serviceProviderId }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Booking is not in pending approval status');
    }

    booking.status = BookingStatus.APPROVED;
    await this.bookingRepository.save(booking);

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

  async rejectBooking(bookingId: number, serviceProviderId: number, reason: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, serviceProviderId }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Booking is not in pending approval status');
    }

    booking.status = BookingStatus.REJECTED;
    booking.rejectionReason = reason;
    await this.bookingRepository.save(booking);

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

  private async checkTimeConflicts(serviceId: number, serviceDate: string, serviceTime: string, duration: number): Promise<Booking[]> {
    const startTime = new Date(`${serviceDate}T${serviceTime}`);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    return this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.serviceProviderId = :serviceId', { serviceId })
      .andWhere('booking.serviceDate = :serviceDate', { serviceDate })
      .andWhere('booking.status IN (:...statuses)', { 
        statuses: [BookingStatus.PENDING_APPROVAL, BookingStatus.APPROVED] 
      })
      .andWhere(
        '(booking.serviceTime BETWEEN :startTime AND :endTime OR ' +
        ':startTime BETWEEN booking.serviceTime AND DATE_ADD(booking.serviceTime, INTERVAL booking.duration HOUR))',
        { startTime: serviceTime, endTime: endTime.toTimeString().slice(0, 5) }
      )
      .getMany();
  }

  private getBasePrice(serviceType: string): number {
    if (!serviceType) return 600;
    const priceMap: { [key: string]: number } = {
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
    };
    const key = serviceType.trim().toLowerCase();
    const basePrice = priceMap[key] || 600;
    console.log(`[getBasePrice] ServiceType: '${serviceType}' | Key: '${key}' | Price: ${basePrice}`);
    return basePrice;
  }
} 