import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Address } from './entities/address.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, ConnectedAccount, Notification]),
    forwardRef(() => NotificationsModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, NotificationService, AuthService],
  controllers: [UsersController],
  exports: [UsersService, NotificationService],
})
export class UsersModule {}