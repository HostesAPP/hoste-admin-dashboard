import { Router } from 'express';
import { query } from '../lib/db';

const router = Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json({ success: true, payments: result.rows });
  } catch (error: any) {
    console.error('Payment GET error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, user_id, amount, currency, status } = req.body;
    const resolvedUserId = userId || user_id;
    const result = await query(
      'INSERT INTO payments (user_id, amount, currency, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [resolvedUserId, amount, currency || 'USD', status || 'pending']
    );
    res.status(201).json({ success: true, payment: result.rows[0] });
  } catch (error: any) {
    console.error('Payment POST error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
