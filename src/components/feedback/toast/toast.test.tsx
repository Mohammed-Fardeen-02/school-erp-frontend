import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider } from './toast-provider';
import { useToast } from './toast-context';
import type { ToastContextValue } from './toast-types';

const TestComponent: React.FC = () => {
  const toast = useToast();

  return (
    <div>
      <button
        onClick={() => toast.success('Organization created successfully', 'Success')}
      >
        Trigger Success
      </button>
      <button
        onClick={() => toast.error('Failed to connect to SMTP', 'Connection Error')}
      >
        Trigger Error
      </button>
      <button
        onClick={() => toast.warning('Low storage remaining', 'Warning')}
      >
        Trigger Warning
      </button>
      <button
        onClick={() => toast.info('New system update available', 'Notice')}
      >
        Trigger Info
      </button>
      <button onClick={() => toast.clearAllToasts()}>Clear All</button>
    </div>
  );
};

describe('Toast Notification System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders success toast with title and message', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Trigger Success'));
    });

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Organization created successfully')).toBeInTheDocument();
  });

  it('renders error toast with role="alert"', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Trigger Error'));
    });

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to connect to SMTP')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('auto-dismisses after default duration', () => {
    render(
      <ToastProvider config={{ defaultDuration: 3000 }}>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Trigger Info'));
    });
    expect(screen.getByText('New system update available')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText('New system update available')).toBeNull();
  });

  it('allows manual dismissal via close button', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Trigger Warning'));
    });
    expect(screen.getByText('Low storage remaining')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close notification');
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByText('Low storage remaining')).toBeNull();
  });

  it('allows clearing all active toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Trigger Success'));
      fireEvent.click(screen.getByText('Trigger Error'));
    });

    expect(screen.getByText('Organization created successfully')).toBeInTheDocument();
    expect(screen.getByText('Failed to connect to SMTP')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText('Clear All'));
    });

    expect(screen.queryByText('Organization created successfully')).toBeNull();
    expect(screen.queryByText('Failed to connect to SMTP')).toBeNull();
  });

  it('falls back safely without throwing if useToast is used outside ToastProvider', () => {
    let capturedToast!: ToastContextValue;
    const SafeComponent: React.FC = () => {
      capturedToast = useToast();
      return <div>Safe Component</div>;
    };

    expect(() => render(<SafeComponent />)).not.toThrow();
    expect(capturedToast).toBeDefined();
    expect(typeof capturedToast.success).toBe('function');
    expect(() => capturedToast.success('test')).not.toThrow();
  });
});
