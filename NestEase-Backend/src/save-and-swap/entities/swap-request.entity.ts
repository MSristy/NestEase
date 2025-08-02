import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { SwapItem } from './swap-item.entity';

@Entity()
export class SwapRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.swapRequests)
  requester: User;

  @ManyToOne(() => SwapItem)
  requestedItem: SwapItem;

  @ManyToOne(() => SwapItem)
  offeredItem: SwapItem;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  })
  status: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 