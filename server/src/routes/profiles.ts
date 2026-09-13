import { Router } from 'express';
import { query } from '../lib/db';

const router = Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, profile: result.rows[0] });
  } catch (error: any) {
    console.error('Profile GET error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, full_name, metadata } = req.body;
    const resolvedName = fullName || full_name;
    const result = await query(
      `INSERT INTO profiles (user_id, full_name, metadata, updated_at) 
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (user_id) 
       DO UPDATE SET full_name = $2, metadata = $3, updated_at = NOW() 
       RETURNING *`,
      [userId, resolvedName, metadata]
    );
    res.json({ success: true, profile: result.rows[0] });
  } catch (error: any) {
    console.error('Profile PUT error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
