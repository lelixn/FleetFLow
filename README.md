# FleetFlow

FleetFlow is a full-stack fleet management and route optimization platform built with React + TypeScript on the frontend and Spring Boot on the backend.

It helps teams manage vehicles, drivers, routes, and deliveries from a single dashboard with JWT-based authentication, live data refresh, and a production-ready Docker deployment path.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Spring Boot 3.3, Spring Security, Spring Data JPA, JWT, Actuator
- **Database:** H2 (local dev), PostgreSQL (production / Docker)

## Project Structure

```text
FleetFlow/
├── frontend/          # React + Vite app
├── backend/           # Spring Boot REST API
├── docker-compose.yml # PostgreSQL + API + nginx frontend
└── docs/
```

## Core Features

- JWT authentication (`/api/v1/auth/**`)
- Full CRUD for vehicles, drivers, routes, and deliveries
- Delivery status workflow: `PENDING → IN_TRANSIT → DELIVERED` (or `FAILED`)
- Route assignment to drivers and vehicles
- Analytics summary dashboard with live polling
- Command palette (Ctrl/Cmd+K) for quick navigation
- Health checks: `/api/v1/health`, `/actuator/health`

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.9+

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8081`.

On Windows/PowerShell:

```powershell
cd backend
.\run-dev.ps1 -KillExisting -SeedDemo
```

`-SeedDemo` loads sample fleet data and an admin account:

- **Username:** `admin`
- **Password:** `Admin123!`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. The Vite dev server proxies `/api/*` to the backend.

Copy `frontend/.env.example` to `frontend/.env` to customize:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_PORT` | `5173` | Dev server port |
| `VITE_API_PROXY_TARGET` | `http://localhost:8081` | Backend URL for dev proxy |
| `VITE_API_BASE_URL` | `/api/v1` | Axios base URL |

## Production Deployment (Docker)

Deploy the full stack with PostgreSQL:

```bash
# Set a strong JWT secret (required in production)
export JWT_SECRET="your-long-random-base64-secret"

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend (nginx) | http://localhost:8080 |
| Backend API | http://localhost:8081 |
| PostgreSQL | localhost:5432 |

The frontend container proxies `/api/*` to the backend, so `VITE_API_BASE_URL=/api/v1` works without CORS issues.

### Production profile

The backend uses `spring.profiles.active=prod` in Docker with:

- PostgreSQL connection (via env vars)
- Hibernate `ddl-auto=update` (use Flyway/Liquibase for hardened prod)
- Seed data disabled
- Actuator health exposed at `/actuator/health`

### Environment variables (backend)

| Variable | Description |
|----------|-------------|
| `SERVER_PORT` | API port (default `8081`) |
| `SPRING_PROFILES_ACTIVE` | Set to `prod` for PostgreSQL |
| `SPRING_DATASOURCE_URL` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `JWT_SECRET` | **Required in prod** — Base64-encoded secret |
| `JWT_EXPIRATION` | Token TTL in ms (default 86400000) |
| `APP_SEED_ENABLED` | Load demo data on startup (`true`/`false`) |

## API Reference

Base path: `/api/v1`

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/login`, `POST /auth/signup` |
| Vehicles | `GET/POST /vehicles`, `GET/PUT/DELETE /vehicles/{id}` |
| Drivers | `GET/POST /drivers`, `GET/PUT/DELETE /drivers/{id}` |
| Routes | `GET/POST /routes`, `GET/PUT/DELETE /routes/{id}` |
| Deliveries | `GET/POST /deliveries`, `GET/PUT/DELETE /deliveries/{id}`, `PATCH /deliveries/{id}/status` |
| Analytics | `GET /analytics/summary` |
| Health | `GET /health` (public) |

All endpoints except auth and health require `Authorization: Bearer <token>`.

## Build Commands

**Frontend:**

```bash
cd frontend
npm run build    # production bundle in dist/
npm run lint
```

**Backend:**

```bash
cd backend
mvn test
mvn clean package   # JAR in target/
```

## Architecture Notes

- API responses use a consistent wrapper: `{ success, message, data }`. The frontend `unwrapApiData()` helper handles this.
- Live refresh polls the backend every 2–60 seconds (configurable in Settings).
- Signup validates input and rejects duplicate usernames/emails.
- Disabled accounts cannot log in.
- Route and delivery entities accept foreign-key IDs (`driverId`, `vehicleId`, `routeId`) from the frontend.

## Next Steps for Hardened Production

These are recommended before a public SaaS launch:

1. **Database migrations** — Add Flyway with versioned schema instead of `ddl-auto=update`
2. **RBAC** — Restrict admin CRUD to `ADMIN` role; scope driver access to assigned routes
3. **HTTPS** — Terminate TLS at a reverse proxy (nginx, Caddy, or cloud load balancer)
4. **Secrets management** — Use Docker secrets, Vault, or cloud KMS for JWT and DB credentials
5. **Observability** — Wire Actuator metrics to Prometheus/Grafana; add structured logging
6. **Rate limiting** — Protect auth endpoints from brute-force attempts

## AIML Integration Pathway

FleetFlow is ready for AI/ML integration! Here are key areas:

1. **Route Optimization**: Use historical tracking and delivery data to optimize routes
2. **Demand Forecasting**: Predict delivery demands to plan better fleet allocation
3. **Driver Performance Analysis**: Identify patterns in driver behavior and efficiency
4. **Vehicle Maintenance Predictions**: Use vehicle telemetry to forecast maintenance needs
5. **ETA Predictions**: Build machine learning models to predict accurate delivery times