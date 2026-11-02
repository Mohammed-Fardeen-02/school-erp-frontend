import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TriStateCheckbox } from './tri-state-checkbox';

describe('TriStateCheckbox Component', () => {
  it('renders EXPLICIT_GRANT state correctly', () => {
    const handleClick = vi.fn();
    render(
      <TriStateCheckbox
        displayState="EXPLICIT_GRANT"
        onClick={handleClick}
        ariaLabel="Explicit grant toggle"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /explicit grant toggle/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox.className).toContain('bg-emerald-600');

    fireEvent.click(checkbox);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders EXPLICIT_DENY state correctly', () => {
    render(<TriStateCheckbox displayState="EXPLICIT_DENY" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox.className).toContain('bg-rose-600');
  });

  it('renders INHERITED_GRANT state with distinct border styling', () => {
    render(<TriStateCheckbox displayState="INHERITED_GRANT" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox.className).toContain('border-emerald-400');
  });

  it('renders INHERITED_DENY state with distinct border styling', () => {
    render(<TriStateCheckbox displayState="INHERITED_DENY" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox.className).toContain('border-rose-400');
  });

  it('renders MIXED container state with aria-checked="mixed"', () => {
    render(<TriStateCheckbox displayState="MIXED" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox.className).toContain('bg-amber-500');
  });

  it('renders DEFAULT_DENY empty state', () => {
    render(<TriStateCheckbox displayState="DEFAULT_DENY" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox.className).toContain('bg-surface');
  });

  it('respects disabled prop and prevents onClick', () => {
    const handleClick = vi.fn();
    render(
      <TriStateCheckbox
        displayState="DEFAULT_DENY"
        disabled={true}
        onClick={handleClick}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox.className).toContain('cursor-not-allowed');

    fireEvent.click(checkbox);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
