# Architecture Changelog

All notable architectural decisions, structural modifications, and standard conventions for the School ERP Frontend are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] - 2026-10-26

### Added

- **Core Architecture Foundation**: Initialized feature-based modular single-page application structure.
- **Technology Stack**: Configured React 18, TypeScript strict mode, Vite 6, Tailwind CSS v3, TanStack Query v5, Zustand v5, React Hook Form v7, Zod v3, and Vitest.
- **Networking Infrastructure**: Implemented centralized `ApiClient` (`src/lib/api-client.ts`) with timeout handling, base URL resolution, query param building, and standardized error responses.
- **State Segregation**: Formulated explicit boundary between server-state (TanStack Query) and transient client UI state (Zustand).
- **Environment Validation**: Added Zod schema validation for runtime environment variables (`src/app/config/env.ts`).
- **Foundational UI Primitives**: Added domain-agnostic `Button`, `Input`, `Card`, `Badge`, `Spinner`, and `Alert` components.
- **Quality Gates**: Configured ESLint 9 (flat config), Prettier, TypeScript strict checking, and GitHub Actions CI workflow.
- **Architectural Documentation**: Published comprehensive architectural documentation covering folder structure, state management, API integration, routing, styling, forms, testing, and AI agent instructions.
