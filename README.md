# School ERP - Frontend

Enterprise-grade, feature-based Single Page Application (SPA) for the School ERP platform.

Built with **React 18**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, **TanStack Query**, **Zustand**, and **React Hook Form**.

---

## Architecture Overview

The frontend is structured around a **Feature-Based Modular Architecture**. All core infrastructure and shared primitives are decoupled from business features:

- **`src/app/`**: Application orchestration, providers, layout shells, guards, and routing.
- **`src/components/`**: Domain-agnostic, reusable UI primitives (`ui`, `forms`, `feedback`, `data-display`, `navigation`).
- **`src/features/`**: Domain business modules (e.g., students, fees, attendance). _Intentionally kept empty in the foundation skeleton._
- **`src/lib/`**: Centralized HTTP client (`apiClient`), TanStack Query client, and styling utilities (`cn`).
- **`src/services/`**: Cross-cutting system network operations (system health checks, telemetry).
- **`src/stores/`**: Transient client-side UI state managed via Zustand.
- **`src/types/`**: Common TypeScript contracts and API response interfaces.
- **`src/utils/`**: Pure formatting and utility helpers.

For detailed specifications, see [`docs/architecture/FOLDER_STRUCTURE.md`](docs/architecture/FOLDER_STRUCTURE.md) and [`docs/architecture/FRONTEND_ARCHITECTURE.md`](docs/architecture/FRONTEND_ARCHITECTURE.md).

---

## Quickstart

### 1. Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0

### 2. Setup

```bash
# Navigate to frontend
cd erp-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run local development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Available Scripts

| Command                 | Description                                                |
| :---------------------- | :--------------------------------------------------------- |
| `npm run dev`           | Starts local development server on port 3000               |
| `npm run build`         | Compiles TypeScript and builds optimized production bundle |
| `npm run preview`       | Locally serves the production build                        |
| `npm run lint`          | Runs ESLint validation                                     |
| `npm run lint:fix`      | Fixes autofixable ESLint errors                            |
| `npm run format`        | Validates formatting against Prettier                      |
| `npm run format:fix`    | Formats files with Prettier                                |
| `npm run typecheck`     | Validates TypeScript types across project (`tsc --noEmit`) |
| `npm test`              | Runs the Vitest test suite                                 |
| `npm run test:watch`    | Starts Vitest in interactive watch mode                    |
| `npm run test:coverage` | Generates test coverage report                             |

---

## AI Coding Agent Directives

Automated coding agents must strictly adhere to the guidelines documented in [`AGENTS.md`](AGENTS.md). Never create premature business features or violate modular feature boundaries.
