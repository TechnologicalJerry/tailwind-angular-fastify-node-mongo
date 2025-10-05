import { ISession, ISessionCreate, ISessionUpdate } from '../models/session.model';
import { JwtService } from './jwt.service';
import { EncryptionService } from '../utils/encryption';

export class SessionService {
  private static sessions: Map<string, ISession> = new Map();

  static createSession(sessionData: ISessionCreate): ISession {
    const session: ISession = {
      _id: EncryptionService.generateRandomToken(24),
      ...sessionData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(session._id!, session);
    return session;
  }

  static getSession(sessionId: string): ISession | null {
    return this.sessions.get(sessionId) || null;
  }

  static getSessionsByUserId(userId: string): ISession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId);
  }

  static updateSession(sessionId: string, updates: ISessionUpdate): ISession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const updatedSession: ISession = {
      ...session,
      ...updates,
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  static revokeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.isActive = false;
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
    return true;
  }

  static revokeAllUserSessions(userId: string, exceptSessionId?: string): number {
    let revokedCount = 0;
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId && 
          session.isActive && 
          sessionId !== exceptSessionId) {
        session.isActive = false;
        session.updatedAt = new Date();
        this.sessions.set(sessionId, session);
        revokedCount++;
      }
    }

    return revokedCount;
  }

  static cleanupExpiredSessions(): number {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        session.isActive = false;
        session.updatedAt = new Date();
        this.sessions.set(sessionId, session);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  static validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) return false;
    
    if (session.expiresAt < new Date()) {
      session.isActive = false;
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);
      return false;
    }

    return true;
  }
}
