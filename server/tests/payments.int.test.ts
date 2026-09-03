// Example Jest + Supertest integration test stubs

import request from 'supertest';
import app from '../src/index';

describe('Payments API', () => {
  it('should create a payout and return 200', async () => {
    const res = await request(app)
      .post('/admin/payments/manual-payout')
      .set('X-Staff-Id', 'test')
      .set('X-Staff-Role', 'FINANCE')
      .send({ engagementId: 'eng-123', reason: 'manual trigger' });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
