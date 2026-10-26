import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] }
) {
  const testQueryClient = createTestQueryClient();

  const AllTheProviders = ({ children }: WrapperProps) => {
    return (
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={options?.initialEntries || ['/']}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: AllTheProviders, ...options }),
    queryClient: testQueryClient,
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
