import { query } from '../lib/db';

export const findUserByEmail = async (email: string) => {
  const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows[0] || null;
};

export const createUser = async (email: string, passwordHash: string, role: string) => {
  const result = await query(
    'INSERT INTO users (email, password_hash, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [email, passwordHash, role]
  );
  return result.rows[0];
};
