PR Title:
chore(issues): add issue markdown for PRD compliance tasks

PR Body:
This PR adds a collection of ready-to-create issue markdown files under .github/ISSUES/ to help the team prioritize and implement PRD v2.1 compliance tasks for the Hosté Admin Dashboard. The files include acceptance criteria, estimates, and test notes, plus starter scaffolding (Prisma snippets, example Express routes, and Jest+Supertest test stubs) to accelerate implementation.

Files added (.github/ISSUES/):
- 0001-implement-payment-model.md
- 0002-add-engagement-models.md
- 0003-idempotent-payout-refund-endpoints.md
- 0004-staff-auth-jwt-otp.md
- 0005-enforce-employmentstatus-rbac.md
- 0006-central-dto-sanitizer.md
- 0007-verification-circle.md
- 0008-openapi-swagger.md
- 0009-pii-logging-and-audit-encryption.md
- 0010-tests-and-ci.md
- 0011-frontend-sidebar-topnav.md
- 0012-badge-counts-and-global-search.md
- README.md (ISSUES usage)
- PR_SUMMARY.md

Scaffolding / examples added:
- tmp/snippets/prisma-payments-engagements.md — Prisma model & enum snippets (payments, payouts, refunds, engagements)
- server/src/routes/admin/payments.example.ts
- server/src/routes/admin/engagements.example.ts
- server/src/routes/auth.example.ts
- server/tests/payments.int.test.ts
- server/tests/profiles.int.test.ts
- server/tests/auth.int.test.ts

Suggested reviewers: SAMCOM-07
Assignee: Paul-masingah
Milestone: enchanment
Labels: Chore

Usage & next steps
1. Review the branch: https://github.com/HostesAPP/hoste-admin-dashboard/tree/chore%2Fadd-issue-markdown
2. For each .github/ISSUES/*.md file, create GitHub Issues by copy/paste (or use an import automation).
3. To integrate scaffolding:
   - Copy Prisma snippet into server/prisma/schema.prisma (merge with existing models) and run migrations.
   - Move example routes into server/src/routes/admin and wire them into server/src/index.ts.
   - Add Jest + Supertest configuration and run the test stubs after configuring test DB/Redis.

CLI command (gh) to open PR (optional):

gh pr create --title "chore(issues): add issue markdown for PRD compliance tasks" \
  --body "$(cat .github/ISSUES/PR_BODY.md)" \
  --base main --head chore/add-issue-markdown \
  --reviewer SAMCOM-07 --assignee Paul-masingah --label Chore --milestone enchanment

If the milestone does not exist, create it first or remove the --milestone flag.