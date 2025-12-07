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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationsGateway = class NotificationsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        var _a;
        // Prefer token based auth for socket handshake
        const token = (client.handshake.auth && client.handshake.auth.token) || ((_a = client.handshake.query) === null || _a === void 0 ? void 0 : _a.token);
        if (!token) {
            client.disconnect();
            console.log('Socket connection rejected: missing token');
            return;
        }
        try {
            const payload = this.jwtService.verify(token);
            const userId = (payload === null || payload === void 0 ? void 0 : payload.sub) || (payload === null || payload === void 0 ? void 0 : payload.id) || (payload === null || payload === void 0 ? void 0 : payload.userId);
            if (!userId) {
                client.disconnect();
                return;
            }
            client.data.userId = userId.toString();
            client.join(userId.toString());
            console.log(`User ${userId} connected to notifications via token`);
        }
        catch (err) {
            client.disconnect();
            console.log('Socket connection rejected: invalid token');
        }
    }
    handleDisconnect(client) {
        var _a;
        const userId = (_a = client.data) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) {
            console.log(`User ${userId} disconnected from notifications`);
        }
        else {
            console.log(`Client disconnected from notifications: ${client.id}`);
        }
    }
    sendNotification(userId, notification) {
        this.server.to(userId).emit('notification', notification);
        console.log(`Emitting notification to user ${userId}`, notification);
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map