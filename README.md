# Mentra LMS

A multi-tenant Learning Management System with AI-powered features.

**Backend:** Go 1.23 · Gin · GORM · PostgreSQL + pgvector
**Frontend:** Next.js 15 · React 19 · TypeScript · Tailwind CSS
**AI:** Ollama (local LLM)

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

---

## Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/mentra-lms.git
   cd mentra-lms
   ```

2. **Configure environment**

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` and fill in your values (DB credentials, JWT secret, etc.).

3. **Start all services**

   ```bash
   docker-compose up --build
   ```

   | Service  | URL                      |
   |----------|--------------------------|
   | Frontend | http://localhost         |
   | API      | http://localhost/api/v1  |
   | Ollama   | http://localhost:11434   |

4. **Seed the database** (first run)

   ```bash
   docker-compose exec app ./seed
   ```

---

## Project Structure

```
backend/    Go REST API (Clean Architecture)
frontend/   Next.js app (App Router)
```

---

## Multi-Tenancy

Each organization gets its own subdomain/slug. All API requests require an `X-Org-Slug` header. JWT tokens embed `org_id` and `role` — all data is scoped per tenant.
