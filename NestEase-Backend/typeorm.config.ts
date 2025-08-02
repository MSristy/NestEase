import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Property } from './src/properties/entities/property.entity';
import { ServiceProvider } from './src/service-providers/entities/service-provider.entity';
import { SaveAndSwap } from './src/save-and-swap/entities/save-and-swap.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'nestease',
  entities: [User, Property, ServiceProvider, SaveAndSwap],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 