# AGENTS.md — Hosté Admin Dashboard

## 1. Purpose

This file defines the development rules, architecture standards, UI conventions, and implementation principles for the Hosté Admin Dashboard.

**These rules apply to every task, feature, component, page, refactor, and bug fix.**

Before implementing any task:

1. Read and follow this file.
2. Check the relevant section of the Hosté Admin Dashboard PRD v2.0.
3. Follow the existing project structure and established patterns.
4. Reuse existing components/utilities before creating new ones.
5. Keep the implementation simple and backend-ready.

The PRD is the **source of truth for product requirements**.

When a requirement is not explicitly defined by the PRD, follow the existing codebase patterns rather than inventing new behavior.

---

# 2. Core Rules

## 2.1 Use the Design System

All UI must follow the Hosté design system.

### Required theme colors

Use the colors defined in `globals.css` / the project's theme tokens.

**Never hard-code Hosté color codes inside components.**

Do not write:

```tsx
className="bg-[#EF5A22]"
```

```tsx
className="text-[#006837]"
```

```tsx
style={{ color: "#EF5A22" }}
```

Instead, use the existing theme tokens/utilities:

```tsx
className="bg-primary"
```

```tsx
className="text-secondary"
```

Use the project's semantic color variables whenever possible.

### Exception

Hard-coded colors are permitted for **avatar colors defined by mock/data-driven avatar configuration**, when required by the design.

Do not use this exception to hard-code general UI colors.

### General UI rules

Follow the established Hosté design system:

* Background: use theme token
* Primary: Hosté Orange
* Secondary: Hosté Green
* Dark/text: use theme token
* Cards: approximately 16px rounded corners
* Soft shadows where appropriate
* Consistent spacing
* Consistent typography
* Consistent states
* Desktop-first layout
* Minimum supported viewport: 1280px

Do not introduce a new visual style without a clear requirement.

---

# 3. No Over-Engineering

Prefer the **simplest implementation that satisfies the requirement**.

Do not:

* Create abstractions before they are needed.
* Create generic components for one use case.
* Create unnecessary hooks.
* Create unnecessary utility functions.
* Create unnecessary state management.
* Create unnecessary API layers.
* Add libraries without a clear requirement.
* Build functionality that is not in the PRD.
* Add speculative backend behavior.
* Duplicate backend logic in the frontend.

### Before creating an abstraction, ask:

> Is this actually reused, or is it only being used once?

If it is used once, keep it local unless there is a strong architectural reason to extract it.

If the same UI/logic is genuinely reused, create a reusable abstraction.

**Simple and maintainable > clever and complex.**

---

# 4. Required Technology Stack

Use the project's approved stack.

### Core

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### State / Forms / Validation

* Zustand — client/global state where required
* React Hook Form — forms
* Zod — validation

### Data Fetching

* TanStack Query when adopted/required by the project

Do not introduce another state-management or data-fetching library without explicit approval.

### Charts

* Recharts for charts and analytics visualization

### Package Manager

Use:

```bash
pnpm
```

Do not introduce or commit another package manager's lockfile.

Avoid unnecessary dependencies.

---

# 5. Architecture

The project uses **Next.js App Router with feature-based organization**.

Keep Next.js routing inside `app/`.

Feature-specific business/UI code should live inside `features/`.

Example:

```text
src/
├── app/
│   ├── groups/
│   │   ├── page.tsx
│   │   └── [groupId]/
│   │       ├── page.tsx
│   │       └── members/
│   │           └── page.tsx
│   │
│   └── users/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── groups/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── groups.types.ts
│   │   ├── groups.data.ts
│   │   └── index.ts
│   │
│   ├── users/
│   └── reports/
│
├── data/
│   ├── users.data.ts
│   ├── profiles.data.ts
│   ├── groups.data.ts
│   └── engagements.data.ts
│
└── lib/
```

Do not move route files out of `app/` simply to satisfy feature-based architecture.

---

# 6. Naming Conventions

Follow the project's naming convention consistently.

## Files

Use lowercase dot-separated filenames.

Examples:

```text
groups.types.ts
groups.data.ts
groups.utils.ts
groups.hooks.ts
groups.api.ts
group-details.tsx
```

Avoid:

```text
GroupsTypes.ts
groupTypes.ts
Groups.tsx
groupsTypes.ts
```

## Folders

Use lowercase singular module names where appropriate:

```text
group/
user/
report/
support/
```

Use established project patterns when a folder is clearly plural by convention.

## Components

Use PascalCase.

```tsx
export const GroupDetails = () => {}
```

```tsx
export const GroupsSearch = () => {}
```

## Types / Interfaces

Use PascalCase.

```ts
type Group = ...
```

```ts
interface GroupMember {
  ...
}
```

## Variables and Functions

Use camelCase.

```ts
const groupMembers = [];
```

```ts
function getGroupById() {}
```

## Constants

Use UPPER_SNAKE_CASE.

```ts
const MOCK_GROUPS = [];
```

## Enums

Use PascalCase.

```ts
enum GroupStatus {}
```

## Routes

Use kebab-case where applicable.

```text
/audit-log
/profile-activation
```

---

# 7. Component Reusability

Build reusable components where reuse is real.

### Shared components

Components used across multiple features belong in:

```text
components/
```

Examples:

```text
components/
├── ui/
├── shared/
│   ├── data-table.tsx
│   ├── search-input.tsx
│   ├── status-badge.tsx
│   ├── empty-state.tsx
│   ├── error-state.tsx
│   └── page-header.tsx
```

### Feature components

Components specific to one feature belong inside that feature:

```text
features/groups/components/
features/users/components/
features/reports/components/
```

### Extraction rule

Start local/feature-specific.

If a component becomes genuinely useful across multiple features, extract it into shared components.

Do not create duplicate versions of the same component.

Do not create a giant "UniversalComponent" containing unrelated behavior.

---

# 8. Backend-Ready Frontend

Frontend implementation must be structured so that replacing mock data with backend API responses requires **minimal UI changes**.

The UI should not be tightly coupled to mock data.

### Separate data from presentation

Prefer:

```text
components/
hooks/
api/
types/
data/
```

rather than embedding large datasets directly inside components.

Bad:

```tsx
const GroupsPage = () => {
  const groups = [
    {
      id: "1",
      name: "Example Group",
      ...
    }
  ];

  return ...
};
```

Better:

```tsx
const GroupsPage = () => {
  const { data: groups } = useGroups();

  return <GroupsTable groups={groups} />;
};
```

During development, the hook may temporarily use mock data:

```ts
useGroups()
```

Later it can call the backend without requiring the table/page to be rewritten.

---

# 9. Data Contracts

Frontend types should reflect the backend/PRD contract.

Do not invent fields simply because they make the UI easier.

For example, if the backend relationship is:

```text
Group
  └── leaderProfileId
        └── Profile
              └── User
```

Do not change the contract to:

```ts
type Group = {
  leader: Profile;
};
```

unless the backend/API contract explicitly returns that structure.

If the UI needs related information, resolve it through the appropriate data relationship or API response.

### Important

Do not invent:

* API fields
* enum values
* database relationships
* statuses
* permissions
* business rules
* calculations

when they are not defined by the PRD/backend contract.

If something is genuinely unclear, follow existing project conventions or flag the ambiguity rather than silently inventing behavior.

---

# 10. Mock Data Rules

Mock data exists only to unblock frontend development.

It must resemble the expected backend structure.

### Rules

* Use realistic relationships.
* Use consistent IDs.
* Reuse shared entities.
* Do not duplicate the same user/profile unnecessarily.
* Do not create unrelated fake IDs for every feature.
* Keep mock data separate from UI components.
* Keep mock data easy to replace with API calls.

Shared entities should live in shared data where multiple features depend on them.

For example:

```text
src/data/
├── users.data.ts
├── profiles.data.ts
├── groups.data.ts
└── engagements.data.ts
```

Feature-specific mock data may live inside the feature when it is not shared.

---

# 11. API / Data Access Structure

When backend integration is implemented, UI components should not directly contain API request logic.

Prefer:

```text
Component
    ↓
Hook / Query
    ↓
API function
    ↓
Backend
```

Example:

```text
GroupTable
    ↓
useGroups()
    ↓
groups.api.ts
    ↓
GET /groups
```

Avoid:

```tsx
<GroupTable>
  fetch("/api/groups")
</GroupTable>
```

This separation makes backend integration and testing easier.

---

# 12. Loading, Error, and Empty States

Every data-driven section should consider:

* Loading
* Error
* Empty
* Success

Prefer independent states for independent sections.

For example:

```text
Dashboard
├── Stats
│   ├── Loading
│   ├── Error
│   └── Success
│
└── Recent Activity
    ├── Loading
    ├── Error
    └── Success
```

Do not block the entire page because one independent section failed.

Use skeletons that resemble the final UI.

Reuse shared loading, error, and empty-state components where appropriate.

---

# 13. Forms

Use:

* React Hook Form for form state
* Zod for validation
* shadcn/ui form components where applicable

Do not manually manage complex form state with multiple `useState` calls when React Hook Form is appropriate.

Validation should be defined separately from presentation where practical.

---

# 14. Search, Filters, Tables

Use existing shared components/patterns before creating new ones.

### Search

Use an Input/search component.

### Filters

Use a Popover for interactive filter panels/forms.

Use DropdownMenu for action menus/options.

Do not use DropdownMenu as a replacement for every type of filter UI.

### Tables

Tables should be reusable and data-driven.

Avoid putting feature-specific API logic directly inside table components.

---

# 15. State Management

Use the smallest appropriate state solution.

### Local UI state

Use:

```tsx
useState()
```

for local component state.

### Server/API state

Use TanStack Query when adopted.

### Global client state

Use Zustand only when state genuinely needs to be shared globally.

Do not put every piece of state into Zustand.

---

# 16. Permissions and PRD Restrictions

Respect role-based access requirements from the PRD.

Do not expose restricted functionality to roles that should not have access.

However, frontend permission checks are **not a security boundary**.

The backend must ultimately enforce authorization.

Do not invent additional roles or permissions.

---

# 17. Business Logic

Business rules defined by the PRD must be respected.

Do not move backend-owned business logic into the frontend simply because it is convenient.

Examples include:

* Commission calculations
* Payment calculations
* Refund rules
* Payout calculations
* Moderation triggers
* Permission enforcement
* Audit-log creation
* Status transitions

The frontend should display backend-provided results unless the PRD explicitly requires client-side computation.

---

# 18. PRD Compliance

Before implementing a feature, identify:

1. Relevant PRD section.
2. Required page(s).
3. Required actions.
4. Required data.
5. Required roles/permissions.
6. Required states.
7. Required relationships.
8. Required restrictions.

Do not implement functionality outside the requested scope unless it is necessary for the feature.

The PRD takes precedence over assumptions.

---

# 19. Existing Components First

Before creating a new component, check:

```text
components/ui/
components/shared/
features/<current-feature>/components/
```

Ask:

> Does an existing component already solve this?

If yes, reuse it.

If it needs a small extension, prefer extending it over creating a duplicate.

If the existing component is truly unsuitable, create a new component following the same design and naming conventions.

---

# 20. Styling Rules

Prefer Tailwind CSS and existing design tokens.

Do not introduce unnecessary CSS files.

Do not duplicate styles across components.

Do not hard-code:

* Brand colors
* Theme colors
* Repeated spacing values
* Repeated typography styles

when an existing token/component/class already exists.

Use `globals.css` and theme variables as the source of truth for the design system.

---

# 21. Dependencies

Before installing a package, ask:

1. Is it already available?
2. Can the existing stack solve the problem?
3. Is the package necessary?
4. Does it introduce unnecessary complexity?
5. Is it compatible with the current project?

Use `pnpm`.

Do not install dependencies merely because they are popular.

---

# 22. Performance

Keep implementations reasonably performant without premature optimization.

Prefer:

* Server Components where appropriate.
* Client Components only when client-side functionality is required.
* Efficient list rendering.
* Appropriate memoization only when useful.
* Pagination for large datasets when supported.
* TanStack Query for server-state caching when adopted.

Do not add optimization techniques without a demonstrated need.

---

# 23. Accessibility

Interactive UI should be accessible.

Ensure:

* Buttons are actual buttons.
* Links are actual links.
* Inputs have labels or accessible names.
* Dialogs/popovers are keyboard accessible.
* Focus states are preserved.
* Images have appropriate alt text.
* Color is not the only indicator of state.

Prefer accessible shadcn/ui primitives.

---

# 24. Responsive Behavior

The Admin Dashboard is desktop-first with a minimum target viewport of 1280px.

Follow the approved design.

Do not redesign the application for mobile unless explicitly required.

When responsive behavior is required, implement it consistently with the existing layout.

---

# 25. Git / Code Quality

Keep changes focused.

A task should not unnecessarily modify unrelated files.

Do not:

* Rewrite working code without reason.
* Reformat unrelated files.
* Rename unrelated components.
* Change dependencies unnecessarily.
* Mix unrelated features into one change.

Before completing a task:

* Check TypeScript errors.
* Check lint errors.
* Check build errors when appropriate.
* Review changed files.
* Remove unused imports/code.
* Confirm the implementation follows this file and the PRD.

---

# 26. Definition of Done

Before considering any task complete, perform this checklist.

### PRD

* [ ] Relevant PRD section was checked.
* [ ] Required functionality is implemented.
* [ ] No unrequested functionality was added.
* [ ] Required roles/permissions are respected.
* [ ] Backend-owned business rules were not incorrectly moved into the frontend.

### Design

* [ ] `globals.css` theme tokens are used.
* [ ] No hard-coded Hosté color codes.
* [ ] Avatar data is the only intentional exception where applicable.
* [ ] Existing UI patterns are reused.
* [ ] Loading, error, empty, and success states are considered.
* [ ] UI matches the Hosté design system.

### Architecture

* [ ] Code is in the correct `app/`, `features/`, `components/`, `data/`, or `lib/` location.
* [ ] Naming conventions are followed.
* [ ] Existing reusable components were checked first.
* [ ] No unnecessary abstractions were introduced.
* [ ] No duplicated components were created.

### Backend Readiness

* [ ] Types reflect the expected backend contract.
* [ ] Mock data is separate from presentation.
* [ ] IDs and relationships are consistent.
* [ ] API/data access can be introduced without rewriting the UI.
* [ ] Components receive data through props/hooks rather than owning data-fetching logic.

### Technology

* [ ] Approved stack is used.
* [ ] No unnecessary dependency was added.
* [ ] pnpm is used.
* [ ] Recharts is used for charts where applicable.
* [ ] React Hook Form + Zod are used for appropriate forms.

### Quality

* [ ] TypeScript passes.
* [ ] Lint passes.
* [ ] No unused code/imports remain.
* [ ] No unrelated files were changed.
* [ ] Implementation is as simple as reasonably possible.

---

# 27. Final Agent Instruction

**Do not start coding immediately.**

For every task:

### Step 1 — Understand

Identify the relevant PRD requirement and existing project patterns.

### Step 2 — Inspect

Check existing components, types, utilities, mock data, and architecture before creating new ones.

### Step 3 — Plan

Choose the simplest implementation that satisfies the requirement.

### Step 4 — Implement

Use the approved stack, theme tokens, naming conventions, and reusable components.

### Step 5 — Backend-readiness check

Ensure the UI is separated from mock data and can consume API data later with minimal changes.

### Step 6 — Verify

Check TypeScript, lint, imports, states, responsiveness, permissions, and PRD compliance.

### Step 7 — Clean up

Remove unnecessary code, abstractions, dependencies, and unrelated changes.

**The goal is not to produce the most code. The goal is to produce the cleanest implementation that satisfies the PRD and can evolve naturally into the production backend.**


# Screen Size & Responsive Design

The Hosté Admin Dashboard is a **desktop-first, desktop-only application**.

### Rules

* The approved design target starts at a **minimum viewport width of 1280px**.
* All page designs and implementations should be created for **1280px screens and larger**.
* **Do not create separate mobile or tablet designs.**
* **Do not design additional small-screen layouts** unless explicitly requested by the product/design team.
* Do not spend implementation effort optimizing the Admin Dashboard for screen widths below 1280px.
* The desktop design is the source of truth for layout, spacing, sizing, navigation, tables, forms, cards, and other UI elements.
* The interface should remain consistent as the viewport grows beyond 1280px.
* Responsive utilities may be used where necessary to prevent layout issues on larger desktop screens, but they should not be used to create a separate mobile/tablet experience.
* Do not introduce mobile navigation, mobile-specific components, stacked mobile layouts, or other responsive redesigns unless explicitly required.

### Important

**1280px is the minimum supported viewport for the Hosté Admin Dashboard.**

The goal is to accurately implement the approved desktop experience — **not to make the Admin Dashboard responsive for mobile or tablet devices.**
