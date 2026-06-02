# FleetFlow

FleetFlow is a full-stack fleet management and route optimization platform built with React + TypeScript on the frontend and Spring Boot on the backend.

It helps teams manage vehicles, drivers, routes, and deliveries from a single dashboard with JWT-based authentication and a clean API layer.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router
- Backend: Spring Boot 3, Spring Security, Spring Data JPA, JWT
- Database: H2 (default, in-memory), PostgreSQL driver included

## Project Structure

```text
FleetFlow/
|- frontend/   # React + Vite app
|- backend/    # Spring Boot REST API
|- docs/       # project docs
```

## Core Features

- Authentication with JWT (`/api/v1/auth/**`)
- Fleet management for vehicles and drivers
- Route management and assignment support
- Delivery tracking views
- Typed frontend API client with auth interceptors

## Quick Start

### 1) Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.9+

### 2) Run Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8081` by default.

### 3) Run Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

The Vite dev server proxies `/api/*` to `http://localhost:8081`.

## Configuration

Backend config file: `backend/src/main/resources/application.properties`

Current default setup includes:
- H2 in-memory database
- `server.port=8081`
- JWT secret + expiration settings

For production:
- Replace H2 with PostgreSQL connection settings
- Move secrets (JWT, DB credentials) to environment variables or secure secret storage
- Disable or lock down development-only features

## Frontend Scripts

Run from `frontend/`:

- `npm run dev` - start development server
- `npm run build` - type-check and build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Backend Scripts

Run from `backend/`:

- `mvn spring-boot:run` - start API server
- `mvn test` - run backend tests
- `mvn clean package` - build JAR

## API Base Path

The API uses versioned routes under:

`/api/v1`

Example resources include:
- `/api/v1/auth`
- `/api/v1/vehicles`
- `/api/v1/drivers`
- `/api/v1/routes`
- `/api/v1/deliveries`

## Build for Production

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
mvn clean package
```

## Notes

- The existing `frontend/README.md` is the default Vite template and can be replaced later with app-specific frontend documentation if needed.
- Start backend first, then frontend, to avoid API connection errors during development.
