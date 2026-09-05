# PR Validation & Testing Checklist — Hoste Admin Dashboard

This repository-specific checklist helps contributors and reviewers validate PRs for Hoste Admin Dashboard before merging.

How to use
- Authors: complete Author Checklist and include the PR template in the PR body.
- Reviewers: verify items, run listed repo-specific commands, and sign off.

Author checklist (before requesting review)
- [ ] Use branch naming convention and branch off the latest base branch.
- [ ] Update PR title and body using the PR template below.
- [ ] Add or update tests for new behavior. Server tests live in /server and use Jest.
- [ ] Run server and frontend tests locally:
  - Frontend (Next.js): pnpm dev (for manual testing); tests: see project scripts (root package.json does not include `test` — run server tests and add frontend tests as needed)
  - Server: cd server && pnpm test
- [ ] Run linters and formatters:
  - Root lint: pnpm lint
  - (Add/prefer a formatting step if configured — repo currently lists `pnpm format` in README but no script in package.json; consider adding if missing.)
- [ ] Ensure no secrets or .env values are committed. Use .env.local and server/.env.
- [ ] If database changes: add Prisma migration files and test locally.
  - cd server && pnpm prisma generate
  - cd server && pnpm prisma migrate dev --name <migration_name>
- [ ] If using Docker for local dependencies, verify docker-compose up works: docker-compose up -d
- [ ] Update README/CHANGELOG if behavior changes or new setup steps are required.

Reviewer checklist (quick)
- [ ] PR scope is limited and reviewable.
- [ ] Description explains what, why, and how to test.
- [ ] Server tests pass locally and in CI (if configured).
- [ ] Linting passes: pnpm lint
- [ ] No secrets present and environment variables documented.
- [ ] Database migrations reviewed for safety and rollback.
- [ ] Verify ports and endpoints if running locally (frontend: http://localhost:3000, backend: http://localhost:5000 per README).
- [ ] For UI changes: validate accessibility basics (keyboard, labels, contrast).

Repository-specific commands (run locally)
- Install dependencies: pnpm install
  - Alternative: npm install or yarn install (pnpm recommended by repo)
- Start frontend (Next.js): pnpm dev
- Build frontend: pnpm build
- Start production server: pnpm start
- Server (backend) dev: cd server && pnpm dev
- Server build: cd server && pnpm build
- Server start: cd server && pnpm start
- Generate Prisma client: cd server && pnpm prisma:generate || pnpm prisma generate
- Run Prisma migrations: cd server && pnpm prisma:migrate || pnpm prisma migrate dev --name <name>
- Run server tests: cd server && pnpm test

Notes about scripts
- The repository README references scripts such as `pnpm test`, `pnpm format`, and `pnpm lint` — root package.json includes `dev`, `build`, `start`, and `lint` (eslint). Confirm and add any missing npm scripts (e.g., `test`, `format`) if desired.

CI / GitHub Actions
- I did not detect any workflows under .github/workflows in this repo. It's recommended to configure GitHub Actions to run at minimum:
  - Install dependencies (pnpm install)
  - Lint (pnpm lint)
  - Server tests (cd server && pnpm test)
  - Build (pnpm build) to ensure Next.js compiles
  - Prisma generate/migration checks as needed
  - Dependency/security scan (npm audit / Dependabot / Snyk)

Local testing matrix (suggested)
- Unit tests: server (Jest) for API logic and controllers
- Integration tests: supertest for API endpoints (server)
- Smoke tests: build and start server and hit basic endpoints
- E2E: none configured — consider adding Playwright/Cypress for critical admin flows

Database & migrations
- Use Prisma for migrations. Before merging migrations:
  - Ensure migration is backward compatible or include migration notes
  - Test migration locally against a copy of production schema if possible
  - Document rollback steps

Docker
- Dockerfile and docker-compose usage is documented in README.
- Test docker build: docker build -t hoste-admin-dashboard .
- Run with compose: docker-compose up

Security & secrets
- Never commit .env or .env.local. Ensure .gitignore excludes local env files.
- Scan new dependencies for vulnerabilities before merging.

PR description template (paste into PR body)
Title: <type(scope): short summary>

Body:
- What: Short description of the change.
- Why: Why this change is needed.
- How: High-level approach taken.
- Testing:
  - Server unit tests: cd server && pnpm test
  - Manual: steps to reproduce and expected results (endpoints, UI flows)
- Database migrations: list migration files and rollback plan
- Rollout/rollback plan:
- Related issues/PRs:

Checklist (authors should copy/mark relevant items above)

Example PR body
- What: Add server-side validation for profile approval endpoints.
- Why: Prevent invalid payloads and improve audit logs.
- How: Add Zod validation in controllers, add unit tests and integration tests.
- Testing:
  - cd server && pnpm test
  - Manual: POST /admin/profiles/:id/approve with invalid payload -> 400
- Migrations: none

Maintainer merge criteria
- At least one approving review from a maintainer or code owner.
- CI (if enabled) green for required jobs.
- No unresolved security or secrets issues.
- Migrations and deploy impacts assessed.

Next steps I can take
- Add this file to the branch `add/pr-validation-checklist` (created) and push the change to the repository.
- Optionally create a recommended GitHub Actions workflow PR that runs the commands above.

---
Generated for HostesAPP/hoste-admin-dashboard
