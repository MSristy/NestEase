import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, user => user.addresses)
  user: User;
} 