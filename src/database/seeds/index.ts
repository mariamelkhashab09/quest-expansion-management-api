import { DataSource } from 'typeorm';
import { RoleSeed } from './role.seed';
import { UserSeed } from './user.seed';
import { ProjectStatusSeed } from './project-status.seed';
import { CountrySeed } from './country.seed';
import { ServiceSeed } from './service.seed';

export class DatabaseSeeder {
  public async run(dataSource: DataSource): Promise<void> {
          console.log('Starting database seeding...');

    try {
      // Run seeds in order (lookup tables first, then users)
      await new RoleSeed().run(dataSource);
      await new ProjectStatusSeed().run(dataSource);
      await new CountrySeed().run(dataSource);
      await new ServiceSeed().run(dataSource);
      await new UserSeed().run(dataSource);

      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Database seeding failed:', error);
      throw error;
    }
  }
}

// Export individual seeders
export { RoleSeed } from './role.seed';
export { UserSeed } from './user.seed';
export { ProjectStatusSeed } from './project-status.seed';
export { CountrySeed } from './country.seed';
export { ServiceSeed } from './service.seed';