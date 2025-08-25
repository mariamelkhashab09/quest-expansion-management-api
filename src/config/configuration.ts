import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  // Application Configuration
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },

  // Database Configuration - MySQL
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'quest_user',
    password: process.env.DATABASE_PASSWORD || 'quest_password',
    name: process.env.DATABASE_NAME || 'quest_db',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },

  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quest_mongo',
  },
}));