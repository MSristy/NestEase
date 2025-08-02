import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Query, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { PropertyType, PropertyStatus, Property } from './property.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

// Interface for authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // Public endpoints - no authentication required
  @Get()
  findAll(@Query('type') type?: PropertyType, @Query('status') status?: PropertyStatus) {
    return this.propertiesService.findAll(type, status);
  }

  @Get('owner/:ownerId')
  getPropertiesByOwner(@Param('ownerId') ownerId: string) {
    return this.propertiesService.getPropertiesByOwner(Number(ownerId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  // Protected endpoints - require authentication
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  create(@Body() createPropertyDto: CreatePropertyDto, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.create(createPropertyDto, req.user.id);
  }

  // Landlord gets pending booking requests for their properties
  @Get('pending-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  getPendingRequests(@Req() req: AuthenticatedRequest) {
    return this.propertiesService.getPendingRequests(req.user.id);
  }

  // Seller gets pending purchase requests for their properties
  @Get('pending-purchases')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  getPendingPurchases(@Req() req: AuthenticatedRequest) {
    return this.propertiesService.getPendingPurchases(req.user.id);
  }

  // Landlord/Seller: My properties
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  getMyProperties(@Req() req: AuthenticatedRequest) {
    return this.propertiesService.getPropertiesByOwner(req.user.id);
  }

  // Tenant/Buyer: My bookings/purchases
  @Get('my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  getMyBookings(@Req() req: AuthenticatedRequest) {
    return this.propertiesService.getMyBookings(req.user.id);
  }

  // Landlord posts rental property
  @Post('rent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  createRental(@Body() createPropertyDto: Partial<Property>, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.create({ ...createPropertyDto, type: PropertyType.RENT }, req.user.id);
  }

  // Seller posts property for sale
  @Post('sale')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  createSale(@Body() createPropertyDto: Partial<Property>, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.create({ ...createPropertyDto, type: PropertyType.SALE }, req.user.id);
  }

  // Tenant books rental property
  @Post(':id/book')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TENANT)
  bookProperty(@Param('id') propertyId: string, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.bookProperty(propertyId, req.user.id);
  }

  // Buyer buys property for sale
  @Post(':id/buy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  buyProperty(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.buyProperty(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.update(id, updatePropertyDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.remove(id, req.user.id);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  verifyProperty(@Param('id') id: string) {
    return this.propertiesService.verifyProperty(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = files.map(file => `/uploads/properties/${file.filename}`);
    return { urls };
  }

  // Landlord approves a booking
  @Post('bookings/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  approveBooking(@Param('id') bookingId: string, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.approveBooking(bookingId, req.user.id);
  }

  // Seller approves a purchase
  @Post('purchases/:purchaseId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  approvePurchase(@Param('purchaseId') purchaseId: string) {
    return this.propertiesService.approvePurchase(purchaseId);
  }

  // Seller rejects a purchase
  @Post('purchases/:purchaseId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  rejectPurchase(@Param('purchaseId') purchaseId: string, @Body('reason') reason: string) {
    return this.propertiesService.rejectPurchase(purchaseId, reason);
  }

  // Landlord rejects a booking
  @Post('bookings/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPERTY_OWNER')
  rejectBooking(@Param('id') bookingId: string, @Body() body: { reason: string }, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.rejectBooking(bookingId, body.reason, req.user.id);
  }

  // Process payment for approved booking
  @Post('bookings/:id/payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  processPayment(@Param('id') bookingId: string, @Body() body: { paymentMethod: string }, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.processPayment(bookingId, body.paymentMethod, req.user.id);
  }

  // Get booking details for payment
  @Get('bookings/:id/payment-details')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  getPaymentDetails(@Param('id') bookingId: string, @Req() req: AuthenticatedRequest) {
    return this.propertiesService.getPaymentDetails(bookingId, req.user.id);
  }
} 