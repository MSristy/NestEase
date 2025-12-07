import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, Inject } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    // Prefer token based auth for socket handshake
    const token = (client.handshake.auth && client.handshake.auth.token) || client.handshake.query?.token;
    if (!token) {
      client.disconnect();
      console.log('Socket connection rejected: missing token');
      return;
    }

    try {
      const payload: any = this.jwtService.verify(token);
      const userId = payload?.sub || payload?.id || payload?.userId;
      if (!userId) {
        client.disconnect();
        return;
      }
      client.data.userId = userId.toString();
      client.join(userId.toString());
      console.log(`User ${userId} connected to notifications via token`);
    } catch (err) {
      client.disconnect();
      console.log('Socket connection rejected: invalid token');
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId as string;
    if (userId) {
      console.log(`User ${userId} disconnected from notifications`);
    } else {
      console.log(`Client disconnected from notifications: ${client.id}`);
    }
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
    console.log(`Emitting notification to user ${userId}`, notification);
  }
} 