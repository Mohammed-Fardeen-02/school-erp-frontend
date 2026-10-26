# Contributing & Feature Development Standard

This document details the mandatory procedure for contributing new code or implementing future ERP business features in the School ERP frontend.

---

## 1. The 7-Step Future Feature Implementation Standard

When assigned to implement a new business module (e.g. `students`, `fees`, `attendance`), developers and AI agents must follow this sequential process:

### Step 1: Create the Feature Directory

Create `src/features/<feature-name>/`. Create only the layers needed:

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

### Step 2: Define Types & Zod Schemas

- Define entity interfaces and DTOs in `types/<feature>.types.ts`.
- Define validation schemas in `schemas/<feature>.schema.ts` matching backend validation rules.

### Step 3: Implement API Layer

- Write query functions and mutation functions using `apiClient` (`@/lib/api-client`).
- Export query key factories and custom hooks using `useQuery` / `useMutation`.

### Step 4: Build Feature Components

- Build presentation components in `components/`.
- Use shared UI primitives from `@/components`.
- Wire forms using `useForm` with `zodResolver`.

### Step 5: Implement Feature Pages & Routes

- Create page views in `pages/`.
- Declare sub-routes in `routes.tsx`.
- Connect the feature routes into `src/app/router/app-router.tsx`.

### Step 6: Expose Public API

- Export only public components, routes, or hooks from `src/features/<feature-name>/index.ts`. Keep private helpers encapsulated.

### Step 7: Write Tests & Run Quality Gates

- Write component and hook tests with `@/test/test-utils`.
- Run all 5 mandatory verification checks:
  ```bash
  npm run format
  npm run lint
  npm run typecheck
  npm run test
  npm run build
  ```

---

## 2. Commit & Code Style Standards

- Format all code with Prettier before committing (`npm run format:fix`).
- Keep components focused and small (< 250 lines).
- Avoid premature abstractions; only promote a feature component to `src/components/` if it is actively required across multiple independent business domains.
