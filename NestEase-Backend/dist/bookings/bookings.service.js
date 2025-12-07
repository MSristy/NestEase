"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const service_provider_entity_1 = require("../service-providers/entities/service-provider.entity");
const user_entity_1 = require("../users/entities/user.entity");
const applink_service_1 = require("../applink/applink.service");
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(bookingRepository, serviceProviderRepository, userRepository, applinkService) {
        this.bookingRepository = bookingRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.userRepository = userRepository;
        this.applinkService = applinkService;
        this.logger = new common_1.Logger(BookingsService_1.name);
    }
    async createBooking(serviceId, bookingData, customerId) {
        const serviceProvider = await this.serviceProviderRepository.findOne({
            where: { id: serviceId },
            relations: ['owner']
        });
        if (!serviceProvider) {
            throw new common_1.NotFoundException('Service provider not found');
        }
        const customer = await this.userRepository.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        // Check for time conflicts
        const existingBookings = await this.checkTimeConflicts(serviceId, bookingData.serviceDate, bookingData.serviceTime, bookingData.duration);
        if (existingBookings.length > 0) {
            throw new common_1.BadRequestException('This time slot is already booked. Please choose a different time.');
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
            status: booking_entity_1.BookingStatus.PENDING_APPROVAL,
            totalAmount: totalAmount,
        });
        const savedBooking = await this.bookingRepository.save(booking);
        // Send SMS notifications
        await this.sendBookingSMSNotifications(savedBooking, serviceProvider, customer, 'created');
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
    async getMyBookings(serviceProviderId) {
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
    async getCustomerBookings(customerId) {
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
    async approveBooking(bookingId, serviceProviderId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, serviceProviderId },
            relations: ['serviceProvider', 'serviceProvider.owner']
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not in pending approval status');
        }
        booking.status = booking_entity_1.BookingStatus.APPROVED;
        await this.bookingRepository.save(booking);
        // Send SMS notifications for approval
        const customer = await this.userRepository.findOne({ where: { id: booking.customerId } });
        const serviceProvider = await this.serviceProviderRepository.findOne({
            where: { id: booking.serviceProviderId },
            relations: ['owner']
        });
        if (customer && serviceProvider) {
            await this.sendBookingSMSNotifications(booking, serviceProvider, customer, 'approved');
        }
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
    async rejectBooking(bookingId, serviceProviderId, reason) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, serviceProviderId },
            relations: ['serviceProvider', 'serviceProvider.owner']
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not in pending approval status');
        }
        booking.status = booking_entity_1.BookingStatus.REJECTED;
        booking.rejectionReason = reason;
        await this.bookingRepository.save(booking);
        // Send SMS notifications for rejection
        const customer = await this.userRepository.findOne({ where: { id: booking.customerId } });
        const serviceProvider = await this.serviceProviderRepository.findOne({
            where: { id: booking.serviceProviderId },
            relations: ['owner']
        });
        if (customer && serviceProvider) {
            await this.sendBookingSMSNotifications(booking, serviceProvider, customer, 'rejected', reason);
        }
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
    async checkTimeConflicts(serviceId, serviceDate, serviceTime, duration) {
        const startTime = new Date(`${serviceDate}T${serviceTime}`);
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
        return this.bookingRepository
            .createQueryBuilder('booking')
            .where('booking.serviceProviderId = :serviceId', { serviceId })
            .andWhere('booking.serviceDate = :serviceDate', { serviceDate })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.PENDING_APPROVAL, booking_entity_1.BookingStatus.APPROVED]
        })
            .andWhere('(booking.serviceTime BETWEEN :startTime AND :endTime OR ' +
            ':startTime BETWEEN booking.serviceTime AND DATE_ADD(booking.serviceTime, INTERVAL booking.duration HOUR))', { startTime: serviceTime, endTime: endTime.toTimeString().slice(0, 5) })
            .getMany();
    }
    getBasePrice(serviceType) {
        if (!serviceType)
            return 600;
        const priceMap = {
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
    /**
     * Send SMS notifications for booking events
     */
    async sendBookingSMSNotifications(booking, serviceProvider, customer, event, rejectionReason) {
        if (!this.applinkService.isConfigured()) {
            return;
        }
        try {
            if (event === 'created') {
                // Notify customer
                if (customer.phone && customer.smsNotifications) {
                    const customerMessage = `Your ${serviceProvider.serviceType} service booking request has been submitted. Booking ID: ${booking.id}. Waiting for provider approval.`;
                    await this.applinkService.sendSMS(customer.phone, customerMessage);
                }
                // Notify service provider
                if (serviceProvider.owner) {
                    const provider = await this.userRepository.findOne({ where: { id: serviceProvider.owner.id } });
                    if (provider && provider.phone && provider.smsNotifications) {
                        const providerMessage = `New booking request from ${customer.name} for ${serviceProvider.serviceType} on ${booking.serviceDate} at ${booking.serviceTime}. Booking ID: ${booking.id}.`;
                        await this.applinkService.sendSMS(provider.phone, providerMessage);
                    }
                }
            }
            else if (event === 'approved') {
                // Notify customer
                if (customer.phone && customer.smsNotifications) {
                    const customerMessage = `Great news! Your ${serviceProvider.serviceType} service booking (ID: ${booking.id}) has been approved. Service scheduled for ${booking.serviceDate} at ${booking.serviceTime}.`;
                    await this.applinkService.sendSMS(customer.phone, customerMessage);
                }
            }
            else if (event === 'rejected') {
                // Notify customer
                if (customer.phone && customer.smsNotifications) {
                    const reasonText = rejectionReason ? ` Reason: ${rejectionReason}.` : '';
                    const customerMessage = `Your ${serviceProvider.serviceType} service booking (ID: ${booking.id}) has been declined.${reasonText} Please try booking another time slot.`;
                    await this.applinkService.sendSMS(customer.phone, customerMessage);
                }
            }
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
            this.logger.error(`Failed to send booking SMS notifications: ${errorMessage}`);
            // Don't throw - SMS failure shouldn't break booking flow
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(service_provider_entity_1.ServiceProvider)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        applink_service_1.ApplinkService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map