import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ServiceProvider } from './service-provider.entity';

@Entity()
export class ServiceBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceProvider, provider => provider.bookings)
  serviceProvider: ServiceProvider;

  @ManyToOne(() => User, user => user.serviceBookings)
  customer: User;

  @Column()
  serviceDate: Date;

  @Column()
  serviceTime: string;

  @Column('simple-array')
  requestedServices: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
    default: 'PENDING'
  })
  paymentStatus: string;

  @Column({ nullable: true })
  paymentIntentId: string;

  @Column({ type: 'json', nullable: true })
  paymentDetails: any;

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ type: 'boolean', default: false })
  isRefundable: boolean;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 