import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vendor, Country, Service } from '../../database/entities';

@Injectable()
export class VendorsValidationService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async validateCountriesExist(countryIds: number[]): Promise<Country[]> {
    if (!countryIds || countryIds.length === 0) {
      throw new NotFoundException('At least one country must be specified');
    }

    const countries = await this.countryRepository.find({
      where: { id: In(countryIds) },
    });

    if (countries.length !== countryIds.length) {
      const foundIds = countries.map(country => country.id);
      const missingIds = countryIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Countries not found: ${missingIds.join(', ')}`);
    }

    return countries;
  }

  async validateServicesExist(serviceIds: number[]): Promise<Service[]> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new NotFoundException('At least one service must be specified');
    }

    const services = await this.serviceRepository.find({
      where: { id: In(serviceIds) },
    });

    if (services.length !== serviceIds.length) {
      const foundIds = services.map(service => service.id);
      const missingIds = serviceIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Services not found: ${missingIds.join(', ')}`);
    }

    return services;
  }

  async validateVendorCreation(countryIds: number[], serviceIds: number[]): Promise<{
    countries: Country[];
    services: Service[];
  }> {
    const [countries, services] = await Promise.all([
      this.validateCountriesExist(countryIds),
      this.validateServicesExist(serviceIds),
    ]);

    return { countries, services };
  }

  async validateVendorUpdate(
    countryIds?: number[],
    serviceIds?: number[]
  ): Promise<{
    countries?: Country[];
    services?: Service[];
  }> {
    const result: { countries?: Country[]; services?: Service[] } = {};

    if (countryIds && countryIds.length > 0) {
      result.countries = await this.validateCountriesExist(countryIds);
    }

    if (serviceIds && serviceIds.length > 0) {
      result.services = await this.validateServicesExist(serviceIds);
    }

    return result;
  }
}