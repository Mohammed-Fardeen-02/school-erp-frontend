# Component Guidelines & Design System

## 1. Component Categorization

Components in the School ERP frontend are strictly divided into two categories:

### A. Shared UI Primitives (`src/components/`)

- **Location**: `src/components/{ui, forms, feedback, data-display, navigation}/`
- **Domain Knowledge**: **Zero**. Reusable across any web application.
- **Rules**:
  - Must accept standard HTML attributes when wrapping HTML elements.
  - Must support `className` overrides using `cn()`.
  - Must support keyboard accessibility (`aria-*`, `role`, focus management).
  - Must forward DOM refs via `React.forwardRef` where interactive.

### B. Feature-Specific Components (`src/features/<feature>/components/`)

- **Location**: Inside the corresponding feature directory.
- **Domain Knowledge**: High. Encapsulates business rules, specific entity visualizations, or domain workflows.
- **Rules**:
  - Consume shared UI primitives from `@/components`.
  - Connect to feature-specific hooks or server state queries.
  - Encapsulate presentation logic, delegating data mutation to hooks/API layer.

---

## 2. Component Best Practices

### Functional Components & TypeScript

Always type component props explicitly with an interface:

```tsx
// Good: Clear props interface
export interface StudentBadgeProps {
  status: 'active' | 'graduated' | 'suspended';
  className?: string;
}

export const StudentBadge: React.FC<StudentBadgeProps> = ({ status, className }) => {
  return (
    <Badge variant={mapStatusToVariant(status)} className={className}>
      {status}
    </Badge>
  );
};
```

### Forwarding Refs

For interactive base elements (`button`, `input`, `select`), forward the native element ref:

```tsx
export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});
Input.displayName = 'Input';
```

### Composition over Configuration

Avoid props that accept huge nested configuration objects. Use child composition:

```tsx
// Good: Composable Card
<Card header={<CardTitle>Student Summary</CardTitle>} footer={<Button>Save</Button>}>
  <p>Student details content</p>
</Card>
```

---

## 3. Accessibility (a11y) Standards

1. **Semantic HTML**: Use `<button>`, `<nav>`, `<main>`, `<header>`, `<article>` instead of clickable `<div>`s.
2. **Keyboard Navigation**: Interactive elements must be reachable and triggerable via `Tab`, `Enter`, and `Space`.
3. **Labels**: Every form input must have an associated `<label>` element with matching `htmlFor` / `id`.
4. **Color Contrast**: Follow WCAG AA contrast ratios (minimum 4.5:1 for normal text).
5. **Loading States**: Use `aria-busy="true"` and `role="status"` on loading indicators.
