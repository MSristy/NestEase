import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { NotificationService } from '../users/notification.service';
import { NotificationType } from '../users/entities/notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyNotifications(@Req() req: any) {
    return await this.notificationService.getUserNotifications(req.user.id);
  }

  // Temporary endpoint to emit a sample notification to the current user for testing real-time flow
  @UseGuards(JwtAuthGuard)
  @Post('test')
  async testNotification(@Req() req: any) {
    const userId = req.user.id;
    const title = 'Test Notification';
    const message = 'This is a test notification sent to you.';
    const notification = await this.notificationService.createNotification(userId, NotificationType.SYSTEM, title, message, {}, false);
    return { success: true, notification };
  }
} 