# Hoste Admin Server (Express + TypeScript)

This folder contains the backend API scaffolding for Phase 2 features (Profile Activation + Audit Log).

Run locally (after installing dependencies):

1. Copy .env.example to .env and set DATABASE_URL and other env vars.
2. Start Postgres and Redis (e.g., docker-compose).
3. Install dependencies: pnpm install or npm install
4. Generate Prisma client: pnpm prisma generate
5. Run migrations: pnpm prisma migrate dev --name init
6. Start dev server: pnpm dev

Endpoints implemented in this commit:
- GET /admin/profiles/activation-queue
- POST /admin/profiles/:id/approve
- POST /admin/profiles/:id/reject
- POST /admin/profiles/:id/suspend
- POST /admin/profiles/:id/remove

Auth: Simplified header-based staff role for local testing. Provide X-Staff-Id and X-Staff-Role headers.

AuditLog: All profile mutations write to AuditLog synchronously.
