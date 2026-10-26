# Routing and Access Control Guidelines

## 1. Routing Architecture

Routing is configured declaratively using **React Router v6** in `src/app/router/`.

### Core Routing Principles

1. **Centralized Route Constants**: All URL path strings are defined in `src/app/router/routes.ts` or feature-level route constants. Never hardcode magic URL strings across components.
2. **Layout Shells**: Layouts (like `RootLayout`) encapsulate navigation headers, sidebars, and footer footers, exposing `<Outlet />` for nested route views.
3. **Lazy Loading**: Future feature pages must be lazy-loaded using `React.lazy()` and `<Suspense>` to keep the initial application bundle lean.

---

## 2. Frontend Access Control & Route Guards

### Critical Security Axiom

> **Frontend route guards provide User Experience (UX) redirection ONLY.**
> Frontend checks cannot prevent unauthorized data access. The backend REST API is the **sole authoritative source of security and authorization**. Every protected API endpoint verifies JWT tokens, user permissions, and tenant isolation (`schoolId`).

### UX Guard Pattern

Route guards wrap protected route subtrees:

```tsx
// Example UX Guard usage
<Route
  path="/students"
  element={
    <AuthGuard isAuthenticated={isAuthenticated}>
      <StudentsFeatureRoutes />
    </AuthGuard>
  }
/>
```

When unauthenticated or unauthorized, the user is gracefully redirected to the login page or a "Permission Denied" view, preserving their intended destination in router `state.from`.
