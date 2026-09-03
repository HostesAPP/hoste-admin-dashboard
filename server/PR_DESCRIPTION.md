# PR: Implement Phase 2 - Profile Activation Endpoints + Audit Log

This PR adds the initial server implementation for Phase 2 features focused on Profile Activation review and Audit Log. It creates a new /server folder containing an Express + TypeScript backend scaffold with Prisma ORM.

Summary of changes
- Added /server Express app (TypeScript)
- Prisma schema: Profile, StaffProfile, AuditLog, IdempotencyKey
- Implemented endpoints for Profile Activation review:
  - GET /admin/profiles/activation-queue
  - POST /admin/profiles/:id/approve
  - POST /admin/profiles/:id/reject
  - POST /admin/profiles/:id/suspend
  - POST /admin/profiles/:id/remove
- Simple staff auth middleware (X-Staff-Id + X-Staff-Role headers) for local testing
- All profile mutations write to AuditLog via writeAudit service
- Added server README and .env.example

Checklist / Acceptance criteria
- [ ] server/ contains Express + TypeScript scaffold and README
- [ ] Prisma schema present and migrations can be generated (prisma migrate)
- [ ] GET activation queue returns Pending profiles sorted oldest-first and filterable by profileType
- [ ] ActivationData redaction: activationData field is omitted for callers without activation-review roles
- [ ] Approve action: sets Profile.status to Active and records approvedBy; writes AuditLog
- [ ] Reject action: sets Profile.status to Rejected with mandatory reason; writes AuditLog
- [ ] Suspend action: sets Profile.status to Suspended, sets suspendedUntil; writes AuditLog
- [ ] Remove action: soft-deletes profile (status Deleted) only when confirm=true; writes AuditLog
- [ ] Server-side RBAC middleware protects /admin/profiles routes
- [ ] Unit/integration tests will be added in follow-up PR (not included here)

Notes & Next steps
- This PR provides a minimal functional implementation for local testing. It uses header-based staff auth for now; replace with proper JWT/session-based auth in follow-ups.
- Next PRs to add:
  - Idempotency middleware and persistent store for financial endpoints
  - BullMQ worker to auto-lift suspended profiles
  - Tests (Jest + supertest) and CI integration
  - Notification dispatch (on approve/reject)

Reviewer notes
- To run locally, install dependencies in /server, set DATABASE_URL, run prisma migrate, and start server.
- The code intentionally keeps activationData in DB but redacts it from responses for unauthorized roles (enforced at API layer).

