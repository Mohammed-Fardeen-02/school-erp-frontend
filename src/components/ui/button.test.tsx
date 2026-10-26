import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles loading state with disabled attribute', () => {
    render(<Button isLoading>Loading Action</Button>);
    const button = screen.getByRole('button', { name: /loading action/i });
    expect(button).toBeDisabled();
  });
});
