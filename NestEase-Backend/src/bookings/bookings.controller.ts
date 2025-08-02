import { Controller, Post, Get, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { Request } from 'express';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('service/:serviceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async createBooking(
    @Param('serviceId') serviceId: string,
    @Body() bookingData: any,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const serviceIdNum = parseInt(serviceId);
    
    if (isNaN(serviceIdNum)) {
      throw new BadRequestException('Invalid service ID');
    }
    
    return this.bookingsService.createBooking(serviceIdNum, bookingData, userId);
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async getMyBookings(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.bookingsService.getMyBookings(userId);
  }

  @Get('customer-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getCustomerBookings(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.bookingsService.getCustomerBookings(userId);
  }

  @Post(':bookingId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async approveBooking(
    @Param('bookingId') bookingId: string,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const bookingIdNum = parseInt(bookingId);
    
    if (isNaN(bookingIdNum)) {
      throw new BadRequestException('Invalid booking ID');
    }
    
    return this.bookingsService.approveBooking(bookingIdNum, userId);
  }

  @Post(':bookingId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async rejectBooking(
    @Param('bookingId') bookingId: string,
    @Body() data: { reason: string },
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const bookingIdNum = parseInt(bookingId);
    
    if (isNaN(bookingIdNum)) {
      throw new BadRequestException('Invalid booking ID');
    }
    
    return this.bookingsService.rejectBooking(bookingIdNum, userId, data.reason);
  }
} 