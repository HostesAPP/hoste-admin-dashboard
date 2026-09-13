import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      prisma?: PrismaClient;
      staff?: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

export {};
