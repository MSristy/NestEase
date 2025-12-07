import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { ServiceProvider } from '../service-providers/entities/service-provider.entity';
import { User } from '../users/entities/user.entity';
import { ApplinkModule } from '../applink/applink.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, ServiceProvider, User]),
    ApplinkModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {} 