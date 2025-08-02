import { Module } from '@nestjs/common';
import { SwapController } from './swap.controller';

@Module({
  controllers: [SwapController],
})
export class SwapModule {}
