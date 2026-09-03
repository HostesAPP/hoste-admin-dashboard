# PHASE 2 IMPLEMENTATION (Hosté Admin) — v2.1

This document captures the prioritized implementation plan, acceptance criteria, and task breakdown for Phase 2 based on the provided HOSTÉ Platform Build Spec v2.1 sections 6.2–6.14.

Repository/branch
- Branch: feature/phase-2-admin
- File: /docs/PHASE2-IMPLEMENTATION.md

Selected backend stack (confirmed)
- Runtime: Node.js + TypeScript
- Framework: Express
- ORM: Prisma
- Database: PostgreSQL
- Background jobs: BullMQ + Redis
- Cache: Redis
- Payment provider: Paystack (sandbox + production keys)
- Test: Jest + supertest

High-level approach
- Create a new /server folder in this repo (Express + TypeScript) containing API for /admin/* endpoints.
- Enforce server-side RBAC for all /admin/* endpoints using StaffProfile.staffRole.
- Implement DTO-level redaction: ActivationData, Verification.SubmittedData, ReportDispute.internalNote, Refund.description must never be returned in customer-facing DTOs.
- Implement append-only AuditLog and ensure all admin mutations write synchronously.
- Financial endpoints require idempotency keys and a persistent idempotency store.
- Use Prisma for migrations and schema management. Keep sensitive values out of logs; implement a log sanitizer.

Top priorities (first wave)
1) Core infra & security
   - Server skeleton (Express + TypeScript + ESLint + Jest)
   - Prisma schema baseline + migrations
   - RBAC middleware and staff auth (JWT-based for staff)
   - DTO redaction middleware and logger sanitizer
   - AuditLog service (append-only)
   - Idempotency store & middleware
   - Dev infra: docker-compose for Postgres + Redis + local worker

2) Profile Activation (6.2)
   - DB: Profile.status enum (Pending, Active, Rejected, Suspended, Deleted), suspendedUntil, approvedBy, rejectedReason, deletedAt
   - API: GET /admin/profiles/activation-queue — filter by profileType, sorted oldest-first
   - Actions: POST /admin/profiles/:id/approve, /reject, /suspend, /remove
   - BullMQ worker to auto-lift suspended profiles
   - AuditLog entries on all mutations

3) Verification (6.3)
   - DB: Verification entity with statuses (Pending, Approved_Awaiting_Payment, Active) and SubmittedData (restricted)
   - API endpoints for review queue and approval flow
   - Payment integration (Paystack) to finalize verification upon successful payment
   - Redis cache for Profile.verificationStatus

4) Payments/Payouts/Refunds (6.5)
   - DB: Payments and Payouts include processingFee and commissionAmount; Payout.finalAmount immutable
   - Manual payout endpoint (idempotent) calling Paystack Transfer API
   - Manual refund endpoint restricted to original payment method; admin-only description stored but never customer-facing
   - Payment retry history and CSV export

Deliverables I will add to the repo on this branch
- /docs/PHASE2-IMPLEMENTATION.md (this file)
- Optionally: server skeleton under /server (Express + TypeScript) with initial Prisma schema and CI — confirm before I create

Suggested issue breakdown (epics & top tasks)
- EPIC: Core infra & security
  - server: Initialize Express server + TypeScript + CI
  - db: Prisma schema baseline + migration
  - auth: Staff JWT auth + RBAC middleware for /admin/*
  - audit: Append-only AuditLog service and table
  - security: DTO redaction, logger sanitizer
  - idempotency: persistent idempotency store + middleware

- EPIC: Profile Activation (6.2)
  - db: Profile schema changes
  - api: activation-queue endpoint
  - api: approve/reject/suspend/remove endpoints
  - jobs: BullMQ worker to auto-lift suspensions

- EPIC: Verification (6.3)
  - db: Verification model and migrations
  - api: verification review endpoints
  - payments: Paystack payment intent + webhook to set verification active
  - cache: Redis verificationStatus cache sync

- EPIC: Payments & Payouts (6.5)
  - db: processingFee and commissionAmount fields
  - api: manual payout trigger (idempotent)
  - api: manual refund (admin-only description)
  - ui/api: payment retry history & CSV export

- EPIC: Engagements, Groups, Moderation, Support, Reports, Notifications, PlatformConfig
  - Implement per spec with strong RBAC, audit logging, DTO redaction, and tests.

Estimates (rough)
- Core infra & security: 1–2 weeks
- Profile Activation + Verification + Payments (priority features): 3–6 weeks
- Remaining modules (Engagements, Groups, Support, Reports, Notifications, Settings): 3–6 weeks
- End-to-end Phase 2: ~8–12 developer-weeks (highly dependent on team size and concurrent work)

Acceptance criteria (applies across endpoints)
- RBAC enforced server-side for every /admin/* route.
- Sensitive fields omitted at DTO layer for unauthorized roles.
- All admin mutations write to AuditLog synchronously with staffUserId/staffProfileId/action/entityType/entityId/reason/IP/timestamp.
- Destructive actions require explicit confirmation and non-empty reason checked server-side.
- Idempotency enforced for financial mutations.
- PII (NIN, bank numbers, passwords) are never printed to raw application logs.

Next actions — please confirm (pick one)
- A: Create the server skeleton (/server) now on this branch (Express + TypeScript + Prisma schema skeleton + Docker compose for Postgres/Redis). I will scaffold and push. (recommended)
- B: I only add this PHASE2-IMPLEMENTATION.md (done) and you or your team will create the server separately.

Questions for you (to proceed with A)
1) Do you want the server inside this repository under /server, or do you prefer a separate repository for backend? (default: inside /server)
2) Do you want me to include OpenAPI snippets for the high-priority endpoints and/or a Prisma schema skeleton for core tables when scaffolding? (yes/no)

If you confirm I will proceed to scaffold the server in this branch. If you prefer I stop here, tell me and I will not add more files.

---
File generated by GitHub Copilot Chat Assistant
