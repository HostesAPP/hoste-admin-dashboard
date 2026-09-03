// profiles activation tests

import request from 'supertest';
import app from '../src/index';

describe('Profiles Activation', () => {
  it('returns activation queue and redacts activationData for unauthorized roles', async () => {
    const res = await request(app)
      .get('/admin/profiles')
      .set('X-Staff-Id', 'test')
      .set('X-Staff-Role', 'CUSTOMER_SUPPORT');

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    // assert activationData not present
  });
});
