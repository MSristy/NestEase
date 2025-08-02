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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const address_entity_1 = require("./entities/address.entity");
const connected_account_entity_1 = require("./entities/connected-account.entity");
const bcrypt = __importStar(require("bcrypt"));
const auth_service_1 = require("../auth/auth.service");
const role_enum_1 = require("./role.enum");
let UsersService = class UsersService {
    constructor(usersRepository, addressesRepository, connectedAccountsRepository, authService) {
        this.usersRepository = usersRepository;
        this.addressesRepository = addressesRepository;
        this.connectedAccountsRepository = connectedAccountsRepository;
        this.authService = authService;
    }
    findAll() {
        return this.usersRepository.find();
    }
    create(user) {
        return this.usersRepository.save(user);
    }
    findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async updateRole(email, role) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.role = role;
        return this.usersRepository.save(user);
    }
    async findById(id) {
        console.log('findById called with ID:', id);
        const user = await this.usersRepository.findOne({ where: { id } });
        console.log('findById result:', user);
        return user || undefined;
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.avatar = avatarUrl;
        return this.usersRepository.save(user);
    }
    async updateProfile(userId, updateData) {
        console.log('=== updateProfile called ===');
        console.log('userId:', userId);
        console.log('updateData:', updateData);
        console.log('updateData type:', typeof updateData);
        console.log('updateData keys:', Object.keys(updateData));
        const user = await this.findById(userId);
        if (!user) {
            console.log('❌ User not found for ID:', userId);
            throw new common_1.NotFoundException('User not found');
        }
        console.log('✅ Found user before update:', {
            id: user.id,
            name: user.name,
            phone: user.phone,
            address: user.address,
            email: user.email
        });
        // Only update allowed fields
        const allowedFields = ['name', 'phone', 'address'];
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                console.log(`🔄 Updating field ${field} from "${user[field]}" to "${updateData[field]}"`);
                user[field] = updateData[field];
            }
            else {
                console.log(`⏭️ Skipping field ${field} - not provided in updateData`);
            }
        });
        console.log('✅ User after update:', {
            id: user.id,
            name: user.name,
            phone: user.phone,
            address: user.address,
            email: user.email
        });
        try {
            const savedUser = await this.usersRepository.save(user);
            console.log('✅ Saved user successfully:', {
                id: savedUser.id,
                name: savedUser.name,
                phone: savedUser.phone,
                address: savedUser.address,
                email: savedUser.email
            });
            return savedUser;
        }
        catch (error) {
            console.error('❌ Error saving user:', error);
            throw error;
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        // Check old password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return { success: false, message: 'Old password is incorrect.' };
        }
        // Hash new password
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await this.usersRepository.save(user);
        return { success: true, message: 'Password changed successfully.' };
    }
    async getNotifications(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            emailNotifications: user.emailNotifications,
            smsNotifications: user.smsNotifications,
        };
    }
    async updateNotifications(userId, body) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.emailNotifications = body.emailNotifications;
        user.smsNotifications = body.smsNotifications;
        await this.usersRepository.save(user);
        return { success: true, message: 'Notification preferences updated.' };
    }
    async getPrivacy(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            showProfile: user.showProfile,
        };
    }
    async updatePrivacy(userId, body) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.showProfile = body.showProfile;
        await this.usersRepository.save(user);
        return { success: true, message: 'Privacy settings updated.' };
    }
    async deleteProfile(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.usersRepository.delete(userId);
        return { success: true, message: 'Account deleted successfully.' };
    }
    async getAddresses(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.addressesRepository.find({ where: { user: { id: userId } } });
    }
    async addAddress(userId, addressData) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const address = this.addressesRepository.create(Object.assign(Object.assign({}, addressData), { user }));
        return this.addressesRepository.save(address);
    }
    async deleteAddress(userId, addressId) {
        const address = await this.addressesRepository.findOne({
            where: { id: addressId, user: { id: userId } },
        });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        await this.addressesRepository.remove(address);
    }
    async getConnectedAccounts(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.connectedAccountsRepository.find({ where: { user: { id: userId } } });
    }
    async connectAccount(userId, accountData) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const account = this.connectedAccountsRepository.create(Object.assign(Object.assign({}, accountData), { user }));
        return this.connectedAccountsRepository.save(account);
    }
    async disconnectAccount(userId, accountId) {
        const account = await this.connectedAccountsRepository.findOne({
            where: { id: accountId, user: { id: userId } },
        });
        if (!account)
            throw new common_1.NotFoundException('Connected account not found');
        await this.connectedAccountsRepository.remove(account);
    }
    async getCustomization(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user.customization || {};
    }
    async updateCustomization(userId, customization) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.customization = Object.assign(Object.assign({}, user.customization), customization);
        await this.usersRepository.save(user);
        return user.customization;
    }
    async switchRole(userId, newRole) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        // Validate the new role
        const validRoles = Object.values(role_enum_1.Role);
        // Only admins can assign admin role
        if (newRole === 'admin') {
            throw new common_1.BadRequestException('Admin role can only be assigned by existing admins');
        }
        if (!validRoles.includes(newRole)) {
            throw new common_1.BadRequestException('Invalid role specified');
        }
        // Update the user's role
        user.role = newRole;
        const updatedUser = await this.usersRepository.save(user);
        // Generate new JWT
        const token = this.authService.signJwt(updatedUser);
        console.log(`User ${user.email} role changed from ${user.role} to ${newRole}`);
        return {
            success: true,
            message: `Role successfully changed to ${newRole}`,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            },
            token,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(2, (0, typeorm_1.InjectRepository)(connected_account_entity_1.ConnectedAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map