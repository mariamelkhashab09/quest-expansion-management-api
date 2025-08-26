import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RegisterDto, LoginDto } from '../dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Create a new user account with optional client profile. If companyName and contactEmail are provided, a client profile will be created.'
    }),
    ApiBody({
      type: RegisterDto,
      description: 'User registration data',
      examples: {
        client: {
          summary: 'Register as client',
          value: {
            email: 'client@example.com',
            password: 'password123',
            roleId: 2,
            companyName: 'Example Corp',
            contactEmail: 'contact@example.com'
          }
        },
        basic: {
          summary: 'Basic registration',
          value: {
            email: 'user@example.com',
            password: 'password123',
            roleId: 2
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered',
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              roleId: { type: 'number' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          client: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'number' },
              companyName: { type: 'string' },
              contactEmail: { type: 'string' }
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
    ApiConflictResponse({
      description: 'User with this email already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'User with this email already exists' },
          error: { type: 'string', example: 'Conflict' }
        }
      }
    }),
    ApiNotFoundResponse({
      description: 'Role not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Role not found' },
          error: { type: 'string', example: 'Not Found' }
        }
      }
    })
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticate user with email and password. Returns JWT access token.'
    }),
    ApiBody({
      type: LoginDto,
      description: 'User login credentials',
      examples: {
        admin: {
          summary: 'Admin login',
          value: {
            email: 'admin@questexpansion.com',
            password: 'admin123'
          }
        },
        client: {
          summary: 'Client login',
          value: {
            email: 'user@questexpansion.com',
            password: 'client123'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            description: 'JWT access token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
      description: 'Invalid credentials',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Invalid credentials' },
          error: { type: 'string', example: 'Unauthorized' }
        }
      }
    })
  );
}