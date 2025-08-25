import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './services';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
import { RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { User, Project } from '../database/entities';

@Controller('projects')
@UseGuards(RolesGuard)
@Roles('client')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() query: ProjectQueryDto,
  ): Promise<{ projects: Project[]; total: number; page: number; limit: number }> {
    const { projects, total } = await this.projectsService.findAll(user.id, query);
    
    return {
      projects,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return this.projectsService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(user.id, id, updateProjectDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.projectsService.remove(user.id, id);
    return { message: 'Project deleted successfully' };
  }
}