import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CareersService } from './careers.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { ApplicationStatus } from './entities/job-application.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  // Public endpoints
  @Post('apply')
  create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return this.careersService.create(createJobApplicationDto);
  }

  // Test endpoint to check permissions
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('test-admin')
  testAdmin(@Request() req: any) {
    return {
      user: req.user,
      role: req.user?.role,
      message: 'Admin test endpoint for careers'
    };
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('applications')
  findAll() {
    return this.careersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('applications/:id')
  findOne(@Param('id') id: string) {
    return this.careersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('applications/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus; adminNotes?: string; rejectionReason?: string }
  ) {
    return this.careersService.updateStatus(+id, body.status, body.adminNotes, body.rejectionReason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('applications/:id')
  remove(@Param('id') id: string) {
    return this.careersService.delete(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('stats')
  getStats() {
    return this.careersService.getStats();
  }
} 