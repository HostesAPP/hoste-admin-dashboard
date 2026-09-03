import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import profilesRouter from '../routes/admin/profiles';

describe('Profile Activation API', () => {
  let app: express.Express;
  let mockPrisma: any;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());

    mockPrisma = {
      profile: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    };

    // middleware to attach mock prisma and staff
    app.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      next();
    });

    // mount router without role restriction for testing; the router itself will check req.staff
    app.use('/admin/profiles', (req: any, res, next) => {
      // pass-through middleware to set req.staff based on test
      next();
    }, profilesRouter);
  });

  test('GET /admin/profiles redacts activationData for unauthorized roles', async () => {
    mockPrisma.profile.findMany.mockResolvedValue([
      {
        id: 'p1',
        name: 'Alice',
        attributes: { city: 'Lagos' },
        activationData: { nin: '12345' },
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
    ]);

    // create an app wrapper that sets req.staff to CUSTOMER_SUPPORT
    const wrapper = express();
    wrapper.use(bodyParser.json());
    wrapper.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      req.staff = { id: 's1', role: 'CUSTOMER_SUPPORT' };
      next();
    });
    wrapper.use('/admin/profiles', profilesRouter);

    const res = await request(wrapper).get('/admin/profiles');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].activationData).toBeUndefined();
  });

  test('GET /admin/profiles includes activationData for verification role', async () => {
    mockPrisma.profile.findMany.mockResolvedValue([
      {
        id: 'p1',
        name: 'Alice',
        attributes: { city: 'Lagos' },
        activationData: { nin: '12345' },
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
    ]);

    const wrapper = express();
    wrapper.use(bodyParser.json());
    wrapper.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      req.staff = { id: 's2', role: 'VERIFICATION_OFFICER' };
      next();
    });
    wrapper.use('/admin/profiles', profilesRouter);

    const res = await request(wrapper).get('/admin/profiles');
    expect(res.status).toBe(200);
    expect(res.body.data[0].activationData).toBeDefined();
    expect(res.body.data[0].activationData.nin).toBe('12345');
  });

  test('POST /admin/profiles/:id/approve updates profile and writes audit log', async () => {
    mockPrisma.profile.update.mockResolvedValue({ id: 'p1', status: 'Active', activationData: { nin: 'xxx' }, approvedBy: 's2' });
    mockPrisma.auditLog.create.mockResolvedValue({ id: 'a1' });

    const wrapper = express();
    wrapper.use(bodyParser.json());
    wrapper.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      req.staff = { id: 's2', role: 'VERIFICATION_OFFICER' };
      next();
    });
    wrapper.use('/admin/profiles', profilesRouter);

    const res = await request(wrapper).post('/admin/profiles/p1/approve');
    expect(res.status).toBe(200);
    expect(mockPrisma.profile.update).toHaveBeenCalledWith({ where: { id: 'p1' }, data: { status: 'Active', approvedBy: 's2' } });
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    expect(res.body.data.status).toBe('Active');
  });

  test('POST /admin/profiles/:id/reject requires reason', async () => {
    mockPrisma.profile.update.mockResolvedValue({ id: 'p1', status: 'Rejected', rejectedReason: 'x' });
    mockPrisma.auditLog.create.mockResolvedValue({ id: 'a1' });

    const wrapper = express();
    wrapper.use(bodyParser.json());
    wrapper.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      req.staff = { id: 's3', role: 'MODERATOR' };
      next();
    });
    wrapper.use('/admin/profiles', profilesRouter);

    const res = await request(wrapper).post('/admin/profiles/p1/reject').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /admin/profiles/:id/suspend requires suspendedUntil and writes audit', async () => {
    mockPrisma.profile.update.mockResolvedValue({ id: 'p1', status: 'Suspended', suspendedUntil: new Date().toISOString() });
    mockPrisma.auditLog.create.mockResolvedValue({ id: 'a2' });

    const wrapper = express();
    wrapper.use(bodyParser.json());
    wrapper.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      req.staff = { id: 's4', role: 'SUPER_ADMIN' };
      next();
    });
    wrapper.use('/admin/profiles', profilesRouter);

    const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const res = await request(wrapper).post('/admin/profiles/p1/suspend').send({ suspendedUntil: until });
    expect(res.status).toBe(200);
    expect(mockPrisma.profile.update).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    expect(res.body.data.status).toBe('Suspended');
  });

  test('POST /admin/profiles/:id/remove requires confirm', async () => {
    mockPrisma.profile.update.mockResolvedValue({ id: 'p1', status: 'Deleted', deletedAt: new Date().toISOString() });
    mockPrisma.auditLog.create.mockResolvedValue({ id: 'a3' });

    const wrapper = express();
    wrapper.use(bodyParser.json());
    wrapper.use((req: any, _res, next) => {
      req.prisma = mockPrisma;
      req.staff = { id: 's5', role: 'SUPER_ADMIN' };
      next();
    });
    wrapper.use('/admin/profiles', profilesRouter);

    const res = await request(wrapper).post('/admin/profiles/p1/remove').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();

    const res2 = await request(wrapper).post('/admin/profiles/p1/remove').send({ confirm: true });
    expect(res2.status).toBe(200);
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    expect(res2.body.data.status).toBe('Deleted');
  });
});
