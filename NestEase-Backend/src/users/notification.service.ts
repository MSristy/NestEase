import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from './entities/user.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ApplinkService } from '../applink/applink.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsGateway: NotificationsGateway,
    private applinkService: ApplinkService,
  ) {}

  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: any,
    sendSMS: boolean = false
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      metadata,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    
    // Send real-time notification via WebSocket
    this.notificationsGateway.sendNotification(userId.toString(), {
      id: savedNotification.id,
      type: savedNotification.type,
      title: savedNotification.title,
      message: savedNotification.message,
      isRead: savedNotification.isRead,
      createdAt: savedNotification.createdAt,
      metadata: savedNotification.metadata,
    });

    // Send SMS notification if requested and user has SMS enabled
    if (sendSMS) {
      await this.sendSMSNotification(userId, message);
    }

    return savedNotification;
  }

  /**
   * Send SMS notification to user
   * @param userId - User ID
   * @param message - SMS message
   */
  private async sendSMSNotification(userId: number, message: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      if (!user || !user.phone || !user.smsNotifications) {
        return; // Skip if user doesn't have phone or SMS disabled
      }

      if (!this.applinkService.isConfigured()) {
        this.logger.warn('Applink SMS service is not configured. Skipping SMS notification.');
        return;
      }

      // Send SMS via Applink
      await this.applinkService.sendSMS(user.phone, message);
      this.logger.log(`SMS notification sent to user ${userId} at ${user.phone}`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      this.logger.error(`Failed to send SMS notification to user ${userId}: ${errorMessage}`);
      // Don't throw error - SMS failure shouldn't break the notification flow
    }
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number, userId: number): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true }
    );
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId },
      { isRead: true }
    );
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    await this.notificationRepository.delete({ id: notificationId, userId });
  }

  async createInterviewNotification(
    userId: number,
    position: string,
    department: string,
    interviewDate: string,
    interviewTime: string,
    interviewLocation: string,
    interviewType: string,
    adminNotes?: string
  ): Promise<Notification> {
    const title = `Interview Scheduled - ${position}`;
    const message = `You have been scheduled for an interview for the ${position} position in ${department}. Please review the details below.`;
    
    const metadata = {
      interviewDate,
      interviewTime,
      interviewLocation,
      interviewType,
      position,
      department,
      adminNotes,
    };

    return await this.createNotification(
      userId,
      NotificationType.INTERVIEW,
      title,
      message,
      metadata
    );
  }
} 