import { FastifyInstance } from 'fastify';

export default async function indexRoutes(fastify: FastifyInstance) {
  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return {
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  });

  // API info endpoint
  fastify.get('/api/info', async (request, reply) => {
    return {
      success: true,
      data: {
        name: 'Fastify API',
        version: '1.0.0',
        description: 'A Fastify-based API with authentication and session management',
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          products: '/api/products',
          docs: '/docs'
        }
      }
    };
  });

  // Root endpoint
  fastify.get('/', async (request, reply) => {
    return {
      success: true,
      message: 'Welcome to Fastify API',
      data: {
        version: '1.0.0',
        documentation: '/docs',
        health: '/health'
      }
    };
  });
}
