import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

export class RoleSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    // Check if roles already exist
    const existingRoles = await roleRepository.count();
    if (existingRoles > 0) {
      console.log('Roles already exist, skipping seed...');
      return;
    }

    const roles = [
      {
        name: 'admin',
      },
      {
        name: 'client',
      }
    ];

    await roleRepository.save(roles);
    console.log('Roles seeded successfully');
  }
}