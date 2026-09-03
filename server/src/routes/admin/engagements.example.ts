import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireRoles } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /admin/engagements
router.get('/', requireRoles(['SUPER_ADMIN','OPERATIONS','CUSTOMER_SUPPORT']), async (req, res) => {
  const { referenceId, clientId, providerId, page = 1, limit = 20 } = req.query as any;

  const where: any = {};
  if (referenceId) where.referenceId = referenceId;
  // add other filters

  const engagements = await prisma.engagement.findMany({ where, take: limit, skip: (page-1)*limit });
  res.json({ data: engagements });
});

// GET /admin/engagements/:id/timeline
router.get('/:id/timeline', requireRoles(['SUPER_ADMIN','OPERATIONS','CUSTOMER_SUPPORT']), async (req, res) => {
  const { id } = req.params;
  // Query engagement, payments, payouts, refunds, participants
  const engagement = await prisma.engagement.findUnique({ where: { id }, include: { participants: true, payment: true } });
  res.json({ data: engagement });
});

export default router;