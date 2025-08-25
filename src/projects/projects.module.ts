import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, Client, Country, ProjectStatus, Service } from '../database/entities';
import { ProjectsController } from './projects.controller';
import { ProjectsService, ProjectsValidationService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Client,
      Country,
      ProjectStatus,
      Service,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsValidationService],
  exports: [ProjectsService, ProjectsValidationService],
})
export class ProjectsModule {}