# State Management Architecture

## 1. Core Philosophy: The Two States

In a modern enterprise web application, state is partitioned into two distinct categories:

```text
┌─────────────────────────────────────────────────────────────┐
│                    Application State                        │
├──────────────────────────────┬──────────────────────────────┤
│        Server State          │         Client State         │
│     (TanStack Query v5)      │         (Zustand v5)         │
├──────────────────────────────┼──────────────────────────────┤
│ - Persisted in backend DB    │ - Exists only in browser memory│
│ - Asynchronous lifecycle     │ - Synchronous lifecycle      │
│ - Shared across users        │ - User's local session only  │
│ - Needs caching & re-fetching│ - Needs no network sync      │
│ - Examples:                  │ - Examples:                  │
│   • Student records          │   • Sidebar collapsed        │
│   • Fee invoices             │   • Color theme (light/dark) │
│   • Timetable slots          │   • Active wizard step       │
│   • Attendance registers     │   • Open modal dialog ID     │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Server State with TanStack Query v5

### Standard Query Pattern

Define query keys in a predictable factory object to facilitate targeted cache invalidation:

```typescript
// features/students/api/student-queries.ts
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: StudentFilterParams) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

export function useStudentsQuery(params: StudentFilterParams) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => fetchStudents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Mutation Pattern & Invalidation

Invalidate related query keys upon successful mutations:

```typescript
export function useCreateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentInput) => createStudent(data),
    onSuccess: () => {
      // Invalidate all student lists so tables refresh automatically
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
}
```

---

## 3. Client State with Zustand v5

### Guidelines

1. **Single Responsibility**: Create dedicated small stores per client domain (`useUiStore`, `useAuthStore`) rather than one massive monolithic store.
2. **Minimal Selectors**: Use selector functions to prevent unnecessary re-renders:
   ```typescript
   // Good: Re-renders only when sidebarOpen changes
   const sidebarOpen = useUiStore(state => state.sidebarOpen);
   ```
3. **No Redux / Context**: Zustand replaces Redux and Context API for global state. Do not install Redux or duplicate state across Contexts.

---

## 4. Anti-Patterns to Avoid

- **Anti-Pattern 1: Duplicating Server State in Zustand**:
  _Incorrect_: Fetching students with TanStack Query and immediately copying them into `useStudentStore`.
  _Correction_: Consume the query hook directly in components. TanStack Query IS your state cache.
- **Anti-Pattern 2: Storing Form State Globally**:
  _Incorrect_: Putting unsubmitted form field inputs in Zustand.
  _Correction_: Keep form inputs inside React Hook Form local state.
