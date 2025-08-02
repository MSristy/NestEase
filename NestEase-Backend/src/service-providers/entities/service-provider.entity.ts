import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  businessName: string;

  @Column('text')
  description: string;

  @Column()
  serviceType: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column('simple-array')
  services: string[];

  @Column('simple-array')
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  totalReviews: number;

  @ManyToOne(() => User, user => user.serviceProviders)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 