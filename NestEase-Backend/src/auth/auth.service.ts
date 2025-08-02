import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: { email: string; password: string; name: string; role?: string }) {
    const { email, password, name, role } = signupDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with specified role or default to USER
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || Role.USER, // Use provided role or default to USER from enum
    });

    await this.usersRepository.save(user);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async createAdmin(adminDto: { email: string; password: string; name: string }) {
    const { email, password, name } = adminDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      // If user exists but is not an admin, update their role
      if (existingUser.role !== Role.ADMIN) {
        existingUser.role = Role.ADMIN;
        await this.usersRepository.save(existingUser);
        return {
          access_token: this.jwtService.sign({ email: existingUser.email, sub: existingUser.id, role: existingUser.role }),
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
          },
        };
      }
      throw new UnauthorizedException('Admin user already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: Role.ADMIN,
    });

    await this.usersRepository.save(admin);

    // Generate JWT token
    const payload = { email: admin.email, sub: admin.id, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  signJwt(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}