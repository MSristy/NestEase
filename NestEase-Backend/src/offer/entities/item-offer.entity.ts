import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('item_offer')
export class ItemOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_name: string;

  @Column({ nullable: true })
  owner_phone: string;

  @Column({ nullable: true })
  owner_email: string;

  @Column()
  product_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

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