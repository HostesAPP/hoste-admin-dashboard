import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * Idempotency middleware:
 * - If request contains header 'Idempotency-Key', the middleware will attempt to
 *   return a stored response for that key.
 * - If no stored response exists, it will create a placeholder record (if possible),
 *   let the request proceed, capture the response body/status, and persist it to the DB.
 *
 * Notes:
 * - This middleware is generic and should be applied to endpoints which must be idempotent.
 * - It does not block requests without the header.
 */

export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = (req.header('Idempotency-Key') || req.header('idempotency-key')) as string | undefined;
  if (!key) return next();

  const prisma: PrismaClient | undefined = req.prisma as any;
  if (!prisma) return next();

  let handled = false;

  const finish = async (status: number, body: any) => {
    try {
      await prisma.idempotencyKey.upsert({
        where: { key },
        create: { key, response: { status, body } },
        update: { response: { status, body } },
      });
    } catch (err) {
      console.error('Failed to persist idempotency response', err);
    }
  };

  (async () => {
    try {
      const existing = await prisma.idempotencyKey.findUnique({ where: { key } });
      if (existing && existing.response) {
        handled = true;
        const stored: any = existing.response as any;
        res.status(stored.status || 200).json(stored.body);
        return;
      }

      // create placeholder if not exists
      if (!existing) {
        try {
          await prisma.idempotencyKey.create({ data: { key } });
        } catch (err) {
          // ignore duplicate key errors - someone else created it concurrently
        }
      }

      // capture response
      const oldJson = res.json.bind(res);
      const oldSend = res.send.bind(res);

      res.json = (body: any) => {
        if (!handled) {
          handled = true;
          finish(res.statusCode || 200, body);
        }
        return oldJson(body);
      };

      res.send = (body: any) => {
        if (!handled) {
          handled = true;
          // try to parse JSON body
          let parsed = body;
          try {
            if (typeof body === 'string') parsed = JSON.parse(body);
          } catch (e) {
            parsed = body;
          }
          finish(res.statusCode || 200, parsed);
        }
        return oldSend(body);
      };

      next();
    } catch (err) {
      console.error('Idempotency middleware error', err);
      next();
    }
  })();
}
