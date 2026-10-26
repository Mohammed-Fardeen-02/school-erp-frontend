# Frontend Testing Strategy

## 1. Testing Pyramid & Tooling

```text
       ▲
      / \        E2E Tests (Playwright - Future Stage)
     /   \       Critical user journeys & login flows
    /-----\
   /       \     Integration & Component Tests (Vitest + React Testing Library)
  /         \    Component interactions, form submissions, query lifecycles
 /-----------\
/             \  Unit Tests (Vitest)
──────────────── Pure utilities, formatting, Zod schemas, Zustand store mutations
```

### Core Technologies

- **Test Runner**: Vitest (instant execution, matches Vite configuration).
- **DOM Simulation**: JSDOM.
- **Matchers**: `@testing-library/jest-dom` for expressive DOM assertions (`toBeInTheDocument`, `toBeDisabled`).
- **Rendering & Interaction**: `@testing-library/react` and `@testing-library/user-event`.

---

## 2. Shared Test Harness (`src/test/test-utils.tsx`)

Never render components needing TanStack Query or routing without the test provider wrapper:

```tsx
import { render, screen } from '@/test/test-utils';
import { MyQueryComponent } from './my-query-component';

test('renders query data', async () => {
  render(<MyQueryComponent />);
  expect(await screen.findByText('Expected Content')).toBeInTheDocument();
});
```

The custom `render` in `test-utils.tsx` automatically configures:

- An isolated `QueryClient` with retries and garbage collection disabled to ensure tests are fast and deterministic.
- A `MemoryRouter` with optional initial navigation entries.

---

## 3. Best Testing Practices

1. **Test User Behavior, Not Implementation Details**: Query by accessible roles (`getByRole('button', { name: /save/i })`) or text rather than CSS classes or DOM hierarchy.
2. **Deterministic & Isolated**: Reset mocks and cleanup DOM after every test (configured automatically in `src/test/setup.ts`).
3. **Co-location**: Place component unit tests directly alongside the component file (e.g. `button.tsx` and `button.test.tsx`).
