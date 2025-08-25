// Import for local use
import { Role } from './role.entity';
import { User } from './user.entity';
import { Client } from './client.entity';
import { ProjectStatus } from './project-status.entity';
import { Country } from './country.entity';
import { Service } from './service.entity';
import { Vendor } from './vendor.entity';
import { Project } from './project.entity';

// Array of all entities for easy import in modules
export const entities = [
  Role,
  User,
  Client,
  ProjectStatus,
  Country,
  Service,
  Vendor,
  Project,
];

// Export individual entities
export { Role } from './role.entity';
export { User } from './user.entity';
export { Client } from './client.entity';
export { ProjectStatus } from './project-status.entity';
export { Country } from './country.entity';
export { Service } from './service.entity';
export { Vendor } from './vendor.entity';
export { Project } from './project.entity';
