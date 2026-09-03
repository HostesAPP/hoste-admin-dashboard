import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendOtpEmail, OtpService } from '../../services/otp';

const router = express.Router();
const prisma = new PrismaClient();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  // Verify staff credentials (hash compare) - example placeholder
  const staff = await prisma.staffProfile.findFirst({ where: { /* link to user email */ } });
  if (!staff) return res.status(401).json({ error: 'invalid' });

  // generate OTP and send via email
  const otp = OtpService.generateOtpForStaff(staff.id, email);
  await sendOtpEmail(email, otp);

  res.json({ message: 'OTP sent' });
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { staffId, otp } = req.body;
  // validate OTP, issue JWT access + refresh
  res.json({ accessToken: '...', refreshToken: '...' });
});

export default router;