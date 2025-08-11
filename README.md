# NestJS Doctor Booking (Raw SQL, pg)

This is a minimal Nest-like project that uses raw SQL (`pg` package) for the Doctor Appointment Booking assignment.

## Features
- GET /doctors
- GET /doctors/:id/slots?date=YYYY-MM-DD
- POST /appointments

## Quick start
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Run migrations:
   ```bash
   psql $DATABASE_URL -f migrations/001_init.sql
   psql $DATABASE_URL -f seed/seed.sql
   ```
3. Install deps:
   ```bash
   npm install
   ```
4. Run dev server:
   ```bash
   npm run start:dev
   ```

Server runs on PORT (default 3000). API docs available at `/api` (Swagger).



