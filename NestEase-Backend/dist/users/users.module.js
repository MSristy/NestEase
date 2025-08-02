"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const address_entity_1 = require("./entities/address.entity");
const connected_account_entity_1 = require("./entities/connected-account.entity");
const notification_entity_1 = require("./entities/notification.entity");
const notification_service_1 = require("./notification.service");
const notifications_module_1 = require("../notifications/notifications.module");
const auth_service_1 = require("../auth/auth.service");
const auth_module_1 = require("../auth/auth.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, address_entity_1.Address, connected_account_entity_1.ConnectedAccount, notification_entity_1.Notification]),
            (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        providers: [users_service_1.UsersService, notification_service_1.NotificationService, auth_service_1.AuthService],
        controllers: [users_controller_1.UsersController],
        exports: [users_service_1.UsersService, notification_service_1.NotificationService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map