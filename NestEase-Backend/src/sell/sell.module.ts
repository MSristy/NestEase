import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellController } from './sell.controller';
import { SellService } from './sell.service';
import { SellProduct } from './sell.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellProduct])],
  controllers: [SellController],
  providers: [SellService],
})
export class SellModule {} 