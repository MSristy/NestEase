require('dotenv').config();

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nestease',
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migrations'
  },
  synchronize: false,
} 