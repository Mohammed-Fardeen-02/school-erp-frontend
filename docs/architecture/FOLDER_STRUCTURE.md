# Frontend Folder Structure Reference

This document serves as the **authoritative, definitive reference** for the School ERP frontend directory layout, code placement, layer responsibilities, and structural boundaries.

---

## 1. Root-Level Directories & Files

```text
erp-frontend/
├── .github/          # CI/CD workflows and automated repository checks
│   └── workflows/    # GitHub Actions workflow definitions (ci.yml)
├── docs/             # Technical architecture, conventions, and operational guides
│   ├── architecture/ # Architectural standards and decision records
│   └── development/  # Local setup, environment config, and contribution guides
├── public/           # Static public assets served directly at the root URL
│   └── assets/       # Public static images, favicons, logos, manifests
├── src/              # Application source code
├── .editorconfig     # Cross-editor formatting consistency
├── .env.example      # Safe template of environment variables
├── .gitignore        # Git exclusion rules for builds, dependencies, and environment files
├── .prettierrc       # Code formatter configuration
├── eslint.config.js  # Linter configuration (ESLint 9 flat config)
├── index.html        # Single page application HTML entry point
├── package.json      # Dependencies and execution scripts
├── package-lock.json # Deterministic dependency lockfile
├── postcss.config.js # PostCSS plugins configuration (Tailwind, Autoprefixer)
├── tailwind.config.ts# Tailwind design tokens, typography, and styling extensions
├── tsconfig.json     # Solution-level TypeScript project configuration
├── tsconfig.app.json # Strict TypeScript configuration for application code
├── tsconfig.node.json# Strict TypeScript configuration for Vite/tooling configs
├── vite.config.ts    # Vite bundler, plugin, and path alias configuration
├── vitest.config.ts  # Vitest test runner configuration and environment setup
├── AGENTS.md         # Mandatory instruction rules for AI coding agents
└── README.md         # Main project overview, installation, and commands
```

---

## 2. Source Code Directories (`src/`)

```text
src/
├── main.tsx          # Application bootstrapper: mounts React DOM to HTML root
├── App.tsx           # Root component: composes providers and router shell
├── vite-env.d.ts     # TypeScript ambient type declarations for Vite
├── app/              # Core application orchestration and runtime setup
│   ├── config/       # Validated environment variables and static app constants
│   ├── guards/       # Route UX guards (e.g., auth redirection wrappers)
│   ├── layouts/      # Global layout shells (headers, navigation, footers, outlets)
│   ├── providers/    # Composition of global providers (QueryClient, Theme, Router)
│   └── router/       # Central route configuration and router component
├── assets/           # Bundled assets (compiled/optimized by Vite)
│   ├── fonts/        # Custom typography files (woff2, etc.)
│   ├── icons/        # SVG icons and custom vector assets
│   └── images/       # Static illustration and banner images
├── components/       # Shared, domain-agnostic, reusable UI primitives
│   ├── ui/           # Primitive interactive controls (buttons, modals, tooltips)
│   ├── forms/        # Form inputs and field wrappers (inputs, selects, checkboxes)
│   ├── feedback/     # Status notifications and feedback (alerts, spinners, toasts)
│   ├── data-display/ # Generic data renderers (cards, badges, tables, avatars)
│   └── navigation/   # Generic navigation primitives (breadcrumbs, pagination)
├── features/         # Business domain modules (Students, Fees, Attendance, etc.)
│   └── .gitkeep      # Intentionally EMPTY in foundation skeleton
├── hooks/            # Shared, reusable React hooks (non-domain specific)
├── lib/              # Third-party library initializations and core utilities
├── services/         # System-level cross-cutting HTTP services (telemetry, health)
├── stores/           # Global client-side state stores (Zustand)
├── styles/           # Global stylesheets and Tailwind CSS directives
├── types/            # Shared, domain-agnostic TypeScript types and API contracts
├── utils/            # Shared pure utility functions (formatters, date helpers)
└── test/             # Test harness, test-utils, fixtures, and API mocks
    ├── fixtures/     # Shared test mock data payloads
    ├── mocks/        # Mock service worker or API handlers
    ├── setup.ts      # Global Vitest lifecycle configuration
    └── test-utils.tsx# Custom RTL render function with query and router wrappers
```

---

## 3. Layer Responsibilities & Distinction Matrix

| Layer             | Responsibility                                                       | What Belongs Here                                                   | What is Strictly PROHIBITED                                          |
| :---------------- | :------------------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------- |
| **`app/`**        | Application lifecycle, providers, routing, and global layout shells. | `app-router.tsx`, `root-layout.tsx`, `app-provider.tsx`, `env.ts`.  | Business feature forms, domain calculations, entity CRUD.            |
| **`components/`** | Pure, domain-agnostic UI building blocks.                            | `Button`, `Input`, `Card`, `Badge`, `Spinner`, `Modal`.             | Domain entities (e.g. `StudentCard`), API requests, business state.  |
| **`features/`**   | Complete business domain implementations.                            | Pages, feature-specific components, hooks, schemas, API queries.    | Re-exporting generic UI primitives, modifying shared infrastructure. |
| **`hooks/`**      | Generic, reusable React lifecycle and browser hooks.                 | `useDisclosure`, `useDebounce`, `useLocalStorage`, `useMediaQuery`. | Domain queries (e.g. `useStudentQuery`), API fetching.               |
| **`lib/`**        | Framework/library configurations and low-level infrastructure.       | `api-client.ts`, `query-client.ts`, `cn()` utility.                 | Feature-specific API endpoints, UI rendering.                        |
| **`services/`**   | System-wide cross-cutting network operations.                        | `httpService.checkHealth()`, telemetry, global refresh tokens.      | Business domain endpoints (e.g. `getStudents()`).                    |
| **`stores/`**     | Transient client-side global UI state (Zustand).                     | `ui-store.ts` (sidebar toggle, color theme, active modal ID).       | Server cache, entity records (Students, Fees), pagination state.     |
| **`types/`**      | Shared application-wide contracts and generic API responses.         | `ApiResponse<T>`, `PaginationMeta`, `Nullable<T>`, `BaseEntity`.    | Feature-only DTOs (e.g. `CreateStudentInput`).                       |
| **`utils/`**      | Pure, deterministic utility functions with zero side-effects.        | `formatDate`, `formatCurrency`, `truncate`, `clamp`.                | React hooks, JSX, DOM manipulation, HTTP calls.                      |
| **`test/`**       | Shared testing infrastructure and providers wrapper.                 | `setup.ts`, `test-utils.tsx`, reusable test mocks.                  | Production application exports.                                      |

---

## 4. Critical Architectural Distinctions

### 1. `components/` vs `features/`

- **`components/`** components are **domain-agnostic**. They know nothing about schools, students, teachers, or fees. A `<Button />` or `<Card />` can be dropped into an e-commerce app or a school app without changing a single line of code.
- **`features/<name>/components/`** components are **domain-specific**. For example, `StudentProfileHeader` or `FeePaymentSummaryCard` depends directly on School ERP business logic.

### 2. `services/` vs `features/<name>/api/`

- **`services/`** is reserved for **system-level, cross-cutting network calls** that are not owned by any business feature. Examples: `httpService.checkHealth()`, application logging telemetry, or global OAuth token exchange.
- **`features/<name>/api/`** owns all **business endpoint queries and mutations** for that specific feature (e.g. `fetchStudents`, `createStudentEnrollment`, `collectFeeInvoice`).

### 3. `hooks/` vs `features/<name>/hooks/`

- **`hooks/`** contains **generic utilities** (e.g. `useDisclosure` for modal state, `useDebounce` for search inputs, `useWindowSize`).
- **`features/<name>/hooks/`** contains **feature-specific business logic** (e.g. `useStudentEnrollment`, `useFeeCalculator`, TanStack Query hooks like `useStudentListQuery`).

### 4. Server State (TanStack Query) vs Client State (Zustand)

- **TanStack Query** manages **asynchronous, server-persisted data**: caching, background refetching, pagination, mutation side-effects, and loading states.
- **Zustand** manages **transient, synchronous client-side UI state**: sidebar collapse/expansion, dark/light theme toggle, active view mode (grid vs table), or multi-step wizard step navigation.
- **RULE**: NEVER copy TanStack Query cache into Zustand. Doing so creates dual sources of truth and causes subtle cache invalidation bugs.

---

## 5. Future Feature Architecture Pattern

When a future task requests implementing an ERP business feature, the developer or AI agent must follow this modular structure under `src/features/<feature-name>/`:

```text
src/features/<feature-name>/
├── api/
│   ├── get-<entity>.ts         # TanStack query function & query options
│   ├── create-<entity>.ts      # TanStack mutation function
│   ├── update-<entity>.ts      # TanStack mutation function
│   └── index.ts                # Public API queries export
├── components/
│   ├── <entity>-list-table.tsx # Feature-specific presentation components
│   ├── <entity>-filter-bar.tsx # Feature-specific filter toolbar
│   ├── <entity>-form.tsx       # Feature-specific form powered by RHF
│   └── index.ts                # Public components export
├── hooks/
│   ├── use-<entity>-filter.ts  # Feature-specific custom hook
│   └── index.ts                # Public hooks export
├── pages/
│   ├── <entity>-list-page.tsx  # Page component mounted by router
│   ├── <entity>-detail-page.tsx# Page component for detail view
│   └── index.ts                # Public pages export
├── schemas/
│   ├── <entity>.schema.ts      # Zod validation schemas for forms & DTOs
│   └── index.ts                # Public schemas export
├── types/
│   ├── <entity>.types.ts       # Domain DTOs, entity interfaces, filter params
│   └── index.ts                # Public types export
├── utils/
│   ├── <entity>-helpers.ts     # Feature-only pure utility functions
│   └── index.ts                # Public utilities export
├── routes.tsx                  # Feature route definitions (<Route ... /> elements)
└── index.ts                    # Public feature barrel (only exports what other parts need)
```

### Proportionality Rule (Small vs Large Features)

- Small features (e.g. `branches`, `academic-sessions`) should only create the folders they actually need. Do not create empty folders.
- Large features (e.g. `fees`, `examinations`) should adopt the full structure.
- **Barrels & Encapsulation**: A feature's `index.ts` defines its public contract. Code outside `features/<feature-name>` must only import from `@/features/<feature-name>`. Never deep-import another feature's internal components or private hooks.

---

## 6. Naming Conventions

| Category                | Convention                           | Pattern / Example                                   |
| :---------------------- | :----------------------------------- | :-------------------------------------------------- |
| **Folders**             | `kebab-case`                         | `data-display/`, `fee-management/`, `app-router/`   |
| **Component Files**     | `kebab-case.tsx`                     | `button.tsx`, `root-layout.tsx`, `student-card.tsx` |
| **Component Names**     | `PascalCase`                         | `Button`, `RootLayout`, `StudentCard`               |
| **Hook Files**          | `kebab-case.ts`                      | `use-disclosure.ts`, `use-student-query.ts`         |
| **Hook Names**          | `camelCase` (prefixed with `use`)    | `useDisclosure`, `useStudentQuery`                  |
| **Schema Files**        | `kebab-case.schema.ts`               | `student.schema.ts`, `fee-payment.schema.ts`        |
| **Schema Names**        | `camelCase` (suffixed with `Schema`) | `createStudentSchema`, `feeFilterSchema`            |
| **Type Files**          | `kebab-case.types.ts`                | `common.types.ts`, `student.types.ts`               |
| **Type Names**          | `PascalCase`                         | `StudentDTO`, `PaymentStatus`, `PaginationMeta`     |
| **Utility Files**       | `kebab-case.ts`                      | `formatters.ts`, `date-utils.ts`                    |
| **Utility Functions**   | `camelCase`                          | `formatCurrency()`, `formatDate()`                  |
| **Test Files**          | `kebab-case.test.tsx` / `test.ts`    | `button.test.tsx`, `formatters.test.ts`             |
| **Zustand Store Files** | `kebab-case-store.ts`                | `ui-store.ts`, `auth-store.ts`                      |
| **Zustand Store Hook**  | `camelCase` (prefixed with `use`)    | `useUiStore`, `useAuthStore`                        |

---

## 7. Import & Dependency Boundary Rules

1. **Path Alias Usage**: Always use `@/` alias instead of relative paths with more than one `../`.
   - **Correct**: `import { Button } from '@/components/ui';`
   - **Incorrect**: `import { Button } from '../../../components/ui/button';`
2. **Strict Layer Boundary Constraints**:
   - `src/lib/` cannot import from `src/components/`, `src/features/`, or `src/app/`.
   - `src/components/` cannot import from `src/features/`.
   - `src/features/<feature-A>` cannot import internal files from `src/features/<feature-B>`. Cross-feature sharing is permitted ONLY via top-level `@/features/<feature-B>` barrel exports or by promoting shared contracts to `src/types/` or `src/components/`.
3. **No Circular Imports**:
   - Ensure unidirectional dependency graph: `app` -> `features` -> `components` -> `lib` / `utils` / `types`.

---

## 8. Examples of Correct vs Incorrect File Placement

| File Content / Intent             | INCORRECT Placement                       | CORRECT Placement                                       | Reason                                                          |
| :-------------------------------- | :---------------------------------------- | :------------------------------------------------------ | :-------------------------------------------------------------- |
| Generic dropdown menu primitive   | `src/features/ui/dropdown.tsx`            | `src/components/ui/dropdown.tsx`                        | Domain-agnostic UI primitive belongs in `components/ui/`.       |
| Student admission form            | `src/components/forms/admission-form.tsx` | `src/features/admissions/components/admission-form.tsx` | Business-specific form belongs in its domain feature directory. |
| Fetching fee invoice API call     | `src/services/fee.service.ts`             | `src/features/fees/api/get-fee-invoices.ts`             | Business queries belong inside their feature API layer.         |
| System health check endpoint      | `src/features/health/api.ts`              | `src/services/http.service.ts`                          | Cross-cutting system health is an infrastructure service.       |
| Sidebar open/close toggle state   | `src/features/navigation/store.ts`        | `src/stores/ui-store.ts`                                | Transient global UI state belongs in centralized Zustand store. |
| Cached student attendance records | `src/stores/attendance-store.ts`          | TanStack Query Cache (`useQuery`)                       | Server-side data must not be stored in client state (Zustand).  |
