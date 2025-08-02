import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwapItem } from './entities/swap-item.entity';
import { SwapRequest } from './entities/swap-request.entity';
import { SwapController } from './controllers/swap.controller';
import { SwapService } from './services/swap.service';
import { StripeModule } from '../payment/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SwapItem, SwapRequest]),
    StripeModule
  ],
  controllers: [SwapController],
  providers: [SwapService],
  exports: [SwapService]
})
export class SwapModule {} 