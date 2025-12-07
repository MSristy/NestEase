import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ApplinkService } from './applink.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule, // Required for ConfigService used in ApplinkService
  ],
  providers: [ApplinkService],
  exports: [ApplinkService],
})
export class ApplinkModule {}

