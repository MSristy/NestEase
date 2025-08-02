import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ConnectedAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  connectedAt: Date;

  @Column({ type: 'json', nullable: true })
  providerData: any;

  @ManyToOne(() => User, user => user.connectedAccounts)
  user: User;
} 