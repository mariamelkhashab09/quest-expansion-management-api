import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Project, Client } from '../../database/entities';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from '../dto';
import { ProjectsValidationService } from './projects-validation.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private validationService: ProjectsValidationService,
  ) {}

  async create(userId: number, createProjectDto: CreateProjectDto): Promise<Project> {
    const { countryId, budget, statusId, serviceIds } = createProjectDto;

    // Validate business rules
    const { client, services } = await this.validationService.validateProjectCreation(
      userId,
      countryId,
      statusId,
      serviceIds
    );

    // Create project
    const project = this.projectRepository.create({
      clientId: client.id,
      countryId,
      budget,
      statusId,
      services,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(userId: number, query: ProjectQueryDto): Promise<{ projects: Project[]; total: number }> {
    // Validate client exists
    const client = await this.validationService.validateClientExists(userId);

    const { statusId, countryId, page = 1, limit = 10 } = query;

    const options: FindManyOptions<Project> = {
      where: {
        clientId: client.id,
        ...(statusId && { statusId }),
        ...(countryId && { countryId }),
      },
      relations: ['client', 'country', 'status', 'services'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    };

    const [projects, total] = await this.projectRepository.findAndCount(options);

    return { projects, total };
  }

  async findOne(userId: number, projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'country', 'status', 'services'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Validate ownership
    await this.validationService.validateProjectOwnership(userId, project);

    return project;
  }

  async update(userId: number, projectId: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(userId, projectId); // This already checks ownership

    const { countryId, budget, statusId, serviceIds } = updateProjectDto;

    // Update budget if provided
    if (budget !== undefined) {
      project.budget = budget;
    }

    // Validate all updates
    const validatedData = await this.validationService.validateProjectUpdate(
      userId,
      project,
      { countryId, statusId, serviceIds }
    );

    // Apply validated updates
    if (validatedData.country && countryId) {
      project.countryId = countryId;
    }

    if (validatedData.status && statusId) {
      project.statusId = statusId;
    }

    if (validatedData.services && serviceIds) {
      project.services = validatedData.services;
    }

    return await this.projectRepository.save(project);
  }

  async remove(userId: number, projectId: number): Promise<void> {
    const project = await this.findOne(userId, projectId); // This already checks ownership

    await this.projectRepository.remove(project);
  }
}