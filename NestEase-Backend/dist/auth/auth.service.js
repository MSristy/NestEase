"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const role_enum_1 = require("../users/role.enum");
const bcrypt = __importStar(require("bcrypt"));
const applink_service_1 = require("../applink/applink.service");
const notification_service_1 = require("../users/notification.service");
const notification_entity_1 = require("../users/entities/notification.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersRepository, jwtService, applinkService, notificationService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.applinkService = applinkService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signup(signupDto) {
        const { email, password, name, role } = signupDto;
        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user with specified role or default to USER
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            name,
            role: role || role_enum_1.Role.USER, // Use provided role or default to USER from enum
        });
        await this.usersRepository.save(user);
        // Send welcome SMS if phone number is provided and SMS is enabled
        if (user.phone && user.smsNotifications && this.applinkService.isConfigured()) {
            try {
                const welcomeMessage = `Welcome to NestEase, ${user.name}! Your account has been created successfully. Start exploring properties, services, and swaps now!`;
                await this.applinkService.sendSMS(user.phone, welcomeMessage);
                this.logger.log(`Welcome SMS sent to ${user.email}`);
            }
            catch (error) {
                const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
                this.logger.error(`Failed to send welcome SMS: ${errorMessage}`);
                // Don't fail registration if SMS fails
            }
        }
        // Generate JWT token
        const payload = { email: user.email, sub: user.id, role: user.role };
        // Create an in-app welcome notification
        try {
            await this.notificationService.createNotification(user.id, notification_entity_1.NotificationType.SYSTEM, 'Welcome to NestEase', `Hi ${user.name}, welcome to NestEase!`);
        }
        catch (err) {
            this.logger.warn('Failed to create welcome notification: ' + ((err === null || err === void 0 ? void 0 : err.message) || err));
            // Don't fail signup if notification fails
        }
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
    async login(loginDto) {
        const { email, password } = loginDto;
        // Find user
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async createAdmin(adminDto) {
        const { email, password, name } = adminDto;
        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            // If user exists but is not an admin, update their role
            if (existingUser.role !== role_enum_1.Role.ADMIN) {
                existingUser.role = role_enum_1.Role.ADMIN;
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
            throw new common_1.UnauthorizedException('Admin user already exists with this email');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create admin user
        const admin = this.usersRepository.create({
            email,
            password: hashedPassword,
            name,
            role: role_enum_1.Role.ADMIN,
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
    signJwt(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        applink_service_1.ApplinkService,
        notification_service_1.NotificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map