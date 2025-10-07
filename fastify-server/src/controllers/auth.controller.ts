import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../auth/auth.service';
import { IUserCreate } from '../models/user.model';

export class AuthController {
  static async register(request: FastifyRequest<{ Body: IUserCreate }>, reply: FastifyReply) {
    try {
      const result = await AuthService.register(request.body);
      
      reply.status(201).send({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }

  static async login(request: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) {
    try {
      const result = await AuthService.login(request.body);
      
      reply.send({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      reply.status(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  static async refreshToken(request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
    try {
      const tokens = await AuthService.refreshToken(request.body.refreshToken);
      
      reply.send({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      reply.status(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed'
      });
    }
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const sessionId = (request as any).sessionId;
      if (!sessionId) {
        return reply.status(400).send({
          success: false,
          message: 'No active session found'
        });
      }

      await AuthService.logout(sessionId);
      
      reply.send({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      });
    }
  }

  static async logoutAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user?.userId;
      if (!userId) {
        return reply.status(400).send({
          success: false,
          message: 'User not authenticated'
        });
      }

      const revokedCount = await AuthService.logoutAllSessions(userId);
      
      reply.send({
        success: true,
        message: `Logged out from ${revokedCount} sessions`,
        data: { revokedSessions: revokedCount }
      });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      });
    }
  }

  static async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user?.userId;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = AuthService.getUserById(userId);
      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'User not found'
        });
      }

      reply.send({
        success: true,
        data: { user }
      });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get profile'
      });
    }
  }
}
