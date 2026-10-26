import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Application Foundation', () => {
  it('renders the technical status shell successfully', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Frontend Architecture Foundation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Architecture Status/i })).toBeInTheDocument();
  });

  it('displays the empty feature modules count in skeleton mode', () => {
    render(<App />);

    expect(screen.getByText(/0 \(Skeleton Only\)/i)).toBeInTheDocument();
  });
});
