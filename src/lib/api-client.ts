import { env } from '@/app/config/env';
import type { ApiErrorResponse, RequestOptions } from '@/types/api.types';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, status: number, code: string = 'API_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private token: string | null = null;
  private activeOrganizationId: string | null = null;
  private activeLocationId: string | null = null;

  constructor(
    baseUrl: string = env.VITE_API_BASE_URL,
    defaultTimeout: number = env.VITE_API_TIMEOUT
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Set the in-memory access token (never stored in localStorage)
   */
  public setToken(token: string | null): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  /**
   * Set active multi-tenant context headers for subsequent API calls
   */
  public setTenantContext(organizationId: string | null, locationId: string | null = null): void {
    this.activeOrganizationId = organizationId;
    this.activeLocationId = locationId;
  }

  public getOrganizationId(): string | null {
    return this.activeOrganizationId;
  }

  public getLocationId(): string | null {
    return this.activeLocationId;
  }

  private buildUrl(path: string, params?: RequestOptions['params']): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
    const { params, timeoutMs = this.defaultTimeout, headers, ...init } = options;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.activeOrganizationId) {
      defaultHeaders['X-Organization-Id'] = this.activeOrganizationId;
    }

    if (this.activeLocationId) {
      defaultHeaders['X-Location-Id'] = this.activeLocationId;
    }

    try {
      const response = await fetch(url, {
        ...init,
        credentials: 'include', // Include HTTP-only cookies for refresh tokens
        signal: controller.signal,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorData = data as ApiErrorResponse | null;
        const message = errorData?.error?.message || response.statusText || 'Request failed';
        const code = errorData?.error?.code || `HTTP_${response.status}`;
        throw new ApiClientError(message, response.status, code, errorData?.error?.details);
      }

      return data as TResponse;
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        throw err;
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiClientError('Request timed out', 408, 'REQUEST_TIMEOUT');
      }

      const message = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiClientError(message, 0, 'NETWORK_ERROR');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public get<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'GET' });
  }

  public post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patch<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
