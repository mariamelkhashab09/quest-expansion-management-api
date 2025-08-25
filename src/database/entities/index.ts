// Export all entities from this barrel file
export { Role } from './role.entity';
export { User } from './user.entity';

// Import for local use
import { Role } from './role.entity';
import { User } from './user.entity';

// Array of all entities for easy import in modules
export const entities = [
  Role,
  User,
];