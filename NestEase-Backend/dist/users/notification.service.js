"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("./entities/user.entity");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const applink_service_1 = require("../applink/applink.service");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(notificationRepository, userRepository, notificationsGateway, applinkService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationsGateway = notificationsGateway;
        this.applinkService = applinkService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async createNotification(userId, type, title, message, metadata, sendSMS = false) {
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
    async sendSMSNotification(userId, message) {
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
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
            this.logger.error(`Failed to send SMS notification to user ${userId}: ${errorMessage}`);
            // Don't throw error - SMS failure shouldn't break the notification flow
        }
    }
    async getUserNotifications(userId) {
        return await this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async markAsRead(notificationId, userId) {
        await this.notificationRepository.update({ id: notificationId, userId }, { isRead: true });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId }, { isRead: true });
    }
    async deleteNotification(notificationId, userId) {
        await this.notificationRepository.delete({ id: notificationId, userId });
    }
    async createInterviewNotification(userId, position, department, interviewDate, interviewTime, interviewLocation, interviewType, adminNotes) {
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
        return await this.createNotification(userId, notification_entity_1.NotificationType.INTERVIEW, title, message, metadata);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway,
        applink_service_1.ApplinkService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map