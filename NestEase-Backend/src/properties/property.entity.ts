import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PropertyBooking } from './property-booking.entity';
import { SaveAndSwap } from '../save-and-swap/entities/save-and-swap.entity';

export enum PropertyType {
  RENT = 'RENT',
  SALE = 'SALE',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  BOOKED = 'BOOKED',
  SOLD = 'SOLD',
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  yourName: string;

  @Column({ nullable: true })
  yourPhone: string;

  @Column({ nullable: true })
  yourEmail: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  squareFeet: number;

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.RENT
  })
  type: PropertyType; // 'RENT' or 'SALE'

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE
  })
  status: PropertyStatus; // 'AVAILABLE', 'BOOKED', 'SOLD'

  @Column('json', { nullable: true })
  amenities: string[];

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: false })
  bachelorFriendly: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  category: string; // e.g., 'villa', 'apartment', etc.

  @ManyToOne(() => User, user => user.properties)
  owner: User;

  @OneToMany(() => PropertyBooking, booking => booking.property)
  bookings: PropertyBooking[];

  @OneToMany(() => SaveAndSwap, saveAndSwap => saveAndSwap.property)
  saveAndSwaps: SaveAndSwap[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 