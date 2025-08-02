import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareersController } from './careers.controller';
import { CareersService } from './careers.service';
import { JobApplication } from './entities/job-application.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication]),
    UsersModule
  ],
  controllers: [CareersController],
  providers: [CareersService],
  exports: [CareersService],
})
export class CareersModule {} 