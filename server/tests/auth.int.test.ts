// auth flow tests

import request from 'supertest';
import app from '../src/index';

describe('Auth flow', () => {
  it('should request OTP on login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'staff@example.com', password: 'password' });

    expect(res.status).toBe(200);
  });
});
