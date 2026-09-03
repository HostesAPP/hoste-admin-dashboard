import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import profilesRouter from '../routes/admin/profiles';

describe('Idempotency middleware', () => {
  let app: express.Express;
  let mockPrisma: any;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());

    const store: Record<string, any> = {};

    mockPrisma = {
      idempotencyKey: {
        findUnique: jest.fn(async ({ where: { key } }) => store[key] ? store[key] : null),
        create: jest.fn(async ({ data: { key } }) => { store[key] = { key }; return store[key]; }),
        upsert: jest.fn(async ({ where: { key }, create, update }) => { store[key] = { key, response: update.response }; return store[key]; }),
      },
      profile: {
        update: jest.fn(async ({ where }) => ({ id: where.id, status: 'Active' })),
      },
      auditLog: {
        create: jest.fn(async () => ({})),
      },
    };

    app.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      next();
    });

    // inject idempotency middleware
    const { idempotencyMiddleware } = require('../middleware/idempotency');
    app.use(idempotencyMiddleware);

    // set req.staff for route
    app.use((req: any, res, next) => { req.staff = { id: 's1', role: 'VERIFICATION_OFFICER' }; next(); });

    app.use('/admin/profiles', profilesRouter);
  });

  test('replays stored response when Idempotency-Key present', async () => {
    const key = 'abc-123';
    // pre-populate store with response
    const stored = { key, response: { status: 200, body: { data: { id: 'p1', status: 'Active' } } } };
    // set via create
    await mockPrisma.idempotencyKey.create({ data: { key } });
    await mockPrisma.idempotencyKey.upsert({ where: { key }, create: { key }, update: { response: stored.response } });

    const res = await request(app).post(`/admin/profiles/p1/approve`).set('Idempotency-Key', key);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('p1');
  });

  test('stores response when key absent and subsequent call replays', async () => {
    const key = 'unique-456';
    const res1 = await request(app).post(`/admin/profiles/p2/approve`).set('Idempotency-Key', key);
    expect(res1.status).toBe(200);
    expect(res1.body.data.id).toBe('p2');

    // second call should replay stored response
    const res2 = await request(app).post(`/admin/profiles/p2/approve`).set('Idempotency-Key', key);
    expect(res2.status).toBe(200);
    expect(res2.body.data.id).toBe('p2');
  });
});
