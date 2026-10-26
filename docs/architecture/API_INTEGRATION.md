# API Integration & Networking

## 1. Centralized HTTP Client (`src/lib/api-client.ts`)

All network communication with the School ERP backend passes through the centralized `ApiClient` instance.

### Features

- Configurable base URL via environment variable `VITE_API_BASE_URL`.
- Default request timeout enforcement using native `AbortController` (defaults to 15000ms).
- Uniform JSON header injection (`Content-Type`, `Accept`).
- Standardized error transformation into `ApiClientError`.
- Clean query parameter serialization supporting booleans, numbers, and strings.

```typescript
import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';

// Example generic GET request
const response = await apiClient.get<ApiResponse<StudentDTO>>('/students/123');
```

---

## 2. Standard API Response Contracts

The backend modular monolith delivers structured JSON conforming to `ResponseHelper`. The frontend types mirror this:

### Standard Entity Response

```typescript
export interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data: TData;
  timestamp: string;
}
```

### Paginated List Response

```typescript
export interface PaginatedApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data: TData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}
```

### Standard Error Response

```typescript
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string; code?: string }>;
  };
  timestamp: string;
}
```

---

## 3. Error Handling Architecture

When an HTTP status is >= 400 or network fails, `apiClient` throws an `ApiClientError`:

```typescript
export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;
}
```

In feature queries or mutations, capture these errors gracefully:

- In React Hook Form: Map `details` array to individual form fields via `setError(field, { message })`.
- In TanStack Query `onError`: Display toast notifications for unexpected network or server errors.
