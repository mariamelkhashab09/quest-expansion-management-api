import { DataSource } from 'typeorm';
import { RoleSeed } from './role.seed';
import { UserSeed } from './user.seed';

export class DatabaseSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      // Run seeds in order (roles first, then users)
      await new RoleSeed().run(dataSource);
      await new UserSeed().run(dataSource);

      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}

// Export individual seeders
export { RoleSeed } from './role.seed';
export { UserSeed } from './user.seed';