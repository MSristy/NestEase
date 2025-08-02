import { Controller, Get, Post, Body, Param, Put, Req, UseGuards, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as bcrypt from 'bcrypt';
import { NotificationService } from './notification.service';

interface MulterRequest {
  file: Express.Multer.File;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService
  ) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user as User);
  }

  @Put(':email/role')
  updateRole(
    @Param('email') email: string,
    @Body('role') role: string,
  ): Promise<User> {
    return this.usersService.updateRole(email, role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: any }) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request & { user: { id: number } },
    @Body() updateData: Partial<User>
  ): Promise<User> {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { id: number } }
  ): Promise<User> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const avatarUrl = `http://localhost:3001/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(req.user.id, avatarUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      return { message: 'Old password and new password are required.' };
    }
    return this.usersService.changePassword(req.user.id, oldPassword, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.getNotifications(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications')
  async updateNotifications(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { emailNotifications: boolean; smsNotifications: boolean }
  ) {
    return this.usersService.updateNotifications(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-notifications')
  async getUserNotifications(@Req() req: Request & { user: { id: number } }) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications/:id/read')
  async markNotificationAsRead(
    @Req() req: Request & { user: { id: number } },
    @Param('id') id: string
  ) {
    await this.notificationService.markAsRead(parseInt(id), req.user.id);
    return { success: true, message: 'Notification marked as read' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications/read-all')
  async markAllNotificationsAsRead(@Req() req: Request & { user: { id: number } }) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { success: true, message: 'All notifications marked as read' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notifications/:id')
  async deleteNotification(
    @Req() req: Request & { user: { id: number } },
    @Param('id') id: string
  ) {
    await this.notificationService.deleteNotification(parseInt(id), req.user.id);
    return { success: true, message: 'Notification deleted' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('privacy')
  async getPrivacy(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.getPrivacy(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('privacy')
  async updatePrivacy(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { showProfile: boolean }
  ) {
    return this.usersService.updatePrivacy(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.deleteProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  async getAddresses(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.getAddresses(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  async addAddress(
    @Req() req: Request & { user: { id: number } },
    @Body() address: any
  ) {
    return this.usersService.addAddress(req.user.id, address);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  async deleteAddress(
    @Req() req: Request & { user: { id: number } },
    @Param('id') id: string
  ) {
    return this.usersService.deleteAddress(req.user.id, parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('connected-accounts')
  async getConnectedAccounts(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.getConnectedAccounts(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('connected-accounts')
  async connectAccount(
    @Req() req: Request & { user: { id: number } },
    @Body() account: any
  ) {
    return this.usersService.connectAccount(req.user.id, account);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('connected-accounts/:id')
  async disconnectAccount(
    @Req() req: Request & { user: { id: number } },
    @Param('id') id: string
  ) {
    return this.usersService.disconnectAccount(req.user.id, parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('customization')
  async getCustomization(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.getCustomization(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('customization')
  async updateCustomization(
    @Req() req: Request & { user: { id: number } },
    @Body() customization: any
  ) {
    return this.usersService.updateCustomization(req.user.id, customization);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async getCurrentUser(@Req() req: Request & { user: { id: number } }) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-role')
  checkRole(@Req() req: Request & { user: any }) {
    return {
      user: req.user,
      role: req.user?.role,
      isAdmin: req.user?.role === 'admin',
      message: 'Role check endpoint'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-roles')
  getAvailableRoles(@Req() req: Request & { user: any }) {
    // Get all available roles except admin (admin can only be assigned by other admins)
    const availableRoles = [
      { value: 'user', label: 'User', description: 'Basic user with limited access' },
      { value: 'service_provider', label: 'Service Provider', description: 'Can provide home services' },
      { value: 'property_owner', label: 'Property Owner', description: 'Can list and manage properties' },
      { value: 'tenant', label: 'Tenant', description: 'Can rent properties' },
      { value: 'landlord', label: 'Landlord', description: 'Can manage rental properties' },
      { value: 'buyer', label: 'Buyer', description: 'Can purchase properties' },
      { value: 'seller', label: 'Seller', description: 'Can sell properties and items' }
    ];

    // If user is admin, they can also assign admin role
    if (req.user?.role === 'admin') {
      availableRoles.push({
        value: 'admin',
        label: 'Admin',
        description: 'System administrator with full access'
      });
    }

    return availableRoles;
  }

  @UseGuards(JwtAuthGuard)
  @Put('switch-role')
  async switchRole(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { newRole: string }
  ) {
    return this.usersService.switchRole(req.user.id, body.newRole);
  }

  // Temporary endpoint to make current user admin (remove after use)
  @UseGuards(JwtAuthGuard)
  @Put('make-admin')
  async makeAdmin(@Req() req: Request & { user: any }) {
    return this.usersService.updateRole(req.user.email, 'admin');
  }

  @UseGuards(JwtAuthGuard)
  @Get('test-db')
  async testDatabase(@Req() req: Request & { user: { id: number } }) {
    try {
      const user = await this.usersService.findById(req.user.id);
      console.log('Test DB - Found user:', user);
      return {
        success: true,
        user: user,
        message: 'Database connection working'
      };
    } catch (error) {
      console.error('Test DB - Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database connection failed'
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('debug-jwt')
  getJwtPayload(@Req() req: Request & { user: any }) {
    return { user: req.user };
  }
}