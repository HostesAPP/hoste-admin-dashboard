# Hoste Admin Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hoste's web-based admin dashboard for platform management and administration.

## Overview

The Hoste Admin Dashboard is a comprehensive TypeScript-based web application (built with Next.js) designed to provide administrators with powerful tools to manage and oversee the Hoste platform. This dashboard offers an intuitive interface for handling platform administration, user management, and operational oversight.

## Features

- 🔐 Secure admin authentication and authorization
- 📊 Real-time platform monitoring and analytics
- 👥 User and account management
- ⚙️ Platform configuration and settings
- 📈 Performance metrics and reporting
- 🛠️ Administrative tools and utilities
- 📋 Audit logging for all admin actions

## Tech Stack

- **Language:** TypeScript
- **Frontend Framework:** [Next.js](https://nextjs.org)
- **Backend:** Express.js + TypeScript (server folder)
- **Database:** PostgreSQL (with Prisma ORM)
- **Cache:** Redis
- **Package Manager:** pnpm/npm/yarn
- **License:** MIT

## Project Structure

```
hoste-admin-dashboard/
├── app/                # Next.js app directory
├── components/         # Reusable UI components
├── server/             # Express backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── prisma/
│   └── README.md
├── public/             # Static assets
├── package.json        # Project dependencies
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm, npm, or yarn
- Docker & Docker Compose (for local database setup)
- PostgreSQL (via Docker or local installation)
- Redis (via Docker or local installation)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/HostesAPP/hoste-admin-dashboard.git
cd hoste-admin-dashboard
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start services with Docker Compose** (if using Docker):
```bash
docker-compose up -d
```

5. **Set up the database:**
```bash
cd server
pnpm prisma generate
pnpm prisma migrate dev --name init
cd ..
```

6. **Start the development server:**
```bash
pnpm dev
# Frontend runs on http://localhost:3000
# Backend API runs on http://localhost:5000
```

## Development

### Available Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Linting and formatting
pnpm lint
pnpm format

# Database migrations (in server directory)
cd server
pnpm prisma migrate dev
pnpm prisma studio  # Open Prisma Studio
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Hoste Admin Dashboard

# Database (for server)
DATABASE_URL=postgresql://user:password@localhost:5432/hoste_admin_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_here
ADMIN_API_KEY=your_admin_api_key

# Optional: External services
SENTRY_DSN=
```

## API Endpoints

### Profile Management
- `GET /admin/profiles/activation-queue` - Get pending profile activations
- `POST /admin/profiles/:id/approve` - Approve a profile
- `POST /admin/profiles/:id/reject` - Reject a profile
- `POST /admin/profiles/:id/suspend` - Suspend a profile
- `POST /admin/profiles/:id/remove` - Remove a profile

### Authentication
- Staff authentication via header-based role verification
- Required headers: `X-Staff-Id` and `X-Staff-Role`

### Audit Logging
All profile mutations are automatically logged in the AuditLog table for compliance and tracking.

## Docker Deployment

### Build the image:
```bash
docker build -t hoste-admin-dashboard .
```

### Run the container:
```bash
docker run -p 3000:3000 -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  hoste-admin-dashboard
```

### Using Docker Compose:
```bash
docker-compose up
```

## Database

### Migrations

Run database migrations:
```bash
cd server
pnpm prisma migrate dev --name your_migration_name
```

### Prisma Studio

View and manage database records visually:
```bash
cd server
pnpm prisma studio
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit (`git commit -m 'Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write tests for new features
- Ensure all tests pass before submitting PR
- Update documentation as needed

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Performance & Monitoring

The dashboard includes:
- Request logging and monitoring
- Error tracking via Sentry (if configured)
- Audit logging for all administrative actions
- Redis caching for frequently accessed data

## Security

- All API endpoints require admin authentication
- Requests must include valid X-Staff-Id and X-Staff-Role headers
- All database operations are logged
- Use environment variables for sensitive data
- Never commit `.env.local` to version control

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker ps`
- Verify DATABASE_URL is correct in `.env.local`
- Check database credentials and permissions

### Redis Connection Issues
- Ensure Redis is running: `docker ps`
- Verify REDIS_URL is correct in `.env.local`

### Port Already in Use
- Frontend: Change NEXT_PUBLIC_PORT in .env.local
- Backend: Change PORT in server .env file

## Support & Feedback

- 🐛 [Report Issues](https://github.com/HostesAPP/hoste-admin-dashboard/issues)
- 💬 [Start Discussions](https://github.com/HostesAPP/hoste-admin-dashboard/discussions)
- 📧 Contact the Hoste team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hoste Team
- Next.js community
- All contributors and maintainers

---

**Repository:** [HostesAPP/hoste-admin-dashboard](https://github.com/HostesAPP/hoste-admin-dashboard)  
**Last Updated:** September 3, 2026  
**Status:** Active Development

For more information, visit [Hoste](https://hoste.app)
