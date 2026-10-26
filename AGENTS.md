# Mandatory Instructions for AI Coding Agents & LLMs

**Applies to**: Antigravity, GitHub Copilot, Claude, Cursor, and all automated coding agents working in this repository (`erp-frontend`).

You are acting on the enterprise-grade **School ERP Frontend** codebase designed as a **Feature-Based Modular Single Page Application**. You must adhere strictly to established architectural boundaries, coding standards, and safety guidelines.

---

## The 11 Core Directives for AI Agents

1. **Mandatory Documentation Inspection First**:
   - Before creating, moving, or refactoring files, read [`docs/architecture/FOLDER_STRUCTURE.md`](docs/architecture/FOLDER_STRUCTURE.md).
   - Before implementing any new feature, read [`docs/architecture/FRONTEND_ARCHITECTURE.md`](docs/architecture/FRONTEND_ARCHITECTURE.md), [`docs/architecture/STATE_MANAGEMENT.md`](docs/architecture/STATE_MANAGEMENT.md), and [`docs/architecture/API_INTEGRATION.md`](docs/architecture/API_INTEGRATION.md).
2. **Strict Feature Encapsulation**:
   - Place all business-specific logic inside the appropriate feature directory (`src/features/<feature-name>/`).
   - A feature must never deep-import private files or internal components from another feature. Communicate only through top-level feature index exports or shared types.
3. **Reuse Infrastructure & Shared Components**:
   - Never duplicate existing UI primitives or utilities.
   - Use `@/components/ui/button` for buttons, `@/components/forms/input` for text inputs, and `@/lib/utils` `cn()` for style composition.
   - Use `@/lib/api-client` (`apiClient`) for all network requests.
4. **Strict State Management Boundaries**:
   - Use **TanStack Query** exclusively for all asynchronous server-state (queries, mutations, pagination).
   - Use **Zustand** exclusively for transient client-side UI state.
   - NEVER duplicate or mirror TanStack Query cached records into Zustand.
5. **No Premature Business Feature Creation**:
   - **Never create additional business modules or dummy feature placeholders unless the user prompt explicitly requests their implementation.**
   - The `src/features/` directory must remain pristine and unpolluted with dummy code.
6. **No Arbitrary Architecture or Directory Changes**:
   - Never introduce new top-level directories under `src/` without explicit approval and documentation.
   - Do not install additional state management libraries (Redux, MobX) or form libraries (Formik, Yup).
7. **Scoped Changes & No Unrelated Refactoring**:
   - Never refactor unrelated components, configuration files, or formatting styles when implementing an assigned feature. Focus strictly on the requested task.
8. **Enforce TypeScript Strictness**:
   - Never use unjustified `any`. Use proper generic types, Discriminated Unions, or `unknown` with type guards.
   - Never silence TypeScript errors with `@ts-ignore` or `@ts-nocheck`.
9. **Maintain Documentation Integrity**:
   - When an architectural pattern or structural decision is modified or approved, update [`docs/architecture/ARCHITECTURE_CHANGELOG.md`](docs/architecture/ARCHITECTURE_CHANGELOG.md) and [`docs/architecture/FOLDER_STRUCTURE.md`](docs/architecture/FOLDER_STRUCTURE.md).
10. **Report Architectural Conflicts Proactively**:
    - If you encounter existing code that conflicts with the documented architecture, report the discrepancy clearly before making structural modifications.
11. **Mandatory Test Updates**:
    - Add or update unit and component tests for any modified or new behavior using Vitest and React Testing Library (`src/test/test-utils.tsx`).

---

## Repeatable Procedure for Implementing a Future Feature

When an explicit request to implement a feature (e.g. `students`, `fees`) is given:

1. **Establish the directory structure**:
   ```text
   src/features/<feature-name>/
   ├── api/
   ├── components/
   ├── hooks/
   ├── pages/
   ├── schemas/
   ├── types/
   ├── routes.tsx
   └── index.ts
   ```
2. **Define Contracts & Schemas**:
   - Create `types/<feature>.types.ts` for domain DTOs.
   - Create `schemas/<feature>.schema.ts` for Zod form validation.
3. **Define API Layer**:
   - Create query and mutation functions using `apiClient`.
   - Wrap queries and mutations in TanStack Query hooks.
4. **Build UI Components**:
   - Use shared UI components (`Button`, `Input`, `Card`, `Badge`) from `@/components`.
   - Wire forms with `useForm` and `zodResolver(schema)`.
5. **Mount Routes**:
   - Define sub-routes in `src/features/<feature-name>/routes.tsx`.
   - Mount the feature router into `src/app/router/app-router.tsx`.
6. **Write Tests**:
   - Create component tests alongside components (e.g., `feature-form.test.tsx`).
   - Use `renderWithProviders` from `@/test/test-utils`.

---

## Mandatory Verification Commands

Before concluding any code generation, refactoring, or feature implementation, you MUST run all 5 verification commands:

```bash
npm run format      # Prettier formatting check
npm run lint        # ESLint analysis
npm run typecheck   # Strict TypeScript compilation check (tsc --noEmit)
npm run test        # Vitest test suite execution
npm run build       # Production build validation (tsc -b && vite build)
```

All five commands must exit with code 0. Fix any errors or regressions caused by your changes immediately.
