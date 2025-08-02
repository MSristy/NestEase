"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const service_provider_entity_1 = require("./entities/service-provider.entity");
const service_provider_controller_1 = require("./service-provider.controller");
const service_provider_service_1 = require("./service-provider.service");
const user_entity_1 = require("../users/entities/user.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const bookings_module_1 = require("../bookings/bookings.module");
const notification_service_1 = require("../users/notification.service");
const users_module_1 = require("../users/users.module");
const notification_entity_1 = require("../users/entities/notification.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let ServiceProviderModule = class ServiceProviderModule {
};
exports.ServiceProviderModule = ServiceProviderModule;
exports.ServiceProviderModule = ServiceProviderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([service_provider_entity_1.ServiceProvider, user_entity_1.User, booking_entity_1.Booking, notification_entity_1.Notification]),
            bookings_module_1.BookingsModule,
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [service_provider_controller_1.ServiceProviderController],
        providers: [service_provider_service_1.ServiceProviderService, notification_service_1.NotificationService],
        exports: [service_provider_service_1.ServiceProviderService]
    })
], ServiceProviderModule);
//# sourceMappingURL=service-provider.module.js.map