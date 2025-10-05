export interface ISession {
  _id?: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionCreate {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface ISessionUpdate {
  isActive?: boolean;
  expiresAt?: Date;
}
