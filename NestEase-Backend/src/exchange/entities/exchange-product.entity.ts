import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('exchange_product')
export class ExchangeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'your_name', length: 255 })
  yourName: string;

  @Column({ name: 'your_phone', length: 20, nullable: true })
  yourPhone: string;

  @Column({ name: 'your_email', length: 255, nullable: true })
  yourEmail: string;

  @Column({ name: 'product_name', length: 255 })
  productName: string;

  @Column({ length: 100 })
  category: string;

  @Column({ name: 'item_condition', length: 20 })
  itemCondition: string;

  @Column({ length: 255 })
  location: string;

  @Column('text')
  description: string;

  @Column('text')
  images: string;

  @Column({ 
    name: 'status', 
    length: 20, 
    default: 'pending'
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 