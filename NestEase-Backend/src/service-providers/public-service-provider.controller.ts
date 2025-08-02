import { Controller, Get, Param } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';

@Controller('public/service-providers')
export class PublicServiceProviderController {
  constructor(private readonly serviceProviderService: ServiceProviderService) {}

  @Get()
  findAll() {
    return this.serviceProviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProviderService.findOne(parseInt(id));
  }
} 