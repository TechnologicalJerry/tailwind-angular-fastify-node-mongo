import { FastifySchema } from 'fastify';

export const getSessionsSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      isActive: { type: 'boolean' }
    }
  }
};

export const revokeSessionSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['sessionId'],
    properties: {
      sessionId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
    }
  }
};

export const revokeAllSessionsSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      exceptCurrent: { type: 'boolean', default: true }
    }
  }
};
