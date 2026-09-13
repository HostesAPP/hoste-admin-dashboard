import request from 'supertest';
import app from '../index';
import { query } from '../lib/db';
import pool from '../lib/db';

describe('Payment & Auth & Profile Integration Tests with Native PG', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  let testUserId: any;

  beforeAll(async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER PRIMARY KEY,
        full_name VARCHAR(255),
        metadata JSONB,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  });

  afterAll(async () => {
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'SecurePassword123!', role: 'admin' });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id');
    testUserId = res.body.user.id;
  });

  it('should upsert and fetch profile successfully', async () => {
    const putRes = await request(app)
      .put(`/api/profiles/${testUserId}`)
      .send({ full_name: 'Olatunde Abimbola', metadata: { theme: 'dark' } });
    
    expect(putRes.status).toBe(200);
    expect(putRes.body.profile.full_name).toBe('Olatunde Abimbola');

    const getRes = await request(app).get(`/api/profiles/${testUserId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.profile.user_id).toBe(testUserId);
  });

  it('should create and retrieve payment logs successfully', async () => {
    const postRes = await request(app)
      .post('/api/payments')
      .send({ user_id: testUserId, amount: 150.00, currency: 'USD', status: 'completed' });
    
    expect(postRes.status).toBe(201);
    expect(postRes.body.payment.amount).toBe('150.00');

    const getRes = await request(app).get(`/api/payments/${testUserId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.payments.length).toBeGreaterThan(0);
  });
});
