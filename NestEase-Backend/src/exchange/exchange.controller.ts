import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Put, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExchangeService } from './exchange.service';
import { ExchangeProduct } from './entities/exchange-product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { Request } from 'express';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('add-exchange')
  async addExchangeProduct(@Body() exchangeData: Partial<ExchangeProduct>) {
    try {
      // Validate required fields
      const requiredFields = ['yourName', 'productName', 'category', 'itemCondition', 'location', 'description', 'images'] as const;
      const missingFields = requiredFields.filter(field => !exchangeData[field]);
      
      if (missingFields.length > 0) {
        throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate field lengths
      if (exchangeData.yourName && exchangeData.yourName.length > 255) {
        throw new BadRequestException('Name must be less than 255 characters');
      }
      if (exchangeData.yourPhone && exchangeData.yourPhone.length > 20) {
        throw new BadRequestException('Phone number must be less than 20 characters');
      }
      if (exchangeData.yourEmail && exchangeData.yourEmail.length > 255) {
        throw new BadRequestException('Email must be less than 255 characters');
      }
      if (exchangeData.productName && exchangeData.productName.length > 255) {
        throw new BadRequestException('Product name must be less than 255 characters');
      }
      if (exchangeData.category && exchangeData.category.length > 100) {
        throw new BadRequestException('Category must be less than 100 characters');
      }
      if (exchangeData.itemCondition && exchangeData.itemCondition.length > 20) {
        throw new BadRequestException('Item condition must be less than 20 characters');
      }
      if (exchangeData.location && exchangeData.location.length > 255) {
        throw new BadRequestException('Location must be less than 255 characters');
      }

      const result = await this.exchangeService.createExchangeProduct(exchangeData);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create exchange product: ' + (error as Error).message);
    }
  }

  @Get()
  async getAllExchangeProducts() {
    try {
      const products = await this.exchangeService.getAllExchangeProducts();
      return { success: true, data: products };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch exchange products: ' + (error as Error).message);
    }
  }

  @Get(':id')
  async getExchangeProductById(@Param('id') id: number) {
    try {
      const product = await this.exchangeService.getExchangeProductById(id);
      if (!product) {
        throw new BadRequestException('Exchange product not found');
      }
      return { success: true, data: product };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch exchange product: ' + (error as Error).message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:email')
  async getExchangeProductsByUserEmail(@Param('email') email: string) {
    try {
      const products = await this.exchangeService.getExchangeProductsByUserEmail(email);
      return { success: true, data: products };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch exchange products: ' + (error as Error).message);
    }
  }

  // Get pending exchange requests for approval
  @UseGuards(JwtAuthGuard)
  @Get('pending-requests')
  async getPendingRequests(@Req() req: Request) {
    try {
      const user = req.user as { id: number; email: string } | undefined;
      if (!user) {
        throw new BadRequestException('User not authenticated');
      }
      
      const requests = await this.exchangeService.getPendingRequestsForUser(user.email);
      return { success: true, data: requests };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch pending requests: ' + (error as Error).message);
    }
  }

  // Accept an exchange request
  @UseGuards(JwtAuthGuard)
  @Put(':id/accept')
  async acceptExchangeRequest(@Param('id') id: number, @Req() req: Request) {
    try {
      const user = req.user as { id: number; email: string } | undefined;
      if (!user) {
        throw new BadRequestException('User not authenticated');
      }
      
      const result = await this.exchangeService.acceptExchangeRequest(id, user.email);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to accept exchange request: ' + (error as Error).message);
    }
  }

  // Decline an exchange request
  @UseGuards(JwtAuthGuard)
  @Put(':id/decline')
  async declineExchangeRequest(@Param('id') id: number, @Req() req: Request) {
    try {
      const user = req.user as { id: number; email: string } | undefined;
      if (!user) {
        throw new BadRequestException('User not authenticated');
      }
      
      const result = await this.exchangeService.declineExchangeRequest(id, user.email);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to decline exchange request: ' + (error as Error).message);
    }
  }
} 