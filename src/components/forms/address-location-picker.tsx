import React, { useEffect, useState } from 'react';
import { Globe, MapPin, Search, Loader2 } from 'lucide-react';
import { Select } from './select';
import { Input } from './input';
import { useCountriesNow } from '@/hooks/use-countries-now';
import { usePostalCodeLookup } from '@/hooks/use-postal-code-lookup';

export interface AddressLocationPickerProps {
  country: string;
  state: string;
  city: string;
  postalCode: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onPostalCodeChange: (postalCode: string) => void;
  disabled?: boolean;
  errors?: {
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
  };
}

export const AddressLocationPicker: React.FC<AddressLocationPickerProps> = ({
  country,
  state,
  city,
  postalCode,
  onCountryChange,
  onStateChange,
  onCityChange,
  onPostalCodeChange,
  disabled = false,
  errors = {},
}) => {
  const { countries, states, fetchStates, statesLoading, countriesLoading } = useCountriesNow();
  const { lookupPostalCode, loading: postalLoading } = usePostalCodeLookup();
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);

  // Load states whenever country changes
  useEffect(() => {
    if (country) {
      void fetchStates(country);
    }
  }, [country, fetchStates]);

  const handleCountrySelect = (e: { target: { value: string } }) => {
    const newCountry = e.target.value;
    onCountryChange(newCountry);
    onStateChange('');
    onCityChange('');
    setLookupFeedback(null);
  };

  const handleStateSelect = (e: { target: { value: string } }) => {
    onStateChange(e.target.value);
  };

  const handlePostalCodeLookup = async (code: string) => {
    onPostalCodeChange(code);
    if (code.trim().length >= 4) {
      const result = await lookupPostalCode(code, country || 'India');
      if (result.success) {
        if (result.city) onCityChange(result.city);
        if (result.state) onStateChange(result.state);
        if (result.country && !country) onCountryChange(result.country);
        setLookupFeedback(`Auto-detected: ${result.city}, ${result.state}`);
      } else {
        setLookupFeedback(null);
      }
    } else {
      setLookupFeedback(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Country Dropdown populated from Public API */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>Country</span>
            </span>
            {countriesLoading && <span className="text-[10px] text-muted-foreground animate-pulse">Loading...</span>}
          </label>
          <Select
            value={country}
            onChange={handleCountrySelect}
            disabled={disabled || countriesLoading}
            error={Boolean(errors.country)}
            placeholder="Select Country..."
          >
            <option value="">Select Country...</option>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
          {errors.country && <p className="text-xs text-danger">{errors.country}</p>}
        </div>

        {/* State / Province Dropdown populated dynamically */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span>State / Province</span>
            </span>
            {statesLoading && <span className="text-[10px] text-muted-foreground animate-pulse">Fetching states...</span>}
          </label>
          {states.length > 0 ? (
            <Select
              value={state}
              onChange={handleStateSelect}
              disabled={disabled || statesLoading || !country}
              error={Boolean(errors.state)}
              placeholder="Select State / Province..."
            >
              <option value="">Select State / Province...</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              placeholder={country ? 'Enter state name...' : 'Select country first...'}
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              disabled={disabled}
              error={errors.state}
            />
          )}
          {errors.state && <p className="text-xs text-danger">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* City Input */}
        <Input
          label="City / District"
          placeholder="e.g. Springfield or Bengaluru"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled}
          error={errors.city}
        />

        {/* Postal / PIN Code Input with Auto-Lookup */}
        <div className="space-y-1">
          <Input
            label="Postal / PIN Code"
            placeholder="e.g. 560001 or 97477"
            value={postalCode}
            onChange={(e) => handlePostalCodeLookup(e.target.value)}
            disabled={disabled}
            error={errors.postalCode}
            rightAction={
              postalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <button
                  type="button"
                  title="Lookup City & State"
                  aria-label="Lookup City & State"
                  onClick={() => handlePostalCodeLookup(postalCode)}
                  className="p-1 rounded hover:bg-surface-muted transition-colors text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center"
                >
                  <Search className="h-4 w-4" />
                </button>
              )
            }
          />
          {lookupFeedback && (
            <p className="text-[11px] font-medium text-emerald-600 animate-in fade-in-0">
              {lookupFeedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

