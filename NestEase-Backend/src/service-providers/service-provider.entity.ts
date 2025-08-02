import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ServiceBooking } from './entities/service-booking.entity';

@Entity('service_providers')
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.serviceProvider)
  user: User;

  @OneToMany(() => ServiceBooking, booking => booking.serviceProvider)
  bookings: ServiceBooking[];

  @Column()
  businessName: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column('simple-array')
  services: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: number; // in minutes

  @Column()
  location: string;

  @Column()
  contactNumber: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column('simple-array', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 