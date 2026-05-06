import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { AppError } from './errorHandler';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError(401, 'Authorization header missing');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError(401, 'Invalid authorization header format');
    }

    const payload = verifyAccessToken(parts[1]);
    req.user = payload;
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: (error as Error).message, path: req.path });
    res.status(401).json({
      success: false,
      message: error instanceof AppError ? error.message : 'Authentication failed',
      requestId: req.headers['x-request-id'],
    });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user!;
    if (!user || !allowedRoles.includes(user.role)) {
      logger.warn('Authorization failed', { userId: user?.userId, role: user?.role, path: req.path });
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requestId: req.headers['x-request-id'],
      });
      return;
    }
    next();
  };
};
