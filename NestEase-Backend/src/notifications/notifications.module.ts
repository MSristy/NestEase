import { forwardRef, Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsGateway],
})
export class NotificationsModule {} 