import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '../auth/jwt.service';
import { SessionService } from '../auth/session.service';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
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
    (request as any).user = payload;
    (request as any).sessionId = activeSession._id;
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

export async function adminMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (request as any).user;
    
    if (!user || user.role !== 'admin') {
      return reply.status(403).send({
        success: false,
        message: 'Admin access required'
      });
    }
  } catch (error) {
    return reply.status(403).send({
      success: false,
      message: 'Access denied'
    });
  }
}

export async function optionalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const payload = JwtService.verifyAccessToken(token);
      const sessions = SessionService.getSessionsByUserId(payload.userId);
      const activeSession = sessions.find(s => s.token === token && s.isActive);
      
      if (activeSession) {
        (request as any).user = payload;
        (request as any).sessionId = activeSession._id;
      }
    }
  } catch (error) {
    // Optional auth - don't throw error if token is invalid
    // Just continue without user context
  }
}
