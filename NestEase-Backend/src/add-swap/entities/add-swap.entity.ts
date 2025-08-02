import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('add_swap')
export class AddSwap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  owner_name: string;

  @Column({ length: 20 })
  owner_phone: string;

  @Column({ length: 255 })
  owner_email: string;

  @Column({ length: 255 })
  product_name: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 20 })
  item_condition: string;

  @Column({ length: 255 })
  location: string;

  @Column('text')
  description: string;

  @Column('text')
  images: string;

  @CreateDateColumn()
  createdAt: Date;
} 