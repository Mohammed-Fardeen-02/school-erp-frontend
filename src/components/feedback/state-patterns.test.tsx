import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  AccessDeniedState,
  NotFoundState,
  ErrorState,
  TableSkeleton,
  CardSkeleton,
} from './index';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Standard State Patterns (Stage W1.4)', () => {
  describe('AccessDeniedState', () => {
    it('renders 403 access restricted screen with required permission and navigation buttons', () => {
      render(
        <MemoryRouter>
          <AccessDeniedState
            title="Module Access Restricted"
            requiredPermission="academics:classes:read"
          />
        </MemoryRouter>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Module Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('academics:classes:read')).toBeInTheDocument();

      const returnBtn = screen.getByRole('button', { name: /return to workspaces/i });
      fireEvent.click(returnBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/workspace');
    });
  });

  describe('NotFoundState', () => {
    it('renders 404 record not found screen with resource identifier', () => {
      render(
        <MemoryRouter>
          <NotFoundState
            title="Class Not Found"
            resourceName="Grade 10 - Section A"
          />
        </MemoryRouter>
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByText('Class Not Found')).toBeInTheDocument();
      expect(screen.getByText('Grade 10 - Section A')).toBeInTheDocument();
    });
  });

  describe('ErrorState', () => {
    it('renders error message and triggers retry handler on click', () => {
      const handleRetry = vi.fn();
      render(
        <ErrorState
          title="Data Synchronization Error"
          message="Server connection timed out"
          onRetry={handleRetry}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Data Synchronization Error')).toBeInTheDocument();
      expect(screen.getByText('Server connection timed out')).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /retry request/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('LoadingSkeleton', () => {
    it('renders table and card skeletons with proper rows and counts', () => {
      render(
        <div>
          <TableSkeleton rows={4} columns={3} />
          <CardSkeleton count={3} />
        </div>
      );

      expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
      const cardSkeletons = screen.getAllByTestId('card-skeleton');
      expect(cardSkeletons).toHaveLength(3);
    });
  });
});

