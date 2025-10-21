# Farpost VLRU Project

Full-stack application with NestJS backend and PostgreSQL database.

## Prerequisites

- Docker & Docker Compose
- Node.js 22+ (for local development)

## Environment Setup

The project supports multiple environments:
- **Development**: Hot-reload enabled, debug logging
- **Production**: Optimized build, minimal logging

### Environment Files

- `.env` - Docker Compose variables (root)
- `backend/.env.development` - Development backend config
- `backend/.env.production` - Production backend config
- `backend/.env.example` - Template for environment variables

## Running the Application

### Development Mode (Hot-Reload)

```bash

# manually
docker compose --env-file ./backend/.env.development -f docker-compose.yml up -d
```

### Production Mode

```bash

# manually
docker compose --env-file ./backend/.env.production -f docker-compose.prod.yml up -d
```

### Quick Commands

```bash
# View logs (development)
docker compose -f docker-compose.yml logs -f name of container
docker compose -f docker-compose.yml logs -f name of container

# View logs (production)
docker compose -f docker-compose.prod.yml logs -f name of container
docker compose -f docker-compose.prod.yml logs -f db-name of container

# Remove volumes (reset database)
# Development:
docker compose --env-file ./backend/.env.development -f docker-compose.yml down -v
# Production:
docker compose --env-file ./backend/.env.production -f docker-compose.prod.yml down -v

# Rebuild without cache
docker compose --env-file ./backend/.env.development -f docker-compose.yml build --no-cache
```

## Local Development (without Docker)

```bash
cd backend
npm install

# Copy environment file if u dont change default env file in app.module
cp .env.development .env

# Start PostgreSQL separately or update .env with local DB credentials

# Run in watch mode
npm run start:dev
```

## API Documentation (in future)

Backend runs on `http://localhost:3000`

## Database

PostgreSQL 17 running on port `5432`

**Development credentials (example):**
- User: `user`
- Password: `user123456`
- Database: `user`

**Production credentials (example):**
- User: `produser`
- Password: `produser`
- Database: `produser`

⚠️ **Important:** Change production credentials in `backend/.env.production` before deploying to production.
