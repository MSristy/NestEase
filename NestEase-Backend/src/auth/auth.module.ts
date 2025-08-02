import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key', // In production, use environment variable
      signOptions: { expiresIn: '1d' },
    }),
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, NotificationsGateway],
  exports: [AuthService, JwtStrategy, RolesGuard, NotificationsGateway, JwtModule],
})
export class AuthModule {}