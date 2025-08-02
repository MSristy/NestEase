import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { ServiceProvider } from '../service-provider.entity';

@Entity()
export class ServiceBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  customer: User;

  @ManyToOne(() => ServiceProvider, serviceProvider => serviceProvider.bookings)
  serviceProvider: ServiceProvider;

  @Column()
  serviceDate: Date;

  @Column()
  serviceTime: string;

  @Column('simple-array')
  requestedServices: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalCost: number;

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

  @Column({ type: 'boolean', default: true })
  isRefundable: boolean;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 