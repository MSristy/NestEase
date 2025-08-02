import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ContactMessageStatus {
  PENDING = 'pending',
  READ = 'read',
  REPLIED = 'replied',
  CLOSED = 'closed'
}

@Entity('contact_form_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactMessageStatus,
    default: ContactMessageStatus.PENDING
  })
  status: ContactMessageStatus;

  @Column('text', { nullable: true })
  adminReply: string;

  @Column({ nullable: true })
  repliedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 