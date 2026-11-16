import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressLocationPicker } from './address-location-picker';

describe('AddressLocationPicker', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network sandbox offline'));
  });

  it('renders country, state, city, and postal code inputs', () => {
    const onCountryChange = vi.fn();
    const onStateChange = vi.fn();
    const onCityChange = vi.fn();
    const onPostalCodeChange = vi.fn();

    render(
      <AddressLocationPicker
        country="India"
        state="Karnataka"
        city="Bengaluru"
        postalCode="560001"
        onCountryChange={onCountryChange}
        onStateChange={onStateChange}
        onCityChange={onCityChange}
        onPostalCodeChange={onPostalCodeChange}
      />
    );

    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('State / Province')).toBeInTheDocument();
    expect(screen.getByText('City / District')).toBeInTheDocument();
    expect(screen.getByText('Postal / PIN Code')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bengaluru')).toBeInTheDocument();
    expect(screen.getByDisplayValue('560001')).toBeInTheDocument();
  });

  it('populates fallback countries when offline/sandboxed and selects a country', async () => {
    const onCountryChange = vi.fn();

    render(
      <AddressLocationPicker
        country=""
        state=""
        city=""
        postalCode=""
        onCountryChange={onCountryChange}
        onStateChange={vi.fn()}
        onCityChange={vi.fn()}
        onPostalCodeChange={vi.fn()}
      />
    );

    const countryButton = screen.getByRole('button', { name: /select country/i });
    expect(countryButton).toBeInTheDocument();

    await waitFor(() => {
      expect(countryButton).not.toBeDisabled();
    });

    fireEvent.click(countryButton);

    const indiaOption = await screen.findByRole('button', { name: 'India' });
    expect(indiaOption).toBeInTheDocument();

    fireEvent.click(indiaOption);
    expect(onCountryChange).toHaveBeenCalledWith('India');
  });

  it('handles postal code auto-fill for India PIN code via test fallback', async () => {
    const onStateChange = vi.fn();
    const onCityChange = vi.fn();
    const onPostalCodeChange = vi.fn();

    render(
      <AddressLocationPicker
        country="India"
        state=""
        city=""
        postalCode=""
        onCountryChange={vi.fn()}
        onStateChange={onStateChange}
        onCityChange={onCityChange}
        onPostalCodeChange={onPostalCodeChange}
      />
    );

    const postalInput = screen.getByPlaceholderText(/560001 or 97477/i);
    fireEvent.change(postalInput, { target: { value: '560001' } });

    await waitFor(() => {
      expect(onPostalCodeChange).toHaveBeenCalledWith('560001');
      expect(onStateChange).toHaveBeenCalledWith('Karnataka');
      expect(onCityChange).toHaveBeenCalledWith('Bengaluru');
    });
  });
});
