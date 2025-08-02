import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ServiceProvider } from '../../service-providers/entities/service-provider.entity';

export enum BookingStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  ONLINE = 'online',
  PENDING = 'pending'
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ServiceProvider, { onDelete: 'CASCADE' })
  serviceProvider: ServiceProvider;

  @Column()
  serviceProviderId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  customer: User;

  @Column()
  customerId: number;

  @Column()
  serviceType: string;

  @Column()
  serviceDate: string;

  @Column()
  serviceTime: string;

  @Column()
  duration: number;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING_APPROVAL
  })
  status: BookingStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.PENDING
  })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  billId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 