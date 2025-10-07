import { FastifyRequest, FastifyReply } from 'fastify';
import { SessionService } from '../auth/session.service';

export async function sessionMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const sessionId = (request as any).sessionId;
    
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

    // Update session activity
    const session = SessionService.getSession(sessionId);
    if (session) {
      SessionService.updateSession(sessionId, {
        // Update last activity timestamp
      });
    }
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: 'Session validation failed'
    });
  }
}

export async function sessionCleanupMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Clean up expired sessions periodically
    const cleanedCount = SessionService.cleanupExpiredSessions();
    
    if (cleanedCount > 0) {
      request.log.info(`Cleaned up ${cleanedCount} expired sessions`);
    }
  } catch (error) {
    request.log.error('Session cleanup failed:', error);
  }
}
