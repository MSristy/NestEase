import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServiceProviderService } from './service-provider.service';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { Request } from 'express';

@Controller('service-providers')
export class ServiceProviderController {
  constructor(private readonly serviceProviderService: ServiceProviderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
  ], {
    storage: diskStorage({
      destination: './uploads/services',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  create(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() createDto: CreateServiceProviderDto, 
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const imagePaths = files?.images?.map(file => `/uploads/services/${file.filename}`) || [];
    
    console.log('Uploaded files:', files);
    console.log('Image paths:', imagePaths);
    
    // Convert rating to number if it's a string
    if (createDto.rating && typeof createDto.rating === 'string') {
      createDto.rating = parseFloat(createDto.rating);
    }
    
    return this.serviceProviderService.create(createDto, userId, imagePaths);
  }

  @Post(':id/book')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async bookService(
    @Param('id') id: string,
    @Body() bookingData: any,
    @Req() req: Request
  ) {
    console.log('=== BOOKING ENDPOINT DEBUG ===');
    console.log('Service ID:', id);
    console.log('Booking data:', bookingData);
    console.log('User from request:', req.user);
    console.log('User ID:', (req.user as any).id);
    console.log('User role:', (req.user as any).role);
    console.log('User email:', (req.user as any).email);
    console.log('================================');
    
    const userId = (req.user as any).id;
    const serviceId = parseInt(id);
    
    if (isNaN(serviceId)) {
      console.error('Invalid service ID:', id);
      throw new BadRequestException('Invalid service ID');
    }
    
    try {
      const result = await this.serviceProviderService.bookService(serviceId, bookingData, userId);
      console.log('Booking successful:', result);
      return result;
    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const serviceId = parseInt(id);
    
    if (isNaN(serviceId)) {
      throw new BadRequestException('Invalid service ID');
    }
    
    return this.serviceProviderService.toggleFavorite(serviceId, userId);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.serviceProviderService.getFavorites(userId);
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async getBookings(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.serviceProviderService.getBookings(userId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getServiceHistory(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.serviceProviderService.getServiceHistory(userId);
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async getMyBookings(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.serviceProviderService.getMyBookings(userId);
  }

  @Post('bookings/:bookingId/approve')
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
    
    return this.serviceProviderService.approveBooking(bookingIdNum, userId);
  }

  @Post('bookings/:bookingId/reject')
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
    
    return this.serviceProviderService.rejectBooking(bookingIdNum, userId, data.reason);
  }

  @Post('bookings/:bookingId/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const bookingIdNum = parseInt(bookingId);
    
    if (isNaN(bookingIdNum)) {
      throw new BadRequestException('Invalid booking ID');
    }
    
    return this.serviceProviderService.cancelBooking(bookingIdNum, userId);
  }

  @Post('bookings/:bookingId/payment')
  @UseGuards(JwtAuthGuard)
  async processPayment(
    @Param('bookingId') bookingId: string,
    @Body() data: { paymentMethod: 'cash' | 'online' },
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const bookingIdNum = parseInt(bookingId);
    
    if (isNaN(bookingIdNum)) {
      throw new BadRequestException('Invalid booking ID');
    }
    
    if (!data.paymentMethod || !['cash', 'online'].includes(data.paymentMethod)) {
      throw new BadRequestException('Invalid payment method. Must be "cash" or "online"');
    }
    
    return this.serviceProviderService.processPayment(bookingIdNum, userId, data.paymentMethod);
  }

  @Get('bookings/:bookingId/payment-options')
  @UseGuards(JwtAuthGuard)
  async getPaymentOptions(
    @Param('bookingId') bookingId: string,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const bookingIdNum = parseInt(bookingId);
    
    if (isNaN(bookingIdNum)) {
      throw new BadRequestException('Invalid booking ID');
    }
    
    return this.serviceProviderService.getPaymentOptions(bookingIdNum, userId);
  }

  @Post('bookings/:bookingId/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async completeService(
    @Param('bookingId') bookingId: string,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const bookingIdNum = parseInt(bookingId);
    
    if (isNaN(bookingIdNum)) {
      throw new BadRequestException('Invalid booking ID');
    }
    
    return this.serviceProviderService.completeService(bookingIdNum, userId);
  }

  @Get('public')
  findAllPublic() {
    return this.serviceProviderService.findAll();
  }

  @Get()
  findAll() {
    return this.serviceProviderService.findAll();
  }

  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard)
  checkProfile(@Param('userId') userId: string) {
    return this.serviceProviderService.checkProfile(parseInt(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProviderService.findOne(parseInt(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServiceProviderDto,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.serviceProviderService.update(parseInt(id), updateDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.serviceProviderService.remove(parseInt(id), userId);
  }
} 