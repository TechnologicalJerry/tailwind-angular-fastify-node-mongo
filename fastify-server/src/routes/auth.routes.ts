import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenSchema, 
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema 
} from '../schemas/auth.schema';
import { authRateLimit } from '../middleware/rateLimit.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  // Apply rate limiting to auth routes
  fastify.addHook('preHandler', authRateLimit);

  // Public auth routes
  fastify.post('/register', {
    schema: registerSchema,
    handler: AuthController.register
  });

  fastify.post('/login', {
    schema: loginSchema,
    handler: AuthController.login
  });

  fastify.post('/refresh', {
    schema: refreshTokenSchema,
    handler: AuthController.refreshToken
  });

  fastify.post('/forgot-password', {
    schema: forgotPasswordSchema,
    handler: async (request, reply) => {
      // Placeholder for forgot password functionality
      reply.send({
        success: true,
        message: 'Password reset email sent (placeholder)'
      });
    }
  });

  fastify.post('/reset-password', {
    schema: resetPasswordSchema,
    handler: async (request, reply) => {
      // Placeholder for reset password functionality
      reply.send({
        success: true,
        message: 'Password reset successfully (placeholder)'
      });
    }
  });

  // Protected auth routes
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/profile', AuthController.getProfile);

  fastify.post('/logout', AuthController.logout);

  fastify.post('/logout-all', AuthController.logoutAll);

  fastify.post('/change-password', {
    schema: changePasswordSchema,
    handler: async (request, reply) => {
      // Placeholder for change password functionality
      reply.send({
        success: true,
        message: 'Password changed successfully (placeholder)'
      });
    }
  });
}
