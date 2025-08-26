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
import { CreateVendorDto, UpdateVendorDto, VendorQueryDto } from '../dto';

export function ApiCreateVendor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Create a new vendor',
      description: 'Create a new vendor. Only admin users can create vendors.'
    }),
    ApiBody({
      type: CreateVendorDto,
      description: 'Vendor creation data',
      examples: {
        basic: {
          summary: 'Basic vendor',
          value: {
            name: 'Tech Solutions Inc',
            responseSlaHours: 24,
            countryIds: [1, 2],
            serviceIds: [1, 2]
          }
        },
        rated: {
          summary: 'Vendor with rating',
          value: {
            name: 'Premium Services Ltd',
            rating: 4.5,
            responseSlaHours: 12,
            countryIds: [1],
            serviceIds: [1, 2, 3]
          }
        },
        fastResponse: {
          summary: 'Fast response vendor',
          value: {
            name: 'Quick Response Corp',
            rating: 4.8,
            responseSlaHours: 4,
            countryIds: [1, 2, 3],
            serviceIds: [2, 4]
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Vendor successfully created',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Tech Solutions Inc' },
          rating: { type: 'number', example: 4.5, nullable: true },
          responseSlaHours: { type: 'number', example: 24 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          countries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
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
      description: 'User does not have admin role',
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

export function ApiGetVendors() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get all vendors',
      description: 'Retrieve paginated list of vendors. Only admin users can access this endpoint. Supports filtering by name, country, and service.'
    }),
    ApiQuery({
      name: 'name',
      required: false,
      description: 'Filter vendors by name (partial match)',
      type: String,
      example: 'Tech'
    }),
    ApiQuery({
      name: 'countryId',
      required: false,
      description: 'Filter vendors by single country ID',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'serviceId',
      required: false,
      description: 'Filter vendors by single service ID',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'countryIds',
      required: false,
      description: 'Filter vendors by multiple country IDs (comma-separated)',
      type: String,
      example: '1,2,3'
    }),
    ApiQuery({
      name: 'serviceIds',
      required: false,
      description: 'Filter vendors by multiple service IDs (comma-separated)',
      type: String,
      example: '1,2,3'
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
      description: 'Vendors retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          vendors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                rating: { type: 'number', nullable: true },
                responseSlaHours: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          },
          total: { type: 'number', example: 15 },
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
      description: 'User does not have admin role',
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

export function ApiGetVendor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get vendor by ID',
      description: 'Retrieve a specific vendor by ID. Only admin users can access this endpoint.'
    }),
    ApiParam({
      name: 'id',
      description: 'Vendor ID',
      type: Number,
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Vendor retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          rating: { type: 'number', nullable: true },
          responseSlaHours: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          countries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
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
      description: 'Invalid vendor ID',
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
      description: 'User does not have admin role',
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
      description: 'Vendor not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Vendor not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
}

export function ApiUpdateVendor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Update vendor',
      description: 'Update an existing vendor. Only admin users can update vendors.'
    }),
    ApiParam({
      name: 'id',
      description: 'Vendor ID',
      type: Number,
      example: 1
    }),
    ApiBody({
      type: UpdateVendorDto,
      description: 'Vendor update data (all fields optional)',
      examples: {
        name: {
          summary: 'Update name only',
          value: {
            name: 'Updated Company Name'
          }
        },
        rating: {
          summary: 'Update rating only',
          value: {
            rating: 4.7
          }
        },
        sla: {
          summary: 'Update SLA only',
          value: {
            responseSlaHours: 8
          }
        },
        countries: {
          summary: 'Update countries only',
          value: {
            countryIds: [2, 3, 4]
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
            name: 'Premium Tech Solutions',
            rating: 4.9,
            responseSlaHours: 6,
            countryIds: [1, 2],
            serviceIds: [1, 2, 4]
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Vendor updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          rating: { type: 'number', nullable: true },
          responseSlaHours: { type: 'number' },
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
      description: 'User does not have admin role',
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
      description: 'Vendor not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Vendor not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
}

export function ApiDeleteVendor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Delete vendor',
      description: 'Delete a vendor. Only admin users can delete vendors.'
    }),
    ApiParam({
      name: 'id',
      description: 'Vendor ID',
      type: Number,
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Vendor deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Vendor deleted successfully' }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Invalid vendor ID',
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
      description: 'User does not have admin role',
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
      description: 'Vendor not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Vendor not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
} 