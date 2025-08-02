import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Property } from '../property.entity';

@Entity()
export class PropertyPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property)
  property: Property;

  @ManyToOne(() => User)
  buyer: User;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
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
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 