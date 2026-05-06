import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticate);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;
    const user = req.user!;

    let totalAmount = 0;
    for (const item of items) {
      const result = await query('SELECT price FROM menu_items WHERE id = $1 AND is_available = true', [item.menuItemId]);
      if (result.rows.length === 0) {
        throw new AppError(400, `Menu item ${item.menuItemId} not available`);
      }
      totalAmount += result.rows[0].price * item.quantity;
    }

    const orderId = uuidv4();
    const orderResult = await query(
      'INSERT INTO orders (id, user_id, restaurant_id, total_amount, delivery_address, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [orderId, user.userId, restaurantId, totalAmount, deliveryAddress, 'pending']
    );

    for (const item of items) {
      const itemResult = await query('SELECT price FROM menu_items WHERE id = $1', [item.menuItemId]);
      await query(
        'INSERT INTO order_items (id, order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [uuidv4(), orderId, item.menuItemId, item.quantity, itemResult.rows[0].price]
      );
    }

    logger.info('Order created', { orderId, userId: user.userId });
    res.status(201).json({ success: true, data: orderResult.rows[0] });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Create order error', { error: (error as Error).message });
    throw new AppError(500, 'Failed to create order');
  }
});

router.get('/my-orders', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [user.userId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Fetch orders error', { error: (error as Error).message });
    throw new AppError(500, 'Failed to fetch orders');
  }
});

export default router;
