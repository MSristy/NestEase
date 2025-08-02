import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { BookPropertyDto } from './dto/book-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { Request } from 'express';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @Roles(Role.PROPERTY_OWNER)
  create(@Body() createPropertyDto: CreatePropertyDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.propertyService.create(createPropertyDto, userId);
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.PROPERTY_OWNER)
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.propertyService.update(id, updatePropertyDto, userId);
  }

  @Delete(':id')
  @Roles(Role.PROPERTY_OWNER)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.propertyService.remove(id, userId);
  }

  @Post(':id/book')
  @Roles(Role.USER)
  bookProperty(
    @Param('id') id: string,
    @Body() bookingDto: BookPropertyDto,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.propertyService.bookProperty(id, userId, bookingDto);
  }

  @Post('bookings/:id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmBooking(@Param('id') bookingId: string) {
    return await this.propertyService.confirmBooking(bookingId);
  }

  @Post('bookings/:id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Param('id') bookingId: string,
    @Body('reason') reason: string
  ) {
    return await this.propertyService.cancelBooking(bookingId, reason);
  }
} 