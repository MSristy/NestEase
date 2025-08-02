import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/service-provider.entity';
import { ServiceProviderController } from './service-provider.controller';
import { ServiceProviderService } from './service-provider.service';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingsModule } from '../bookings/bookings.module';
import { NotificationService } from '../users/notification.service';
import { UsersModule } from '../users/users.module';
import { Notification } from '../users/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProvider, User, Booking, Notification]),
    BookingsModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [ServiceProviderController],
  providers: [ServiceProviderService, NotificationService],
  exports: [ServiceProviderService]
})
export class ServiceProviderModule {} 