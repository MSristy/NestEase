import { Controller, Post, Get, UseInterceptors, UploadedFile, Body, BadRequestException, Query, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AddSwapService } from './add-swap.service';
import { AddSwap } from './entities/add-swap.entity';

interface CreateSwapResponse {
  success: boolean;
  data: AddSwap;
}

@Controller('add-swap')
export class AddSwapController {
  constructor(private readonly addSwapService: AddSwapService) {}

  @Get()
  async getSwapItems(@Query('category') category?: string) {
    return this.addSwapService.getSwapItems(category);
  }

  @Get('user/:email')
  async getSwapItemsByUser(@Param('email') email: string) {
    return this.addSwapService.getSwapItemsByUser(email);
  }

  @Get(':id')
  async getSwapItem(@Param('id') id: string) {
    return this.addSwapService.getSwapItem(parseInt(id));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/swaps',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createSwapItem(
    @UploadedFile() file: Express.Multer.File,
    @Body() formData: any,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    // Create the full image URL
    const imageUrl = `/uploads/swaps/${file.filename}`;

    // Add the image URL to the form data
    const swapData = {
      ...formData,
      images: imageUrl,
    };

    return this.addSwapService.createSwapItem(swapData);
  }

  @Post()
  async create(@Body() formData: any): Promise<CreateSwapResponse> {
    try {
      // Validate required fields
      const requiredFields = [
        'owner_name',
        'owner_phone',
        'owner_email',
        'product_name',
        'category',
        'item_condition',
        'location',
        'description',
        'images'
      ];
      
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new BadRequestException(`Missing required field: ${field}`);
        }
      }

      return await this.addSwapService.createSwapItem(formData);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create swap item');
    }
  }
} 