import { Router } from 'express';
import { query } from '../lib/db';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const result = await query(
      'INSERT INTO users (email, password_hash, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, role, created_at',
      [email, password, role || 'user']
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error: any) {
    console.error('Auth register error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
