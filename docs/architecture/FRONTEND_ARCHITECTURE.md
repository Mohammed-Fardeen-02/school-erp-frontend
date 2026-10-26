# School ERP - Frontend Technical Architecture

## 1. Executive Summary & Vision

This document details the architectural foundation, design principles, and engineering standards for the **School ERP Frontend**.

The frontend is engineered as a **Feature-Based Modular Single Page Application (SPA)** using **React, TypeScript (Strict Mode), Vite, Tailwind CSS, TanStack Query, and Zustand**. It interfaces with the School ERP backend—a modular monolith built with Node.js, Express, PostgreSQL, and Prisma.

### Architectural Tenets

1. **Separation of Infrastructure and Business Domains**: Core technical concerns (routing, networking, layout, design tokens, error boundaries) are decoupled from domain business modules.
2. **Feature-First Modularity**: Every business capability (e.g. students, fees, attendance) lives in an autonomous, isolated feature directory under `src/features/`.
3. **Strict State Segregation**: Server-state (asynchronous cache, pagination, mutations) is managed exclusively via **TanStack Query**. Client-state (transient UI, sidebar toggles, theme) is managed via **Zustand**. No redundant state synchronization.
4. **Resilient Form Management**: Complex forms are powered by **React Hook Form** and validated with strict **Zod schemas** aligned with the backend API contracts.
5. **Zero Premature Business Features**: The foundation establishes only infrastructure, build systems, styling tokens, and reusable primitives. No ERP business modules exist in this skeleton.

---

## 2. Technology Stack & Decision Matrix

| Layer            | Selected Technology | Rationale                                                                                                | Alternatives Evaluated & Rejected                                                |
| :--------------- | :------------------ | :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **Framework**    | React 18            | Industry standard, mature ecosystem, predictable concurrency, optimal library compatibility.             | Vue (diverges from TS standards), Angular (heavyweight).                         |
| **Language**     | TypeScript (Strict) | Compile-time safety, strict null checks, autocompletion, refactoring confidence. Zero unjustified `any`. | Plain JavaScript (lack of type safety in enterprise ERP).                        |
| **Build Tool**   | Vite 6              | Instant HMR, lightning-fast ES module dev server, optimized Rollup bundling.                             | Webpack (slow builds, complex config), CRA (deprecated).                         |
| **Routing**      | React Router v6     | Declarative layout routing, nested routes, route-level code splitting, standard URL sync.                | TanStack Router (less ecosystem familiarity for new contributors).               |
| **Server State** | TanStack Query v5   | Automatic caching, background refetching, query deduplication, optimistic updates, garbage collection.   | Redux Toolkit Query (excessive boilerplate), Apollo (GraphQL not used).          |
| **Client State** | Zustand v5          | Minimal footprint (~1KB), hooks-based, boilerplate-free, decoupled from React tree.                      | Redux / RTK (overkill for UI state), Context API (re-render performance issues). |
| **Forms**        | React Hook Form v7  | Uncontrolled inputs, minimal re-renders, high performance on massive ERP data-entry forms.               | Formik (excessive re-renders), manual state (bug-prone).                         |
| **Validation**   | Zod v3              | Schema declaration with automatic TypeScript type inference, identical to backend validation engine.     | Yup (lacks TS inference power), Joi (not browser-optimized).                     |
| **Styling**      | Tailwind CSS v3     | Utility-first, purgeable, zero runtime overhead, responsive, custom design system tokens.                | CSS Modules (slower authoring), CSS-in-JS (runtime performance cost).            |
| **Testing**      | Vitest + RTL        | Blazing fast ESM runner matching Vite config, DOM simulation via JSDOM, user-centric testing.            | Jest (slow, complex ESM configuration).                                          |
| **Quality**      | ESLint 9 + Prettier | Enforces strict code quality, prevents bugs, enforces consistent formatting repository-wide.             | StandardJS (inflexible rules).                                                   |

---

## 3. High-Level Architectural Flow

```text
[ Browser / User Interaction ]
              │
              ▼
   [ App.tsx & Providers ]
      (QueryProvider, AppRouter)
              │
              ▼
     [ React Router Shell ]
   (RootLayout, Header, Navigation)
              │
   ┌──────────┴──────────┐
   │                     │
   ▼                     ▼
[ Shared Primitives ]  [ Future Feature Modules ]
(Button, Input, Card)  (src/features/<feature-name>/)
   │                     │
   │                     ├─► [ Feature Pages & Components ]
   │                     ├─► [ Feature Hooks & Forms ]
   │                     └─► [ Feature API Calls (useQuery/useMutation) ]
   │                                   │
   └──────────────┬────────────────────┘
                  │
                  ▼
         [ lib/api-client ]
      (Fetch wrapper, timeouts, auth headers, error normalization)
                  │
                  ▼
       [ Backend REST API ]
     (http://localhost:5000/api/v1)
```

---

## 4. Key Architectural Guarantees

1. **Deterministic Dependency Tree**:
   - `components/ui/` NEVER imports from `features/`.
   - `lib/` NEVER imports from `features/`.
   - `features/feature-A/` NEVER imports private internals of `features/feature-B/`. Shared contracts must go through `types/` or explicit feature public API barrels (`index.ts`).
2. **Explicit Public Interfaces**:
   - Every reusable folder exposes an `index.ts` barrel. Internal files can be refactored safely without breaking consumer imports.
3. **Type Safety Across Boundaries**:
   - Network payloads are parsed and validated. Responses follow standard `ApiResponse<T>` or `PaginatedApiResponse<T>` generic contracts.
