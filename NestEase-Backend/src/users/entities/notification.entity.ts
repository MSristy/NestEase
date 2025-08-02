import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  INTERVIEW = 'interview',
  PROPERTY = 'property',
  SERVICE = 'service',
  SWAP = 'swap',
  SYSTEM = 'system'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: {
    interviewDate?: string;
    interviewTime?: string;
    interviewLocation?: string;
    interviewType?: string;
    position?: string;
    department?: string;
    adminNotes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: User;
} 