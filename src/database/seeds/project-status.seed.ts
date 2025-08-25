import { DataSource } from 'typeorm';
import { ProjectStatus } from '../entities/project-status.entity';

export class ProjectStatusSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const projectStatusRepository = dataSource.getRepository(ProjectStatus);

    // Check if project statuses already exist
    const existingStatuses = await projectStatusRepository.count();
    if (existingStatuses > 0) {
      console.log('Project statuses already exist, skipping seed...');
      return;
    }

    const statuses = [
      { name: 'Active' },
      { name: 'Completed' },
      { name: 'On Hold' },
      { name: 'Cancelled' },
    ];

    await projectStatusRepository.save(statuses);
    console.log('Project statuses seeded successfully');
  }
}