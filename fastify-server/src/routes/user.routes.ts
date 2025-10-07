import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import { 
  createUserSchema, 
  updateUserSchema, 
  getUserSchema, 
  getUsersSchema 
} from '../schemas/user.schema';
import { generalRateLimit } from '../middleware/rateLimit.middleware';

export default async function userRoutes(fastify: FastifyInstance) {
  // Apply rate limiting
  fastify.addHook('preHandler', generalRateLimit);

  // Public routes (if any)
  // None for now - all user routes require authentication

  // Protected routes
  fastify.addHook('preHandler', fastify.authenticate);

  // Get all users (admin only)
  fastify.get('/', {
    schema: getUsersSchema,
    preHandler: fastify.requireAdmin,
    handler: UserController.getUsers
  });

  // Get user by ID
  fastify.get('/:id', {
    schema: getUserSchema,
    handler: UserController.getUser
  });

  // Update user
  fastify.put('/:id', {
    schema: updateUserSchema,
    handler: UserController.updateUser
  });

  // Delete user
  fastify.delete('/:id', {
    schema: getUserSchema,
    handler: UserController.deleteUser
  });

  // User profile routes (using current user's ID)
  fastify.get('/profile/me', {
    handler: async (request, reply) => {
      const userId = (request as any).user?.userId;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Redirect to user by ID
      request.params = { id: userId };
      return UserController.getUser(request, reply);
    }
  });

  fastify.put('/profile/me', {
    schema: updateUserSchema,
    handler: async (request, reply) => {
      const userId = (request as any).user?.userId;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Redirect to user update by ID
      request.params = { id: userId };
      return UserController.updateUser(request, reply);
    }
  });
}
