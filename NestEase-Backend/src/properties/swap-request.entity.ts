import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Property } from './property.entity';

@Entity()
export class SwapRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.swapRequests)
  requester: User;

  @ManyToOne(() => Property)
  requestedProperty: Property;

  @ManyToOne(() => Property)
  offeredProperty: Property;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  })
  status: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 