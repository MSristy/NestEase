import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { ItemOffer } from './entities/item-offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemOffer])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {} 