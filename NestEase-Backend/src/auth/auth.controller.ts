import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: { email: string; password: string; name: string; role?: string }) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('create-admin')
  createAdmin(@Body() adminDto: { email: string; password: string; name: string }) {
    return this.authService.createAdmin(adminDto);
  }
}