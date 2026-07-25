# Financial Wallet API

![Status](https://img.shields.io/badge/status-under%20development-orange)
![Node.js](https://img.shields.io/badge/node-22.x-green)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A production-oriented backend REST API for a digital wallet, built as a
portfolio project to demonstrate modern backend engineering practices.

## 🚧 Project Status

This project is actively being developed and is **not yet feature complete**.

Its goal is to simulate the development of a real-world financial platform by implementing new capabilities in incremental phases. Each phase focuses on applying industry best practices rather than simply adding functionality.

Current areas of focus include:

- ✅ Project infrastructure
- 🚧 Authentication & Authorization
- ⏳ Accounts & Wallets
- ⏳ Transactions
- ⏳ Real-time notifications
- ⏳ Background processing
- ⏳ Observability
- ⏳ CI/CD & Deployment

The repository is updated regularly as new phases are completed.

## Features

-   REST API with Express 5
-   TypeScript
-   PostgreSQL with Prisma ORM
-   Redis for caching and messaging
-   BullMQ for background jobs
-   Docker-based development environment
-   Jest + Supertest integration tests
-   Zod validation
-   Pino logging
-   ESLint + Prettier
-   GitHub Actions CI

## Tech Stack

-   Node.js
-   TypeScript
-   Express 5
-   Prisma
-   PostgreSQL
-   Redis
-   BullMQ
-   Jest
-   Supertest
-   Docker

## Project Structure

``` text
src/
├── application/
├── domain/
├── infrastructure/
├── interfaces/
├── app.ts
└── main.ts

tests/
├── integration/
├── unit/
├── concurrency/
└── helpers/
```

## Getting Started

### Prerequisites

-   Node.js 22+
-   Docker & Docker Compose

### Installation

``` bash
git clone <repository-url>
cd financial-wallet-api
npm install
```

### Environment Variables

Create a `.env` file:

``` env
PORT=3000
DATABASE_URL=
REDIS_URL=
NODE_ENV=development
```

### Run with Docker

``` bash
docker compose up
```

### Run Locally

``` bash
npm run dev
```

## Available Scripts

  Command               Description
  --------------------- ------------------------------
  `npm run dev`         Start development server
  `npm run build`       Compile TypeScript
  `npm start`           Run compiled application
  `npm run lint`        Run ESLint
  `npm run typecheck`   Run TypeScript type checking
  `npm test`            Run test suite

## Health Endpoints

-   `GET /health` -- Liveness check
-   `GET /health/ready` -- Readiness check (PostgreSQL + Redis)

## Roadmap

This project is being developed incrementally, following a
production-oriented roadmap that includes:

-   Infrastructure
-   Authentication & Authorization
-   Accounts and Transactions
-   Real-time notifications
-   Background jobs
-   Observability
-   CI/CD

## License

This project is intended for educational and portfolio purposes.

## 📅 Development Progress

| Phase | Status |
|--------|--------|
| Phase 0 – Project Foundation | ✅ Completed |
| Phase 1 – Authentication | 🚧 In Progress |
| Phase 2 – Accounts & Wallets | ⏳ Planned |
| Phase 3 – Transactions | ⏳ Planned |
| Phase 4 – Real-time Features | ⏳ Planned |
| Phase 5 – Background Jobs | ⏳ Planned |
| Phase 6 – Production Readiness | ⏳ Planned |
