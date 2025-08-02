// src/swap/entities/add-swap.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('add_swap')
export class AddSwap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  item_condition: string;

  @Column()
  location: string;

  @CreateDateColumn()
  created_at: Date;
}
