import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { Property } from '../properties/property.entity';
import { PropertyBooking } from '../properties/property-booking.entity';
import { PropertyPurchase } from '../properties/entities/property-purchase.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyBooking,
      PropertyPurchase,
      User,
    ]),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {} 