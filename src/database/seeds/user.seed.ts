import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../entities';
import { saltRounds } from '../../config/constants';

export class UserSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed...');
      return;
    }

    // Get roles
    const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    const userRole = await roleRepository.findOne({ where: { name: 'client' } });

    if (!adminRole || !userRole) {
      throw new Error('Roles must be seeded before users');
    }

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const userPassword = await bcrypt.hash('client123', saltRounds);

    const users = [
      {
        email: 'admin@questexpansion.com',
        password: adminPassword,
        roleId: adminRole.id,
        isActive: true,
      },
      {
        email: 'user@questexpansion.com',
        password: userPassword,
        roleId: userRole.id,
        isActive: true,
      },
    ];

    await userRepository.save(users);
    console.log('Users seeded successfully');
  }
}