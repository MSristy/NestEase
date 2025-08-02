import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/property.entity';

@Entity()
export class SaveAndSwap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  type: string; // 'SAVE' or 'SWAP'

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => User, user => user.saveAndSwaps)
  user: User;

  @ManyToOne(() => Property, property => property.saveAndSwaps)
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 