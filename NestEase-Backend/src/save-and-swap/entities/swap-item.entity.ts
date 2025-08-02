import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { SwapRequest } from './swap-request.entity';

@Entity('swap_items')
export class SwapItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.swapItems)
  owner: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  estimatedValue: number;

  @Column()
  condition: string;

  @Column('simple-array')
  preferredSwapCategories: string[];

  @Column('text', { nullable: true })
  additionalNotes: string;

  @Column({
    type: 'enum',
    enum: ['AVAILABLE', 'PENDING', 'SWAPPED', 'INACTIVE'],
    default: 'AVAILABLE'
  })
  status: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => SwapRequest, request => request.offeredItem)
  offeredSwapRequests: SwapRequest[];

  @OneToMany(() => SwapRequest, request => request.requestedItem)
  receivedSwapRequests: SwapRequest[];

  @Column()
  location: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 