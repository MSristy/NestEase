import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from './entities/user.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: any
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

    return savedNotification;
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