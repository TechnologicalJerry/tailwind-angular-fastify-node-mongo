import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { JwtService } from '../auth/jwt.service';
import { SessionService } from '../auth/session.service';

export default async function authPlugin(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Register JWT decorators
  fastify.decorate('authenticate', async function(request: any, reply: any) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return reply.status(401).send({
          success: false,
          message: 'Access token required'
        });
      }

      // Verify JWT token
      const payload = JwtService.verifyAccessToken(token);
      
      // Verify session is still active
      const sessions = SessionService.getSessionsByUserId(payload.userId);
      const activeSession = sessions.find(s => s.token === token && s.isActive);
      
      if (!activeSession) {
        return reply.status(401).send({
          success: false,
          message: 'Session expired or invalid'
        });
      }

      // Attach user info to request
      request.user = payload;
      request.sessionId = activeSession._id;
      
    } catch (error) {
      return reply.status(401).send({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  });

  // Register admin decorator
  fastify.decorate('requireAdmin', async function(request: any, reply: any) {
    const user = request.user;
    
    if (!user || user.role !== 'admin') {
      return reply.status(403).send({
        success: false,
        message: 'Admin access required'
      });
    }
  });

  // Register optional auth decorator
  fastify.decorate('optionalAuth', async function(request: any, reply: any) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        const payload = JwtService.verifyAccessToken(token);
        const sessions = SessionService.getSessionsByUserId(payload.userId);
        const activeSession = sessions.find(s => s.token === token && s.isActive);
        
        if (activeSession) {
          request.user = payload;
          request.sessionId = activeSession._id;
        }
      }
    } catch (error) {
      // Optional auth - don't throw error if token is invalid
    }
  });

  // Register session validation decorator
  fastify.decorate('validateSession', async function(request: any, reply: any) {
    const sessionId = request.sessionId;
    
    if (!sessionId) {
      return reply.status(401).send({
        success: false,
        message: 'No active session found'
      });
    }

    // Validate session
    const isValid = SessionService.validateSession(sessionId);
    
    if (!isValid) {
      return reply.status(401).send({
        success: false,
        message: 'Session expired or invalid'
      });
    }
  });
}

// Extend FastifyInstance interface
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
    requireAdmin: (request: any, reply: any) => Promise<void>;
    optionalAuth: (request: any, reply: any) => Promise<void>;
    validateSession: (request: any, reply: any) => Promise<void>;
  }
}
