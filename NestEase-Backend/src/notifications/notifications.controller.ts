import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from '../users/notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyNotifications(@Req() req: any) {
    return await this.notificationService.getUserNotifications(req.user.id);
  }
} 