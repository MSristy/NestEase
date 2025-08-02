import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  /**
   * Get personalized property recommendations for the authenticated user
   */
  @Get('properties')
  @UseGuards(JwtAuthGuard)
  async getPropertyRecommendations(
    @Req() req: Request,
    @Query('limit') limit?: string,
  ) {
    try {
      const user = req.user as { id: number } | undefined;
      if (!user) throw new Error('Unauthorized');

      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const recommendations = await this.recommendationsService.getPropertyRecommendations(user.id, limitNumber);
      
      console.log(`Generated ${recommendations.length} recommendations for user ${user.id}`);
      return recommendations;
    } catch (error) {
      console.error('Error in getPropertyRecommendations:', error);
      return [];
    }
  }

  /**
   * Get trending properties (most popular recently)
   */
  @Get('trending')
  async getTrendingProperties(@Query('limit') limit?: string) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const trending = await this.recommendationsService.getTrendingProperties(limitNumber);
      
      console.log(`Found ${trending.length} trending properties`);
      return trending;
    } catch (error) {
      console.error('Error in getTrendingProperties:', error);
      return [];
    }
  }

  /**
   * Get similar properties to a specific property
   */
  @Get('similar/:propertyId')
  async getSimilarProperties(
    @Param('propertyId') propertyId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 5;
      const similar = await this.recommendationsService.getSimilarProperties(propertyId, limitNumber);
      
      console.log(`Found ${similar.length} similar properties for ${propertyId}`);
      return similar;
    } catch (error) {
      console.error('Error in getSimilarProperties:', error);
      return [];
    }
  }

  /**
   * Get recommendations for new users (based on popular properties)
   */
  @Get('new-user')
  async getNewUserRecommendations(@Query('limit') limit?: string) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      // For new users, return trending properties
      const recommendations = await this.recommendationsService.getTrendingProperties(limitNumber);
      
      console.log(`Generated ${recommendations.length} recommendations for new user`);
      return recommendations;
    } catch (error) {
      console.error('Error in getNewUserRecommendations:', error);
      return [];
    }
  }

  /**
   * Test endpoint to verify recommendations system is working
   */
  @Get('test')
  async testRecommendations() {
    try {
      // Test trending properties
      const trending = await this.recommendationsService.getTrendingProperties(3);
      
      return {
        status: 'success',
        message: 'Recommendations system is working',
        trendingCount: trending.length,
        sample: trending.slice(0, 1).map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          type: p.type,
        })),
      };
    } catch (error) {
      console.error('Test endpoint error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        trendingCount: 0,
        sample: [],
      };
    }
  }
} 