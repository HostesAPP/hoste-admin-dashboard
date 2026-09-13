export class PrismaClient {
  constructor() {}
  staffProfile = { findFirst: (...args: any[]) => ({ id: 'mock-id' }), findMany: (...args: any[]) => [{ id: 'mock-id' }], create: (...args: any[]) => ({ id: 'mock-id' }), update: (...args: any[]) => ({ id: 'mock-id' }) };
  auditLog = { create: (...args: any[]) => ({ id: 'mock-id' }) };
  profile = { findFirst: (...args: any[]) => ({ id: 'mock-id' }), findMany: (...args: any[]) => [{ id: 'mock-id' }], create: (...args: any[]) => ({ id: 'mock-id' }), update: (...args: any[]) => ({ id: 'mock-id' }) };
  user = { findFirst: (...args: any[]) => ({ id: 'mock-id' }), findMany: (...args: any[]) => [{ id: 'mock-id' }], create: (...args: any[]) => ({ id: 'mock-id' }), update: (...args: any[]) => ({ id: 'mock-id' }) };
  engagement = { findUnique: (...args: any[]) => ({ id: 'mock-id', participants: [], payment: {} }), findMany: (...args: any[]) => [] };
  payout = { create: (...args: any[]) => ({ id: 'mock-id' }) };
  refund = { create: (...args: any[]) => ({ id: 'mock-id' }) };
  idempotencyKey = { 
    findUnique: (...args: any[]) => ({ id: 'mock-id', response: {} }), 
    create: (...args: any[]) => ({ id: 'mock-id' }),
    upsert: (...args: any[]) => ({ id: 'mock-id', response: {} })
  };
  $queryRaw = (...args: any[]) => [];
}

export const prisma = new PrismaClient() as any;
