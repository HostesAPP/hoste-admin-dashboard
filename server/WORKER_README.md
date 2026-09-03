# Suspension Worker

This worker runs a repeatable job every minute to auto-lift suspended profiles whose suspendedUntil has passed. It uses BullMQ and Redis.

Start the worker locally:

1. Ensure Redis is running and REDIS_URL is set in server/.env
2. From the server folder run: npm run worker

Behavior
- Query profiles where status = 'Suspended' and suspendedUntil <= now
- For each matched profile: set status = 'Active', suspendedUntil = null, and write an AuditLog entry recording the auto-lift

Notes
- This worker is idempotent: if two workers run concurrently, the profile updates are guarded by the database update and subsequent audit log.
