import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddSwapController } from './add-swap.controller';
import { AddSwapService } from './add-swap.service';
import { AddSwap } from '../entities/add-swap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddSwap])],
  controllers: [AddSwapController],
  providers: [AddSwapService],
  exports: [AddSwapService],
})
export class AddSwapModule {} 