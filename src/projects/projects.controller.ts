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
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './services';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
import { RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { 
  ApiCreateProject, 
  ApiGetProjects, 
  ApiGetProject, 
  ApiUpdateProject, 
  ApiDeleteProject 
} from './decorators';
import { User, Project } from '../database/entities';

@ApiTags('projects')
@Controller('projects')
@UseGuards(RolesGuard)
@Roles('client')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreateProject()
  async create(
    @CurrentUser() user: User,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  @ApiGetProjects()
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
  @ApiGetProject()
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return this.projectsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiUpdateProject()
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(user.id, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiDeleteProject()
  async remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.projectsService.remove(user.id, id);
    return { message: 'Project deleted successfully' };
  }
}