import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('add_yours')
export class AddYours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  transaction_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'item_condition' })
  itemCondition: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  image_url: string;

  @Column()
  owner_id: number;

  @Column()
  owner_name: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  swap_value: number;

  @Column({ nullable: true })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  original_price: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 