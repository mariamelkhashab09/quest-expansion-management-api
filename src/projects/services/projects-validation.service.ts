import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, Client, Country, ProjectStatus, Service } from '../../database/entities';

@Injectable()
export class ProjectsValidationService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(ProjectStatus)
    private projectStatusRepository: Repository<ProjectStatus>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  /**
   * Validates that the user has a client profile and returns it
   */
  async validateClientExists(userId: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client;
  }

  /**
   * Validates that the user owns the specified project
   */
  async validateProjectOwnership(userId: number, project: Project): Promise<void> {
    const client = await this.validateClientExists(userId);

    if (project.clientId !== client.id) {
      throw new ForbiddenException('You can only access your own projects');
    }
  }

  /**
   * Validates that a country exists
   */
  async validateCountryExists(countryId: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    return country;
  }

  /**
   * Validates that a project status exists
   */
  async validateProjectStatusExists(statusId: number): Promise<ProjectStatus> {
    const status = await this.projectStatusRepository.findOne({
      where: { id: statusId },
    });

    if (!status) {
      throw new NotFoundException(`Project status with ID ${statusId} not found`);
    }

    return status;
  }

  /**
   * Validates that all provided service IDs exist
   */
  async validateServicesExist(serviceIds: number[]): Promise<Service[]> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new NotFoundException('At least one service must be provided');
    }

    const services = await this.serviceRepository.findByIds(serviceIds);
    
    if (services.length !== serviceIds.length) {
      const foundIds = services.map(service => service.id);
      const missingIds = serviceIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Services with IDs [${missingIds.join(', ')}] not found`);
    }

    return services;
  }

  /**
   * Validates business rules for project creation
   */
  async validateProjectCreation(
    userId: number,
    countryId: number,
    statusId: number,
    serviceIds: number[]
  ): Promise<{
    client: Client;
    country: Country;
    status: ProjectStatus;
    services: Service[];
  }> {
    // Run validations in parallel for better performance
    const [client, country, status, services] = await Promise.all([
      this.validateClientExists(userId),
      this.validateCountryExists(countryId),
      this.validateProjectStatusExists(statusId),
      this.validateServicesExist(serviceIds),
    ]);

    return { client, country, status, services };
  }

  /**
   * Validates business rules for project updates
   */
  async validateProjectUpdate(
    userId: number,
    project: Project,
    updates: {
      countryId?: number;
      statusId?: number;
      serviceIds?: number[];
    }
  ): Promise<{
    country?: Country;
    status?: ProjectStatus;
    services?: Service[];
  }> {
    // First validate ownership
    await this.validateProjectOwnership(userId, project);

    // Validate optional updates
    const validationPromises: Promise<any>[] = [];
    const validationKeys: string[] = [];

    if (updates.countryId) {
      validationPromises.push(this.validateCountryExists(updates.countryId));
      validationKeys.push('country');
    }

    if (updates.statusId) {
      validationPromises.push(this.validateProjectStatusExists(updates.statusId));
      validationKeys.push('status');
    }

    if (updates.serviceIds) {
      validationPromises.push(this.validateServicesExist(updates.serviceIds));
      validationKeys.push('services');
    }

    const results = await Promise.all(validationPromises);
    
    // Map results back to named properties
    const validatedData: any = {};
    results.forEach((result, index) => {
      validatedData[validationKeys[index]] = result;
    });

    return validatedData;
  }
}