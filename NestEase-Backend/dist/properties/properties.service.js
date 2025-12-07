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
var PropertiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./property.entity");
const user_entity_1 = require("../users/entities/user.entity");
const property_booking_entity_1 = require("./property-booking.entity");
const property_purchase_entity_1 = require("./entities/property-purchase.entity");
const stripe_service_1 = require("../payment/stripe.service");
const applink_service_1 = require("../applink/applink.service");
let PropertiesService = PropertiesService_1 = class PropertiesService {
    constructor(propertiesRepository, usersRepository, propertyBookingRepository, propertyPurchaseRepository, stripeService, applinkService) {
        this.propertiesRepository = propertiesRepository;
        this.usersRepository = usersRepository;
        this.propertyBookingRepository = propertyBookingRepository;
        this.propertyPurchaseRepository = propertyPurchaseRepository;
        this.stripeService = stripeService;
        this.applinkService = applinkService;
        this.logger = new common_1.Logger(PropertiesService_1.name);
    }
    async create(createPropertyDto, ownerId) {
        const owner = await this.usersRepository.findOne({ where: { id: ownerId } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        console.log('Received createPropertyDto:', JSON.stringify(createPropertyDto, null, 2));
        console.log('Amenities from DTO:', createPropertyDto.amenities);
        console.log('Amenities type:', typeof createPropertyDto.amenities);
        console.log('Is amenities array?', Array.isArray(createPropertyDto.amenities));
        const amenities = Array.isArray(createPropertyDto.amenities) ? createPropertyDto.amenities : [];
        console.log('Processed amenities:', amenities);
        const property = this.propertiesRepository.create(Object.assign(Object.assign({}, createPropertyDto), { amenities, owner }));
        console.log('Property to save:', JSON.stringify(property, null, 2));
        const savedProperty = await this.propertiesRepository.save(property);
        console.log('Saved property amenities:', savedProperty.amenities);
        return savedProperty;
    }
    async findAll(type, status) {
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        return this.propertiesRepository.find({ where, relations: ['owner'] });
    }
    async findOne(id) {
        const property = await this.propertiesRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async update(id, updatePropertyDto, ownerId) {
        const property = await this.findOne(id);
        if (property.owner.id !== ownerId) {
            throw new common_1.UnauthorizedException('You can only update your own properties');
        }
        Object.assign(property, updatePropertyDto);
        return this.propertiesRepository.save(property);
    }
    async remove(id, ownerId) {
        const property = await this.findOne(id);
        if (property.owner.id !== ownerId) {
            throw new common_1.UnauthorizedException('You can only delete your own properties');
        }
        await this.propertiesRepository.remove(property);
    }
    async verifyProperty(id) {
        const property = await this.findOne(id);
        property.isVerified = true;
        return this.propertiesRepository.save(property);
    }
    async getPropertiesByOwner(ownerId) {
        return this.propertiesRepository.find({
            where: { owner: { id: ownerId } },
            relations: ['owner'],
        });
    }
    // Tenant books rental property
    async bookProperty(propertyId, tenantId) {
        const property = await this.findOne(propertyId);
        if (property.type !== property_entity_1.PropertyType.RENT || property.status !== property_entity_1.PropertyStatus.AVAILABLE) {
            throw new common_1.NotFoundException('Property not available for rent');
        }
        const tenant = await this.usersRepository.findOne({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        property.status = property_entity_1.PropertyStatus.PENDING;
        await this.propertiesRepository.save(property);
        const booking = this.propertyBookingRepository.create({
            property: property,
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
    async sendPropertyBookingSMS(property, tenant, booking) {
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
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
            this.logger.error(`Failed to send property booking SMS: ${errorMessage}`);
            // Don't throw - SMS failure shouldn't break booking flow
        }
    }
    // Get tenant's bookings
    async getMyBookings(userId) {
        const bookings = await this.propertyBookingRepository.find({
            where: { tenant: { id: userId } },
            relations: ['property', 'property.owner'],
            order: { createdAt: 'DESC' },
        });
        return bookings.map(booking => (Object.assign(Object.assign({}, booking), { property: Object.assign(Object.assign({}, booking.property), { owner: {
                    id: booking.property.owner.id,
                    name: booking.property.owner.name,
                    email: booking.property.owner.email,
                } }) })));
    }
    // Get landlord's pending requests
    async getPendingRequests(ownerId) {
        const bookings = await this.propertyBookingRepository.find({
            where: {
                property: { owner: { id: ownerId } },
                status: 'PENDING'
            },
            relations: ['property', 'tenant'],
            order: { createdAt: 'DESC' },
        });
        return bookings.map(booking => (Object.assign(Object.assign({}, booking), { tenant: {
                id: booking.tenant.id,
                name: booking.tenant.name,
                email: booking.tenant.email,
            } })));
    }
    // Get landlord's pending purchases
    async getPendingPurchases(ownerId) {
        const purchases = await this.propertyPurchaseRepository.find({
            where: {
                property: { owner: { id: ownerId } },
                status: 'PENDING'
            },
            relations: ['property', 'buyer'],
            order: { createdAt: 'DESC' },
        });
        return purchases.map(purchase => (Object.assign(Object.assign({}, purchase), { buyer: {
                id: purchase.buyer.id,
                name: purchase.buyer.name,
                email: purchase.buyer.email,
            } })));
    }
    // Landlord approves booking
    async approveBooking(bookingId, ownerId) {
        const booking = await this.propertyBookingRepository.findOne({
            where: { id: bookingId },
            relations: ['property', 'property.owner'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.property.owner.id !== ownerId) {
            throw new common_1.UnauthorizedException('You can only approve bookings for your own properties');
        }
        if (booking.status !== 'PENDING')
            throw new common_1.BadRequestException('Booking is not pending');
        booking.status = 'CONFIRMED';
        booking.property.status = property_entity_1.PropertyStatus.BOOKED;
        await this.propertiesRepository.save(booking.property);
        return await this.propertyBookingRepository.save(booking);
    }
    // Landlord rejects booking
    async rejectBooking(bookingId, reason, ownerId) {
        const booking = await this.propertyBookingRepository.findOne({
            where: { id: bookingId },
            relations: ['property', 'property.owner'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.property.owner.id !== ownerId) {
            throw new common_1.UnauthorizedException('You can only reject bookings for your own properties');
        }
        if (booking.status !== 'PENDING')
            throw new common_1.BadRequestException('Booking is not pending');
        booking.status = 'REJECTED';
        booking.rejectionReason = reason;
        booking.property.status = property_entity_1.PropertyStatus.AVAILABLE;
        await this.propertiesRepository.save(booking.property);
        return await this.propertyBookingRepository.save(booking);
    }
    // Process payment for approved booking
    async processPayment(bookingId, paymentMethod, userId) {
        const booking = await this.propertyBookingRepository.findOne({
            where: { id: bookingId, tenant: { id: userId } },
            relations: ['property'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed bookings can be paid for');
        }
        if (booking.paymentStatus === 'PAID') {
            throw new common_1.BadRequestException('Payment already completed');
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
        }
        else {
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
    async getPaymentDetails(bookingId, userId) {
        const booking = await this.propertyBookingRepository.findOne({
            where: { id: bookingId, tenant: { id: userId } },
            relations: ['property'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
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
    async buyProperty(propertyId, buyerId) {
        const property = await this.findOne(propertyId);
        if (property.type !== property_entity_1.PropertyType.SALE || property.status !== property_entity_1.PropertyStatus.AVAILABLE) {
            throw new common_1.NotFoundException('Property not available for sale');
        }
        const buyer = await this.usersRepository.findOne({ where: { id: buyerId } });
        if (!buyer)
            throw new common_1.NotFoundException('Buyer not found');
        property.status = property_entity_1.PropertyStatus.PENDING;
        await this.propertiesRepository.save(property);
        const purchase = this.propertyPurchaseRepository.create({
            property: property,
            buyer,
            totalPrice: property.price,
            status: 'PENDING',
            paymentStatus: 'PENDING',
        });
        return await this.propertyPurchaseRepository.save(purchase);
    }
    // Tenant/Buyer: My bookings/purchases
    async getBookingsByUser(userId) {
        const bookings = await this.propertyBookingRepository.find({
            where: { tenant: { id: userId } },
            relations: ['property'],
        });
        const purchases = await this.propertyPurchaseRepository.find({
            where: { buyer: { id: userId } },
            relations: ['property'],
        });
        return [
            ...bookings.map(b => (Object.assign(Object.assign({}, b.property), { status: b.status, bookingId: b.id }))),
            ...purchases.map(p => (Object.assign(Object.assign({}, p.property), { status: p.status, purchaseId: p.id }))),
        ];
    }
    // Seller: Get pending purchase requests for their properties
    async getPendingPurchasesForOwner(ownerId) {
        const purchases = await this.propertyPurchaseRepository.find({
            where: { status: 'PENDING' },
            relations: ['property', 'buyer', 'property.owner'],
        });
        return purchases
            .filter(p => p.property && p.property.owner && p.property.owner.id === ownerId)
            .map(p => (Object.assign(Object.assign({}, p), { property: {
                id: p.property.id,
                title: p.property.title,
                address: p.property.address,
                city: p.property.city,
                state: p.property.state,
            }, buyer: {
                id: p.buyer.id,
                name: p.buyer.name,
                email: p.buyer.email,
            } })));
    }
    // Seller approves purchase
    async approvePurchase(purchaseId) {
        const purchase = await this.propertyPurchaseRepository.findOne({
            where: { id: purchaseId },
            relations: ['property'],
        });
        if (!purchase)
            throw new common_1.NotFoundException('Purchase not found');
        if (purchase.status !== 'PENDING')
            throw new Error('Purchase is not pending');
        purchase.status = 'CONFIRMED';
        purchase.property.status = property_entity_1.PropertyStatus.SOLD;
        await this.propertiesRepository.save(purchase.property);
        return await this.propertyPurchaseRepository.save(purchase);
    }
    // Seller rejects purchase
    async rejectPurchase(purchaseId, reason) {
        const purchase = await this.propertyPurchaseRepository.findOne({
            where: { id: purchaseId },
            relations: ['property'],
        });
        if (!purchase)
            throw new common_1.NotFoundException('Purchase not found');
        if (purchase.status !== 'PENDING')
            throw new Error('Purchase is not pending');
        purchase.status = 'REJECTED';
        purchase.rejectionReason = reason;
        purchase.property.status = property_entity_1.PropertyStatus.AVAILABLE;
        await this.propertiesRepository.save(purchase.property);
        return await this.propertyPurchaseRepository.save(purchase);
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = PropertiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(property_booking_entity_1.PropertyBooking)),
    __param(3, (0, typeorm_1.InjectRepository)(property_purchase_entity_1.PropertyPurchase)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_service_1.StripeService,
        applink_service_1.ApplinkService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map