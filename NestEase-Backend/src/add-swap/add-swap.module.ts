import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AddSwapController } from './add-swap.controller';
import { AddSwapService } from './add-swap.service';
import { AddSwap } from './entities/add-swap.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddSwap]),
    MulterModule.register({
      dest: './uploads/swaps',
    }),
  ],
  controllers: [AddSwapController],
  providers: [AddSwapService],
})
export class AddSwapModule {} 