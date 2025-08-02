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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_provider_entity_1 = require("./entities/service-provider.entity");
const user_entity_1 = require("../users/entities/user.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const notification_service_1 = require("../users/notification.service");
const notification_entity_1 = require("../users/entities/notification.entity");
let ServiceProviderService = class ServiceProviderService {
    constructor(serviceProviderRepository, userRepository, bookingRepository, notificationService) {
        this.serviceProviderRepository = serviceProviderRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }
    async create(createServiceProviderDto, userId, imagePaths = []) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async findAll() {
        return this.serviceProviderRepository.find({
            relations: ['owner'],
        });
    }
    async checkProfile(userId) {
        const serviceProvider = await this.serviceProviderRepository.findOne({
            where: { owner: { id: userId } },
        });
        return { hasProfile: !!serviceProvider };
    }
    async findOne(id) {
        const serviceProvider = await this.serviceProviderRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!serviceProvider) {
            throw new common_1.NotFoundException('Service provider not found');
        }
        return serviceProvider;
    }
    async update(id, updateServiceProviderDto, userId) {
        const serviceProvider = await this.findOne(id);
        if (serviceProvider.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to update this service provider');
        }
        Object.assign(serviceProvider, updateServiceProviderDto);
        return this.serviceProviderRepository.save(serviceProvider);
    }
    async remove(id, userId) {
        const serviceProvider = await this.findOne(id);
        if (serviceProvider.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to delete this service provider');
        }
        await this.serviceProviderRepository.remove(serviceProvider);
    }
    async bookService(serviceId, bookingData, userId) {
        console.log('Service booking started:', { serviceId, bookingData, userId });
        try {
            const serviceProvider = await this.findOne(serviceId);
            if (!serviceProvider) {
                console.error('Service provider not found:', serviceId);
                throw new common_1.NotFoundException('Service provider not found');
            }
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                console.error('User not found:', userId);
                throw new common_1.NotFoundException('User not found');
            }
            console.log('Found service provider and user:', {
                serviceProvider: serviceProvider.businessName,
                user: user.name
            });
            // Check for time conflicts (existing bookings at the same time)
            const existingBookings = await this.checkTimeConflicts(serviceId, bookingData.serviceDate, bookingData.serviceTime, bookingData.duration);
            if (existingBookings.length > 0) {
                console.error('Time conflict detected:', existingBookings);
                throw new common_1.BadRequestException('This time slot is already booked. Please choose a different time.');
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
                status: booking_entity_1.BookingStatus.PENDING_APPROVAL,
                totalAmount: totalAmount,
                paymentStatus: booking_entity_1.PaymentStatus.PENDING,
                paymentMethod: booking_entity_1.PaymentMethod.PENDING,
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
        }
        catch (error) {
            console.error('Error in bookService:', error);
            throw error;
        }
    }
    async checkTimeConflicts(serviceId, serviceDate, serviceTime, duration) {
        const newBookingStart = new Date(`${serviceDate}T${serviceTime}:00.000Z`);
        const newBookingEnd = new Date(newBookingStart.getTime() + duration * 60 * 60 * 1000);
        // Find existing bookings for the same provider that are not rejected or cancelled.
        const existingBookings = await this.bookingRepository.find({
            where: {
                serviceProviderId: serviceId,
                status: (0, typeorm_2.In)([booking_entity_1.BookingStatus.APPROVED, booking_entity_1.BookingStatus.PENDING_APPROVAL]),
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
    getBasePrice(serviceType) {
        console.log('Getting base price for service type:', serviceType);
        const priceMap = {
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
    async toggleFavorite(serviceId, userId) {
        const serviceProvider = await this.findOne(serviceId);
        if (!serviceProvider) {
            throw new common_1.NotFoundException('Service provider not found');
        }
        // For now, just return a success response
        // In a real application, you would manage favorites in a separate table
        return {
            success: true,
            message: 'Favorite toggled successfully',
            isFavorite: true
        };
    }
    async getFavorites(userId) {
        // For now, return empty array
        // In a real application, you would query favorites from database
        return [];
    }
    async getBookings(userId) {
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
            paymentStatus: booking.paymentStatus || booking_entity_1.PaymentStatus.PENDING,
            paymentMethod: booking.paymentMethod || booking_entity_1.PaymentMethod.PENDING,
            billId: booking.billId,
        }));
    }
    async getServiceHistory(userId) {
        // Get completed bookings for the customer
        const bookings = await this.bookingRepository.find({
            where: {
                customerId: userId,
                status: booking_entity_1.BookingStatus.COMPLETED
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
    async getMyBookings(userId) {
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
    async approveBooking(bookingId, userId) {
        const serviceProviderProfile = await this.serviceProviderRepository.findOne({ where: { owner: { id: userId } } });
        if (!serviceProviderProfile) {
            throw new common_1.UnauthorizedException('You do not have a service provider profile.');
        }
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, serviceProviderId: serviceProviderProfile.id },
            relations: ['customer'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found or you are not authorized to modify it.');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not in pending approval status');
        }
        booking.status = booking_entity_1.BookingStatus.APPROVED;
        await this.bookingRepository.save(booking);
        // Send notification to customer
        await this.notificationService.createNotification(booking.customerId, notification_entity_1.NotificationType.SERVICE, 'Service Booking Approved', `Your booking for ${booking.serviceType} on ${booking.serviceDate} at ${booking.serviceTime} has been approved.`);
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
    async rejectBooking(bookingId, userId, reason) {
        const serviceProviderProfile = await this.serviceProviderRepository.findOne({ where: { owner: { id: userId } } });
        if (!serviceProviderProfile) {
            throw new common_1.UnauthorizedException('You do not have a service provider profile.');
        }
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, serviceProviderId: serviceProviderProfile.id },
            relations: ['customer'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found or you are not authorized to modify it.');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not in pending approval status');
        }
        booking.status = booking_entity_1.BookingStatus.REJECTED;
        booking.rejectionReason = reason;
        await this.bookingRepository.save(booking);
        // Send notification to customer
        await this.notificationService.createNotification(booking.customerId, notification_entity_1.NotificationType.SERVICE, 'Service Booking Rejected', `Your booking for ${booking.serviceType} on ${booking.serviceDate} at ${booking.serviceTime} was rejected. Reason: ${reason}`);
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
    async cancelBooking(bookingId, userId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, customerId: userId }
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found or you are not authorized to cancel it.');
        }
        if (booking.status !== booking_entity_1.BookingStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved bookings can be cancelled');
        }
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
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
    async processPayment(bookingId, userId, paymentMethod) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, customerId: userId },
            relations: ['serviceProvider', 'serviceProvider.owner']
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found or you are not authorized to process payment.');
        }
        if (booking.status !== booking_entity_1.BookingStatus.APPROVED) {
            throw new common_1.BadRequestException('Payment can only be processed for approved bookings');
        }
        if (booking.paymentStatus === booking_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Payment has already been processed for this booking');
        }
        booking.paymentStatus = booking_entity_1.PaymentStatus.PAID;
        booking.paymentMethod = paymentMethod === 'cash' ? booking_entity_1.PaymentMethod.CASH : booking_entity_1.PaymentMethod.ONLINE;
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
    async getPaymentOptions(bookingId, userId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, customerId: userId },
            relations: ['serviceProvider']
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found or you are not authorized to access it.');
        }
        if (booking.status !== booking_entity_1.BookingStatus.APPROVED) {
            throw new common_1.BadRequestException('Payment options are only available for approved bookings');
        }
        if (booking.paymentStatus === booking_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Payment has already been processed for this booking');
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
    async completeService(bookingId, userId) {
        const serviceProviderProfile = await this.serviceProviderRepository.findOne({ where: { owner: { id: userId } } });
        if (!serviceProviderProfile) {
            throw new common_1.UnauthorizedException('You do not have a service provider profile.');
        }
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, serviceProviderId: serviceProviderProfile.id }
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found or you are not authorized to complete it.');
        }
        if (booking.status !== booking_entity_1.BookingStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved bookings can be marked as completed');
        }
        if (booking.paymentStatus !== booking_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Payment must be completed before marking service as completed');
        }
        booking.status = booking_entity_1.BookingStatus.COMPLETED;
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
};
exports.ServiceProviderService = ServiceProviderService;
exports.ServiceProviderService = ServiceProviderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_provider_entity_1.ServiceProvider)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ServiceProviderService);
//# sourceMappingURL=service-provider.service.js.map