import jwt from 'jsonwebtoken';
import { EncryptionService } from '../utils/encryption';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class JwtService {
  private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';

  static generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.SECRET, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'fastify-app'
    });
  }

  static generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { 
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: 'fastify-app'
    });
  }

  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.REFRESH_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}
