import { DataSource } from 'typeorm';
import { Country } from '../entities/country.entity';

export class CountrySeed {
  public async run(dataSource: DataSource): Promise<void> {
    const countryRepository = dataSource.getRepository(Country);

    // Check if countries already exist
    const existingCountries = await countryRepository.count();
    if (existingCountries > 0) {
      console.log('Countries already exist, skipping seed...');
      return;
    }

    const countries = [
      { name: 'United States' },
      { name: 'Canada' },
      { name: 'United Kingdom' },
    ];

    await countryRepository.save(countries);
    console.log('Countries seeded successfully');
  }
}