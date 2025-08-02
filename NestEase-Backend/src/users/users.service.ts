import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { Role } from './role.enum';

type UpdateableUserFields = Pick<User, 'name' | 'phone' | 'address'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
    @InjectRepository(ConnectedAccount)
    private connectedAccountsRepository: Repository<ConnectedAccount>,
    private authService: AuthService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } }) as Promise<User | undefined>;
  }

  async updateRole(email: string, role: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User | undefined> {
    console.log('findById called with ID:', id);
    const user = await this.usersRepository.findOne({ where: { id } });
    console.log('findById result:', user);
    return user || undefined;
  }

  async updateAvatar(userId: number, avatarUrl: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.avatar = avatarUrl;
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: number, updateData: Partial<UpdateableUserFields>): Promise<User> {
    console.log('=== updateProfile called ===');
    console.log('userId:', userId);
    console.log('updateData:', updateData);
    console.log('updateData type:', typeof updateData);
    console.log('updateData keys:', Object.keys(updateData));
    
    const user = await this.findById(userId);
    if (!user) {
      console.log('❌ User not found for ID:', userId);
      throw new NotFoundException('User not found');
    }

    console.log('✅ Found user before update:', {
      id: user.id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      email: user.email
    });

    // Only update allowed fields
    const allowedFields: (keyof UpdateableUserFields)[] = ['name', 'phone', 'address'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        console.log(`🔄 Updating field ${field} from "${user[field]}" to "${updateData[field]}"`);
        user[field] = updateData[field]!;
      } else {
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
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw error;
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
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

  async getNotifications(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      emailNotifications: user.emailNotifications,
      smsNotifications: user.smsNotifications,
    };
  }

  async updateNotifications(userId: number, body: { emailNotifications: boolean; smsNotifications: boolean }) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.emailNotifications = body.emailNotifications;
    user.smsNotifications = body.smsNotifications;
    await this.usersRepository.save(user);
    return { success: true, message: 'Notification preferences updated.' };
  }

  async getPrivacy(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      showProfile: user.showProfile,
    };
  }

  async updatePrivacy(userId: number, body: { showProfile: boolean }) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.showProfile = body.showProfile;
    await this.usersRepository.save(user);
    return { success: true, message: 'Privacy settings updated.' };
  }

  async deleteProfile(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.delete(userId);
    return { success: true, message: 'Account deleted successfully.' };
  }

  async getAddresses(userId: number): Promise<Address[]> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.addressesRepository.find({ where: { user: { id: userId } } });
  }

  async addAddress(userId: number, addressData: Partial<Address>): Promise<Address> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const address = this.addressesRepository.create({
      ...addressData,
      user,
    });

    return this.addressesRepository.save(address);
  }

  async deleteAddress(userId: number, addressId: number): Promise<void> {
    const address = await this.addressesRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressesRepository.remove(address);
  }

  async getConnectedAccounts(userId: number): Promise<ConnectedAccount[]> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.connectedAccountsRepository.find({ where: { user: { id: userId } } });
  }

  async connectAccount(userId: number, accountData: Partial<ConnectedAccount>): Promise<ConnectedAccount> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const account = this.connectedAccountsRepository.create({
      ...accountData,
      user,
    });

    return this.connectedAccountsRepository.save(account);
  }

  async disconnectAccount(userId: number, accountId: number): Promise<void> {
    const account = await this.connectedAccountsRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });
    if (!account) throw new NotFoundException('Connected account not found');
    await this.connectedAccountsRepository.remove(account);
  }

  async getCustomization(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user.customization || {};
  }

  async updateCustomization(userId: number, customization: any) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.customization = { ...user.customization, ...customization };
    await this.usersRepository.save(user);
    return user.customization;
  }

  async switchRole(userId: number, newRole: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate the new role
    const validRoles = Object.values(Role);

    // Only admins can assign admin role
    if (newRole === 'admin') {
      throw new BadRequestException('Admin role can only be assigned by existing admins');
    }

    if (!validRoles.includes(newRole as Role)) {
      throw new BadRequestException('Invalid role specified');
    }

    // Update the user's role
    user.role = newRole as Role;
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
}