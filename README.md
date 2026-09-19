# Hoste Admin Dashboard
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hoste's web-based admin dashboard for platform management and administration.

## Overview

The Hoste Admin Dashboard is a comprehensive TypeScript-based web application (built with Next.js 16 and React 19) designed to provide administrators with powerful tools to manage and oversee the Hoste platform. This dashboard offers an intuitive interface for handling platform administration, user management, bookings, financial operations, content management, and operational oversight.

## Features

- 🔐 Secure admin authentication and session management
- 📊 Real-time platform monitoring, KPIs, and revenue analytics
- 📅 **Bookings & Engagements:** Full booking lifecycle tracking, status management, date range filters, and detail lookup (`/bookings`)
- 🤝 **Referrals & Rewards:** Referral code tracking, invite conversion status, reward payments, and CSV export (`/referrals`)
- 🔔 **Notifications & Dispatches:** System/user alert feeds, retry mechanisms, and administrative broadcast creation (`/notifications`)
- 📝 **Blog Management:** Article creation, status workflows (Draft, Scheduled, Published), cover image uploads, and post management (`/blog`)
- 🖼️ **Promotional Banners:** Web and mobile hero slides, placement targeting, priority ordering, and active toggles (`/banners`)
- 🛡️ **Content & Account Moderation:** Review queue for reported listings, profile infractions, and active suspensions (`/moderation`)
- ⚙️ **Settings & Administration:** Multi-tab platform configuration IA covering General, User & Access (Create/Invite Admin flow), Hosté Management, Bookings & Groups, Payments & Finance, Notifications, Content, Security, and System Settings with Audit Logs (`/settings`)
- 👥 User, Group, and Account Management (`/users`, `/groups`)
- 🎫 Support Ticket Escalation and Customer Support Live Chat (`/support-tickets`, `/customer-support`)

## Tech Stack

- **Language:** TypeScript
- **Frontend Framework:** Next.js 16 (App Router) + React 19
- **UI & Styling:** Tailwind CSS v4, Lucide React icons, shadcn/ui, @base-ui/react primitives
- **Backend API:** Express.js + TypeScript (`server/` directory)
- **Database:** PostgreSQL (with Prisma ORM and native `pg` access)
- **Package Manager:** pnpm
- **License:** MIT

## Project Structure

```
hoste-admin-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes (sign-in, forgot-password, etc.)
│   │   └── (dashboard)/        # Dashboard layout & protected admin routes
│   │       ├── page.tsx        # Overview dashboard
│   │       ├── banners/        # Promotional banners management
│   │       ├── blog/           # Blog posts management
│   │       ├── bookings/       # Bookings list & detail pages
│   │       ├── customer-support/ # Live customer conversations
│   │       ├── groups/         # Hosté groups & member delegation
│   │       ├── moderation/     # Content & infraction review queue
│   │       ├── notifications/  # Notifications & admin broadcast dispatch
│   │       ├── payments/       # Payments & payouts lifecycle
│   │       ├── profiles/       # Profiles & activation queue
│   │       ├── referrals/      # Referral links & reward payouts
│   │       ├── reports/        # Analytics & business reports
│   │       ├── revenue/        # Platform revenue aggregation
│   │       ├── settings/       # Multi-tab platform settings & Admin creation
│   │       ├── support-tickets/ # Support ticket escalations
│   │       └── users/          # Users & RBAC role administration
│   ├── components/             # Shared UI & layout components
│   │   ├── layout/             # Sidebar, Header, Global Layout
│   │   └── ui/                 # Reusable UI primitives
│   ├── features/               # Feature-based domain modules
│   │   ├── banners/            # Banners types, hooks, mock data
│   │   ├── blog/               # Blog types & data handlers
│   │   ├── bookings/           # Bookings types, hooks, views
│   │   ├── notifications/      # Notifications types & dispatches
│   │   ├── referrals/          # Referrals types & stats
│   │   ├── settings/           # Platform settings types & defaults
│   │   └── ...                 # Other domain modules
│   └── lib/                    # Shared utility functions
├── server/                     # Express backend API & Prisma models
└── README.md                   # Project documentation
```

## Dashboard Navigation Structure

The sidebar navigation follows the canonical ordering specified in UI/UX Alignment Patch v2.3:

1. **Overview** (`/`)
2. **Profiles** (`/profiles`)
3. **Payments & Payouts** (`/payments`)
4. **Groups** (`/groups`)
5. **Referrals** (`/referrals`)
6. **Users** (`/users`)
7. **Reports** (`/reports`)
8. **Notifications** (`/notifications`)
9. **Support Tickets** (`/support-tickets`)
10. **Customer Support** (`/customer-support`)
11. **Blog** (`/blog`)
12. **Banners** (`/banners`)
13. **Moderation** (`/moderation`)
14. **Settings** (`/settings`)
15. **Audit Log** (`/settings?tab=system-settings`)

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm (v10 or higher)
- Docker & Docker Compose (for local database & Redis)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/HostesAPP/hoste-admin-dashboard.git
cd hoste-admin-dashboard
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Start the local development server:**
```bash
pnpm dev
# Frontend runs on http://localhost:3000
```

## Development Commands

```bash
# Start Next.js development server
pnpm dev

# Build for production (TypeScript check + Static route generation)
pnpm build

# Start production server
pnpm start

# Lint codebase (ESLint 9)
pnpm eslint src
```

## Settings Information Architecture

The `/settings` route features a nested sub-section architecture:

- **General:** Currency (NGN/USD/GBP), Timezone, Support contact.
- **User & Access:** Create/Invite Admin flow, Staff Role assignment (`SUPER_ADMIN`, `ADMIN`, `FINANCE`, `SUPPORT`, `MODERATOR`), and Active Admin directory.
- **Hosté Management:** Onboarding & NIN/CAC identity verification requirements.
- **Bookings & Groups:** Member limits and grace period configs.
- **Payments & Finance:** Platform service fee percentage, referral reward amounts, escrow lock days.
- **Notifications:** Delivery channel toggles (Email, Push, SMS).
- **Platform Content:** Banner hero rules & blog default author configs.
- **Security:** Mandatory 2FA enforcement for administrators.
- **System Settings:** System maintenance mode and embedded Audit Logs feed.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes and commit using clean commit messages
4. Ensure `pnpm build` and `pnpm eslint src` pass without errors
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Repository:** [HostesAPP/hoste-admin-dashboard](https://github.com/HostesAPP/hoste-admin-dashboard)  
**Last Updated:** September 19, 2026
**Status:** Active Development
