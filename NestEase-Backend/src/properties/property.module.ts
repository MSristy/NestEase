import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './property.entity';
import { PropertyBooking } from './property-booking.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { StripeModule } from '../payment/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyBooking]),
    StripeModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService]
})
export class PropertyModule {} 