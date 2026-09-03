import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { writeAudit } from '../services/auditLog';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const queueName = 'suspension-lift-queue';
const queue = new Queue(queueName, { connection });
const prisma = new PrismaClient();

async function scheduleRepeatJob() {
  // Add a repeatable job that runs every minute
  await queue.add('auto-lift', { triggeredAt: new Date().toISOString() }, { repeat: { cron: '*/1 * * * *' } });
  console.log('Scheduled repeatable auto-lift job (every minute)');
}

async function processJob(job: Job) {
  console.log('Processing auto-lift job:', job.id, job.name, new Date().toISOString());

  const now = new Date();
  // find suspended profiles whose suspendedUntil has passed
  const suspended = await prisma.profile.findMany({
    where: {
      status: 'Suspended',
      suspendedUntil: { lte: now },
    },
  });

  if (!suspended || suspended.length === 0) {
    console.log('No suspended profiles to lift at', now.toISOString());
    return;
  }

  console.log(`Found ${suspended.length} suspended profiles to lift`);

  for (const p of suspended) {
    try {
      // Update profile to Active and clear suspendedUntil
      const updated = await prisma.profile.update({
        where: { id: p.id },
        data: {
          status: 'Active',
          suspendedUntil: null,
        },
      });

      // Write audit log: auto-lift by system
      await writeAudit(prisma, {
        staffUserId: null,
        staffProfileId: null,
        action: 'auto_lift_suspension',
        entityType: 'Profile',
        entityId: updated.id,
        description: `Auto-lifted suspension for profile ${updated.id} at ${new Date().toISOString()}`,
        ip: null,
      });

      console.log(`Auto-lifted profile ${updated.id}`);
    } catch (err) {
      console.error('Error auto-lifting profile', p.id, err);
    }
  }
}

async function runWorker() {
  await scheduleRepeatJob();

  const worker = new Worker(queueName, async (job: Job) => {
    await processJob(job);
  }, { connection });

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
  });

  console.log('Suspension worker started');
}

runWorker().catch((err) => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
