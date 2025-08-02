import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('public')
export class PublicStatsController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getPublicStats() {
    return this.adminService.getPublicStats();
  }
} 