import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveAndSwapController } from './save-and-swap.controller';
import { SaveAndSwapService } from './save-and-swap.service';
import { SaveAndSwap } from './entities/save-and-swap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaveAndSwap])],
  controllers: [SaveAndSwapController],
  providers: [SaveAndSwapService],
  exports: [SaveAndSwapService],
})
export class SaveAndSwapModule {} 