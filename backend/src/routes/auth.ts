import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';
import { validate, registerValidator, loginValidator } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

router.post('/register', validate(registerValidator), async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await bcryptjs.hash(password, env.BCRYPT_ROUNDS);
    const uuid = uuidv4();

    const result = await query(
      'INSERT INTO users (id, email, password, name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, role',
      [uuid, email, hashedPassword, name, phone, 'user']
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    logger.info('User registered', { userId: user.id, email: user.email });
    res.status(201).json({ success: true, accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Registration error', { error: (error as Error).message });
    throw new AppError(500, 'Registration failed');
  }
});

router.post('/login', validate(loginValidator), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await query('SELECT id, email, password, name, role FROM users WHERE email = $1 AND is_active = true', [email]);
    if (result.rows.length === 0) {
      throw new AppError(401, 'Invalid credentials');
    }

    const user = result.rows[0];
    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    logger.info('User logged in', { userId: user.id });
    res.json({ success: true, accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Login error', { error: (error as Error).message });
    throw new AppError(500, 'Login failed');
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError(400, 'Refresh token required');
    }

    const payload = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ userId: payload.userId, email: payload.email, role: payload.role });

    res.json({ success: true, accessToken });
  } catch (error) {
    throw new AppError(401, 'Invalid refresh token');
  }
});

export default router;
