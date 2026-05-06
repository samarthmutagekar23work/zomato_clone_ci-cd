import { Router, Request, Response } from 'express';
import { query } from '../config/database';

import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, limit = 20, offset = 0 } = req.query;
    const result = await query(
      'SELECT id, name, cuisine, rating, delivery_time, cost_for_two, is_open, locality, lat, lng, images FROM restaurants WHERE city = $1 AND is_active = true ORDER BY rating DESC, is_promoted DESC LIMIT $2 OFFSET $3',
      [city, limit, offset]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Fetch restaurants error', { error: (error as Error).message });
    throw new AppError(500, 'Failed to fetch restaurants');
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM restaurants WHERE id = $1 AND is_active = true', [id]);
    if (result.rows.length === 0) {
      throw new AppError(404, 'Restaurant not found');
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Fetch restaurant error', { error: (error as Error).message });
    throw new AppError(500, 'Failed to fetch restaurant');
  }
});

router.get('/:id/menu', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = true', [id]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Fetch menu error', { error: (error as Error).message });
    throw new AppError(500, 'Failed to fetch menu');
  }
});

export default router;
