import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SaveAndSwapService } from './save-and-swap.service';
import { SaveAndSwap } from './entities/save-and-swap.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('save-and-swap')
@UseGuards(JwtAuthGuard)
export class SaveAndSwapController {
  constructor(private readonly saveAndSwapService: SaveAndSwapService) {}

  @Post()
  create(@Body() createSaveAndSwapDto: Partial<SaveAndSwap>) {
    return this.saveAndSwapService.create(createSaveAndSwapDto);
  }

  @Get()
  findAll() {
    return this.saveAndSwapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saveAndSwapService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaveAndSwapDto: Partial<SaveAndSwap>) {
    return this.saveAndSwapService.update(+id, updateSaveAndSwapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saveAndSwapService.remove(+id);
  }

  @Post(':id/complete')
  completeSaveAndSwap(@Param('id') id: string) {
    return this.saveAndSwapService.completeSaveAndSwap(+id);
  }

  @Get('user/:userId')
  getSaveAndSwapsByUser(@Param('userId') userId: string) {
    return this.saveAndSwapService.getSaveAndSwapsByUser(+userId);
  }

  @Get('property/:propertyId')
  getSaveAndSwapsByProperty(@Param('propertyId') propertyId: string) {
    return this.saveAndSwapService.getSaveAndSwapsByProperty(propertyId);
  }
} 