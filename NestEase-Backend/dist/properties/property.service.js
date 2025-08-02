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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("../properties/property.entity");
const property_booking_entity_1 = require("./property-booking.entity");
const user_entity_1 = require("../users/entities/user.entity");
let PropertyService = class PropertyService {
    constructor(propertyRepository, bookingRepository, userRepository) {
        this.propertyRepository = propertyRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }
    async create(createPropertyDto, userId) {
        const owner = await this.userRepository.findOneBy({ id: userId });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        const property = this.propertyRepository.create(Object.assign({}, createPropertyDto));
        property.owner = owner;
        return await this.propertyRepository.save(property);
    }
    async findAll() {
        return await this.propertyRepository.find({
            relations: ['owner'],
        });
    }
    async findOne(id) {
        if (!id)
            throw new common_1.BadRequestException('Invalid ID');
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async update(id, updatePropertyDto, userId) {
        const property = await this.findOne(id);
        if (property.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to update this property');
        }
        Object.assign(property, updatePropertyDto);
        return await this.propertyRepository.save(property);
    }
    async remove(id, userId) {
        const property = await this.findOne(id);
        if (property.owner.id !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to delete this property');
        }
        await this.propertyRepository.remove(property);
    }
    async bookProperty(propertyId, userId, bookingDto) {
        const property = await this.findOne(propertyId);
        const tenant = await this.userRepository.findOneBy({ id: userId });
        if (!property || !tenant)
            throw new common_1.NotFoundException('Property or tenant not found');
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
    async confirmBooking(bookingId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['property', 'tenant'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        booking.status = 'CONFIRMED';
        return await this.bookingRepository.save(booking);
    }
    async cancelBooking(bookingId, reason) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['property', 'tenant'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        booking.status = 'CANCELLED';
        booking.cancellationReason = reason;
        return await this.bookingRepository.save(booking);
    }
    calculateTotalPrice(property, bookingDto) {
        const days = Math.ceil((bookingDto.checkOutDate.getTime() - bookingDto.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        return property.price * days;
    }
    async getBookingRequestsForOwner(ownerId) {
        const properties = await this.propertyRepository
            .createQueryBuilder('property')
            .leftJoinAndSelect('property.bookings', 'bookings')
            .leftJoinAndSelect('bookings.tenant', 'tenant')
            .where('property.ownerId = :ownerId', { ownerId })
            .getMany();
        const requests = [];
        for (const property of properties) {
            for (const booking of property.bookings) {
                requests.push(Object.assign(Object.assign({}, booking), { property, tenant: booking.tenant }));
            }
        }
        return requests;
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(property_booking_entity_1.PropertyBooking)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PropertyService);
//# sourceMappingURL=property.service.js.map