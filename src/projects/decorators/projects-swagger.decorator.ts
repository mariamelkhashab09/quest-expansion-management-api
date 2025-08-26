import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from '../dto';

export function ApiCreateProject() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Create a new project',
      description: 'Create a new project for the authenticated client user. The project will be associated with the user\'s client profile.'
    }),
    ApiBody({
      type: CreateProjectDto,
      description: 'Project creation data',
      examples: {
        basic: {
          summary: 'Basic project',
          value: {
            countryId: 1,
            budget: 50000,
            statusId: 1,
            serviceIds: [1, 2]
          }
        },
        large: {
          summary: 'Large budget project',
          value: {
            countryId: 2,
            budget: 250000,
            statusId: 1,
            serviceIds: [1, 2, 3, 4]
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Project successfully created',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          clientId: { type: 'number', example: 1 },
          countryId: { type: 'number', example: 1 },
          budget: { type: 'number', example: 50000 },
          statusId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              companyName: { type: 'string' }
            }
          },
          country: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' }
            }
          },
          status: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' }
            }
          },
          services: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
            }
          }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data or validation errors',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'array', items: { type: 'string' } },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: 'User not authenticated',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'User does not have required role',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' }
        }
      }
    })
  );
}

export function ApiGetProjects() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get all projects for authenticated client',
      description: 'Retrieve paginated list of projects belonging to the authenticated client user. Supports filtering by status and country.'
    }),
    ApiQuery({
      name: 'statusId',
      required: false,
      description: 'Filter projects by status ID',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'countryId',
      required: false,
      description: 'Filter projects by country ID',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of items per page',
      type: Number,
      example: 10
    }),
    ApiResponse({
      status: 200,
      description: 'Projects retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                clientId: { type: 'number' },
                countryId: { type: 'number' },
                budget: { type: 'number' },
                statusId: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          },
          total: { type: 'number', example: 25 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: 'User not authenticated',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'User does not have required role',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' }
        }
      }
    })
  );
}

export function ApiGetProject() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get project by ID',
      description: 'Retrieve a specific project by ID. User can only access projects belonging to their client profile.'
    }),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      type: Number,
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Project retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          clientId: { type: 'number' },
          countryId: { type: 'number' },
          budget: { type: 'number' },
          statusId: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          client: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              companyName: { type: 'string' }
            }
          },
          country: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' }
            }
          },
          status: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' }
            }
          },
          services: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
            }
          }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Invalid project ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Validation failed (numeric string is expected)' },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: 'User not authenticated',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'User does not have required role',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' }
        }
      }
    }),
    ApiNotFoundResponse({
      description: 'Project not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Project not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
}

export function ApiUpdateProject() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Update project',
      description: 'Update an existing project. User can only update projects belonging to their client profile.'
    }),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      type: Number,
      example: 1
    }),
    ApiBody({
      type: UpdateProjectDto,
      description: 'Project update data (all fields optional)',
      examples: {
        budget: {
          summary: 'Update budget only',
          value: {
            budget: 75000
          }
        },
        status: {
          summary: 'Update status only',
          value: {
            statusId: 2
          }
        },
        services: {
          summary: 'Update services only',
          value: {
            serviceIds: [1, 3, 5]
          }
        },
        multiple: {
          summary: 'Update multiple fields',
          value: {
            countryId: 2,
            budget: 100000,
            statusId: 3,
            serviceIds: [2, 4]
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Project updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          clientId: { type: 'number' },
          countryId: { type: 'number' },
          budget: { type: 'number' },
          statusId: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data or validation errors',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'array', items: { type: 'string' } },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: 'User not authenticated',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'User does not have required role',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' }
        }
      }
    }),
    ApiNotFoundResponse({
      description: 'Project not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Project not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
}

export function ApiDeleteProject() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Delete project',
      description: 'Delete a project. User can only delete projects belonging to their client profile.'
    }),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      type: Number,
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Project deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Project deleted successfully' }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Invalid project ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Validation failed (numeric string is expected)' },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: 'User not authenticated',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'User does not have required role',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' }
        }
      }
    }),
    ApiNotFoundResponse({
      description: 'Project not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Project not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
} 