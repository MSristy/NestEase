import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(userId);
      console.log(`User ${userId} connected to notifications`);
    }
  }

  handleDisconnect(client: Socket) {
    // Optionally handle disconnect logic
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
  }
} 