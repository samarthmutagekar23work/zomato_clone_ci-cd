import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from './logger';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'restaurant_owner';
  iat?: number;
  exp?: number;
}

const ALGORITHM = 'HS256' as const;

export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
    algorithm: ALGORITHM,
    issuer: 'zomato-clone',
    audience: 'zomato-clone-client',
  });
};

export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
    algorithm: ALGORITHM,
    issuer: 'zomato-clone',
    audience: 'zomato-clone-client',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: [ALGORITHM],
      issuer: 'zomato-clone',
      audience: 'zomato-clone-client',
    }) as TokenPayload;
  } catch (error) {
    logger.warn('Token verification failed', { error: (error as Error).message });
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      algorithms: [ALGORITHM],
      issuer: 'zomato-clone',
      audience: 'zomato-clone-client',
    }) as TokenPayload;
  } catch (error) {
    logger.warn('Refresh token verification failed', { error: (error as Error).message });
    throw new Error('Invalid or expired refresh token');
  }
};
