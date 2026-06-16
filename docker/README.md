# Docker - Development Infrastructure

Docker Compose configuration for local development services.

## Services

| Service | Port | Purpose | Credentials |
|---------|------|---------|-------------|
| PostgreSQL 16 | 5432 | Primary database | `blinkit` / `blinkit_dev` |
| Redis 7 | 6379 | Caching & sessions | No auth (dev only) |
| MinIO | 9000 (API), 9001 (Console) | S3-compatible file storage | `minioadmin` / `minioadmin` |

## Commands

```bash
# Start all services
pnpm docker:up

# Stop all services
pnpm docker:down

# View logs
docker compose -f docker/docker-compose.dev.yml logs -f

# Reset data (removes volumes)
docker compose -f docker/docker-compose.dev.yml down -v
```

## Data Persistence

Data is stored in named Docker volumes:
- `postgres_data` - Database files
- `redis_data` - Redis persistence
- `minio_data` - Uploaded files

Volumes persist across container restarts. Use `down -v` to reset completely.

## MinIO Setup

After first start, create the upload bucket:
1. Open http://localhost:9001
2. Login with `minioadmin` / `minioadmin`
3. Create bucket named `blinkit-uploads`
4. Set bucket access policy to `public` (for dev image serving)

Or via CLI:
```bash
docker exec blinkit-minio mc alias set local http://localhost:9000 minioadmin minioadmin
docker exec blinkit-minio mc mb local/blinkit-uploads
docker exec blinkit-minio mc anonymous set public local/blinkit-uploads
```

## Health Checks

All services include health checks:
- PostgreSQL: `pg_isready` every 5s
- Redis: `redis-cli ping` every 5s
- MinIO: HTTP health endpoint every 10s
