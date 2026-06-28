# RouteForge Production Setup Guide

## Overview
RouteForge is now a fully production-grade fleet management system with AI/ML integration, real-time features, and monitoring capabilities.

## What's New
- **Swagger/OpenAPI**: Full API documentation available at `/swagger-ui.html`
- **WebSocket Support**: Real-time updates via STOMP over WebSocket
- **AI/ML Integration**: Route optimization and ETA prediction endpoints (ready for ML model plug-in)
- **Monitoring**: Prometheus metrics + Grafana dashboards
- **Production DB**: PostgreSQL (with H2 for development)
- **CI/CD Pipeline**: GitHub Actions workflow for automated builds
- **Health Checks**: Spring Actuator endpoints

## Quick Start: Docker Production Stack
1. Set environment variables (optional):
   ```bash
   export DB_PASSWORD=your-secure-db-password
   export JWT_SECRET=your-long-base64-jwt-secret
   ```
2. Start the stack:
   ```bash
   docker-compose up -d --build
   ```

## Access Points
- Frontend: http://localhost:8080
- Backend API: http://localhost:8081
- Swagger UI: http://localhost:8081/swagger-ui.html
- H2 Console (dev only): http://localhost:8081/h2-console
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (username: admin, password: admin)

## AI/ML Integration Guide
The `AIMLService` interface provides hooks for your custom ML models:
- Replace the mock implementation in `AIMLServiceImpl.java`
- Call external Python/TensorFlow service via REST or gRPC
- Example: Add a REST client to call your ML service endpoint

## Swagger UI Usage
1. Navigate to `/swagger-ui.html`
2. Click "Authorize" and enter your JWT token in the format: `Bearer <your-token>`
3. Use any API endpoints!
