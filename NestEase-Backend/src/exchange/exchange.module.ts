import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeProduct } from './entities/exchange-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeProduct])],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {} 