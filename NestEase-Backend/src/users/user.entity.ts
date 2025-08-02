import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ServiceProvider } from '../service-providers/service-provider.entity';
import { ServiceBooking } from '../service-providers/service-booking.entity';
import { Property } from '../properties/property.entity';
import { PropertyBooking } from '../properties/property-booking.entity';
import { SwapRequest } from '../properties/swap-request.entity';
import { SwapItem } from '../save-and-swap/entities/swap-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['USER', 'SERVICE_PROVIDER', 'PROPERTY_OWNER', 'ADMIN'],
    default: 'USER'
  })
  role: string;

  @OneToOne(() => ServiceProvider, serviceProvider => serviceProvider.user)
  serviceProvider: ServiceProvider;

  @OneToMany(() => ServiceBooking, booking => booking.customer)
  serviceBookings: ServiceBooking[];

  @OneToMany(() => Property, property => property.owner)
  properties: Property[];

  @OneToMany(() => PropertyBooking, booking => booking.tenant)
  propertyBookings: PropertyBooking[];

  @OneToMany(() => SwapRequest, swapRequest => swapRequest.requester)
  swapRequests: SwapRequest[];

  @OneToMany(() => SwapItem, swapItem => swapItem.owner)
  swapItems: SwapItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 