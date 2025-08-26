import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { Vendor } from '../../database/entities';
import { CreateVendorDto, UpdateVendorDto, VendorQueryDto } from '../dto';
import { VendorsValidationService } from './vendors-validation.service';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private validationService: VendorsValidationService,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const { name, rating, responseSlaHours, countryIds, serviceIds } = createVendorDto;

    // Validate business rules
    const { countries, services } = await this.validationService.validateVendorCreation(
      countryIds,
      serviceIds
    );

    // Create vendor
    const vendor = this.vendorRepository.create({
      name,
      rating,
      responseSlaHours,
      countries,
      services,
    });

    return await this.vendorRepository.save(vendor);
  }

  async findAll(query: VendorQueryDto): Promise<{ vendors: Vendor[]; total: number }> {
    const { 
      name, 
      countryId, 
      serviceId, 
      countryIds, 
      serviceIds, 
      page = 1, 
      limit = 10 
    } = query;

    const queryBuilder = this.vendorRepository.createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.countries', 'country')
      .leftJoinAndSelect('vendor.services', 'service');

    // Filter by name
    if (name) {
      queryBuilder.andWhere('vendor.name LIKE :name', { name: `%${name}%` });
    }

    // Filter by single country
    if (countryId) {
      queryBuilder.andWhere('country.id = :countryId', { countryId });
    }

    // Filter by multiple countries
    if (countryIds && countryIds.length > 0) {
      queryBuilder.andWhere('country.id IN (:...countryIds)', { countryIds });
    }

    // Filter by single service
    if (serviceId) {
      queryBuilder.andWhere('service.id = :serviceId', { serviceId });
    }

    // Filter by multiple services
    if (serviceIds && serviceIds.length > 0) {
      queryBuilder.andWhere('service.id IN (:...serviceIds)', { serviceIds });
    }

    // Add pagination
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vendor.name', 'ASC');

    const [vendors, total] = await queryBuilder.getManyAndCount();

    return { vendors, total };
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['countries', 'services'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);

    const { name, rating, responseSlaHours, countryIds, serviceIds } = updateVendorDto;

    // Update simple fields
    if (name !== undefined) {
      vendor.name = name;
    }

    if (rating !== undefined) {
      vendor.rating = rating;
    }

    if (responseSlaHours !== undefined) {
      vendor.responseSlaHours = responseSlaHours;
    }

    // Validate and update relationships
    const validatedData = await this.validationService.validateVendorUpdate(
      countryIds,
      serviceIds
    );

    if (validatedData.countries) {
      vendor.countries = validatedData.countries;
    }

    if (validatedData.services) {
      vendor.services = validatedData.services;
    }

    return await this.vendorRepository.save(vendor);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorRepository.remove(vendor);
  }


}