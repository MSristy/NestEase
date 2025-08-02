import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('sell_product')
export class SellProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_name: string;

  @Column()
  owner_phone: string;

  @Column()
  owner_email: string;

  @Column()
  product_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column()
  product_condition: string;

  @Column()
  location: string;

  @Column('text')
  description: string;

  @Column('text')
  images: string;

  @CreateDateColumn()
  created_at: Date;
} 