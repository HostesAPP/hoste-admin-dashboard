import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { idempotencyMiddleware } from '../../middleware/idempotency';
import { requireRoles } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /admin/payments/manual-payout
router.post('/manual-payout', requireRoles(['FINANCE','SUPER_ADMIN']), idempotencyMiddleware, async (req: Request, res: Response) => {
  const { engagementId, reason } = req.body;
  if (!engagementId || !reason) return res.status(400).json({ error: 'engagementId and reason required' });

  // 1) create Payout row (mark finalAmount)
  // 2) call Paystack Transfer API idempotently from a service
  // 3) write AuditLog

  // Example placeholder
  const payout = await prisma.payout.create({ data: { referenceId: `PYO-${Date.now()}`, engagementId, amount: 0, processingFee: 0, finalAmount: 0, status: 'pending' } });

  res.json({ data: payout });
});

// POST /admin/payments/manual-refund
router.post('/manual-refund', requireRoles(['FINANCE','SUPER_ADMIN']), idempotencyMiddleware, async (req: Request, res: Response) => {
  const { paymentId, amount, description } = req.body;
  if (!paymentId || !amount) return res.status(400).json({ error: 'paymentId and amount required' });

  // Validate original payment method and enforce destination = original
  // Create Refund row (store admin-only description)
  // Call Paystack refund API idempotently

  const refund = await prisma.refund.create({ data: { referenceId: `REF-${Date.now()}`, paymentId, amount, destination: 'original', processingFee: 0, description } });

  res.json({ data: refund });
});

export default router;
