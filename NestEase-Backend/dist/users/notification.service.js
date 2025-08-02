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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("./entities/user.entity");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let NotificationService = class NotificationService {
    constructor(notificationRepository, userRepository, notificationsGateway) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async createNotification(userId, type, title, message, metadata) {
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
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], NotificationService);
//# sourceMappingURL=notification.service.js.map