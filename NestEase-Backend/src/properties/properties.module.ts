import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from './property.entity';
import { PropertyPurchase } from './entities/property-purchase.entity';
import { PropertyBooking } from './property-booking.entity';
import { User } from '../users/entities/user.entity';
import { StripeModule } from '../payment/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyPurchase, PropertyBooking, User]),
    MulterModule.register({
      dest: './uploads/properties',
    }),
    StripeModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {} 