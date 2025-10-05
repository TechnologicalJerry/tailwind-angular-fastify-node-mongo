import { IUser, IUserCreate, IUserPublic } from '../models/user.model';
import { ISession, ISessionCreate } from '../models/session.model';
import { JwtService, JwtPayload } from './jwt.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { ValidationService } from '../utils/validation';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: IUserPublic;
  accessToken: string;
  refreshToken: string;
  session: ISession;
}

export class AuthService {
  private static users: Map<string, IUser> = new Map();
  private static emailIndex: Map<string, string> = new Map();

  static async register(userData: IUserCreate): Promise<AuthResult> {
    // Validate email
    if (!ValidationService.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    if (this.emailIndex.has(userData.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await PasswordService.hashPassword(userData.password);

    // Create user
    const user: IUser = {
      _id: this.generateUserId(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: ValidationService.sanitizeInput(userData.firstName),
      lastName: ValidationService.sanitizeInput(userData.lastName),
      role: userData.role || 'user',
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store user
    this.users.set(user._id!, user);
    this.emailIndex.set(user.email, user._id!);

    // Create session and tokens
    return this.createUserSession(user);
  }

  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    // Find user by email
    const userId = this.emailIndex.get(credentials.email.toLowerCase());
    if (!userId) {
      throw new Error('Invalid credentials');
    }

    const user = this.users.get(userId);
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await PasswordService.verifyPassword(
      credentials.password, 
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    user.updatedAt = new Date();
    this.users.set(userId, user);

    // Create session and tokens
    return this.createUserSession(user);
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = JwtService.verifyRefreshToken(refreshToken);
      
      // Find session by refresh token
      const sessions = SessionService.getSessionsByUserId(payload.userId);
      const session = sessions.find(s => s.refreshToken === refreshToken && s.isActive);
      
      if (!session) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newTokens = JwtService.generateTokenPair({
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      });

      // Update session with new tokens
      SessionService.updateSession(session._id!, {
        token: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
      });

      return newTokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async logout(sessionId: string): Promise<boolean> {
    return SessionService.revokeSession(sessionId);
  }

  static async logoutAllSessions(userId: string): Promise<number> {
    return SessionService.revokeAllUserSessions(userId);
  }

  static getUserById(userId: string): IUserPublic | null {
    const user = this.users.get(userId);
    if (!user) return null;

    return this.toPublicUser(user);
  }

  static getUserByEmail(email: string): IUser | null {
    const userId = this.emailIndex.get(email.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  private static createUserSession(user: IUser): AuthResult {
    const tokens = JwtService.generateTokenPair({
      userId: user._id!,
      email: user.email,
      role: user.role
    });

    const sessionData: ISessionCreate = {
      userId: user._id!,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    const session = SessionService.createSession(sessionData);

    return {
      user: this.toPublicUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      session
    };
  }

  private static toPublicUser(user: IUser): IUserPublic {
    const { password, ...publicUser } = user;
    return publicUser as IUserPublic;
  }

  private static generateUserId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
