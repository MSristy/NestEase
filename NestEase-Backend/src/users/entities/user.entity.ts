import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Property } from '../../properties/property.entity';
import { ServiceProvider } from '../../service-providers/entities/service-provider.entity';
import { SaveAndSwap } from '../../save-and-swap/entities/save-and-swap.entity';
import { Address } from './address.entity';
import { ConnectedAccount } from './connected-account.entity';
import { Notification } from './notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: false })
  smsNotifications: boolean;

  @Column({ default: true })
  showProfile: boolean;

  @Column({ type: 'json', nullable: true })
  customization: {
    accentColor?: string;
    fontSize?: string;
    language?: string;
  };

  @OneToMany(() => Property, property => property.owner)
  properties: Property[];

  @OneToMany(() => ServiceProvider, serviceProvider => serviceProvider.owner)
  serviceProviders: ServiceProvider[];

  @OneToMany(() => SaveAndSwap, saveAndSwap => saveAndSwap.user)
  saveAndSwaps: SaveAndSwap[];

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @OneToMany(() => ConnectedAccount, connectedAccount => connectedAccount.user)
  connectedAccounts: ConnectedAccount[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];
} 