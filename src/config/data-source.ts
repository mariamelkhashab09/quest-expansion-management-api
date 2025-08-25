import { DataSource } from 'typeorm';
import { entities } from '../database/entities';

// TypeORM CLI configuration
export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USERNAME || 'quest_user',
  password: process.env.DATABASE_PASSWORD || 'quest_password',
  database: process.env.DATABASE_NAME || 'quest_db',
  entities,
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});