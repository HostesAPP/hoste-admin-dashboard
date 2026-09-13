import { query } from '../lib/db';

export const findProfileByUserId = async (userId: string) => {
  const result = await query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [userId]);
  return result.rows[0] || null;
};

export const upsertProfile = async (userId: string, fullName: string, metadata: any) => {
  const result = await query(
    `INSERT INTO profiles (user_id, full_name, metadata, updated_at) 
     VALUES ($1, $2, $3, NOW()) 
     ON CONFLICT (user_id) 
     DO UPDATE SET full_name = $2, metadata = $3, updated_at = NOW() 
     RETURNING *`,
    [userId, fullName, JSON.stringify(metadata)]
  );
  return result.rows[0];
};
