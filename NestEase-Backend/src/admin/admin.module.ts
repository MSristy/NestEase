import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { PublicStatsController } from './public-stats.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/property.entity';
import { ServiceProvider } from '../service-providers/entities/service-provider.entity';
import { SaveAndSwap } from '../save-and-swap/entities/save-and-swap.entity';
import { AddSwap } from '../add-swap/entities/add-swap.entity';
import { SellProduct } from '../sell/sell.entity';
import { ItemOffer } from '../offer/entities/item-offer.entity';
import { JobApplication } from '../careers/entities/job-application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Property,
      ServiceProvider,
      SaveAndSwap,
      AddSwap,
      SellProduct,
      ItemOffer,
      JobApplication,
    ]),
  ],
  controllers: [AdminController, PublicStatsController],
  providers: [AdminService],
})
export class AdminModule {} 