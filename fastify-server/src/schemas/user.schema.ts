import { FastifySchema } from 'fastify';

export const createUserSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { 
        type: 'string', 
        minLength: 8,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$'
      },
      firstName: { type: 'string', minLength: 1, maxLength: 50 },
      lastName: { type: 'string', minLength: 1, maxLength: 50 },
      role: { type: 'string', enum: ['user', 'admin'] }
    }
  }
};

export const updateUserSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string', minLength: 1, maxLength: 50 },
      lastName: { type: 'string', minLength: 1, maxLength: 50 },
      role: { type: 'string', enum: ['user', 'admin'] },
      isActive: { type: 'boolean' },
      emailVerified: { type: 'boolean' }
    }
  }
};

export const getUserSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
    }
  }
};

export const getUsersSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      search: { type: 'string' },
      role: { type: 'string', enum: ['user', 'admin'] },
      isActive: { type: 'boolean' }
    }
  }
};
