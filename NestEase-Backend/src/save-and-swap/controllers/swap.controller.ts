import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SwapService } from '../services/swap.service';
import { CreateSwapItemDto } from '../dto/create-swap-item.dto';
import { CreateSwapRequestDto } from '../dto/create-swap-request.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/role.enum';
import { Request } from 'express';

@Controller('swap')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Post('items')
  @Roles(Role.USER)
  createSwapItem(@Body() createDto: CreateSwapItemDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.swapService.createSwapItem(createDto, userId);
  }

  @Get('items')
  findAllSwapItems() {
    return this.swapService.findAllSwapItems();
  }

  @Get('items/:id')
  findOneSwapItem(@Param('id') id: string) {
    return this.swapService.findOneSwapItem(id);
  }

  @Post('requests')
  @Roles(Role.USER)
  createSwapRequest(@Body() createDto: CreateSwapRequestDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.swapService.createSwapRequest(createDto, userId);
  }

  @Patch('requests/:id/accept')
  @Roles(Role.USER)
  acceptSwapRequest(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.swapService.acceptSwapRequest(id, userId);
  }

  @Patch('requests/:id/reject')
  @Roles(Role.USER)
  rejectSwapRequest(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.swapService.rejectSwapRequest(id, userId);
  }

  @Get('requests')
  @Roles(Role.USER)
  findAllSwapRequests(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.swapService.findAllSwapRequests(userId);
  }

  @Patch('requests/:id/complete')
  @Roles(Role.USER)
  completeSwap(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.swapService.completeSwap(id, userId);
  }
} 