import { DataSource } from 'typeorm';
import { Service } from '../entities';

export class ServiceSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const serviceRepository = dataSource.getRepository(Service);

    // Check if services already exist
    const existingServices = await serviceRepository.count();
    if (existingServices > 0) {
      console.log('Services already exist, skipping seed...');
      return;
    }

    const services = [
      { name: 'Web Development' },
      { name: 'Mobile App' },
      { name: 'Consulting' },
    ];

    await serviceRepository.save(services);
    console.log('Services seeded successfully');
  }
}