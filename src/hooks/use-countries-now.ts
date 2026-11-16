import { useState, useCallback, useEffect } from 'react';

export interface CountryItem {
  name: string;
  iso2: string;
  iso3?: string;
}

export interface StateItem {
  name: string;
  state_code?: string;
}

// Resilient default country list with ISO2 codes for offline / sandbox fallback
export const FALLBACK_COUNTRIES: CountryItem[] = [
  { name: 'India', iso2: 'IN', iso3: 'IND' },
  { name: 'United States', iso2: 'US', iso3: 'USA' },
  { name: 'United Kingdom', iso2: 'GB', iso3: 'GBR' },
  { name: 'United Arab Emirates', iso2: 'AE', iso3: 'ARE' },
  { name: 'Canada', iso2: 'CA', iso3: 'CAN' },
  { name: 'Australia', iso2: 'AU', iso3: 'AUS' },
  { name: 'Singapore', iso2: 'SG', iso3: 'SGP' },
  { name: 'Germany', iso2: 'DE', iso3: 'DEU' },
  { name: 'France', iso2: 'FR', iso3: 'FRA' },
  { name: 'Saudi Arabia', iso2: 'SA', iso3: 'SAU' },
  { name: 'Qatar', iso2: 'QA', iso3: 'QAT' },
  { name: 'Malaysia', iso2: 'MY', iso3: 'MYS' },
];

export const FALLBACK_STATES: Record<string, string[]> = {
  India: [
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ],
  'United States': [
    'California',
    'Florida',
    'Georgia',
    'Illinois',
    'Massachusetts',
    'New Jersey',
    'New York',
    'North Carolina',
    'Ohio',
    'Oregon',
    'Pennsylvania',
    'Texas',
    'Virginia',
    'Washington',
  ],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'United Arab Emirates': ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  Canada: ['Alberta', 'British Columbia', 'Ontario', 'Quebec'],
  Australia: ['New South Wales', 'Queensland', 'Victoria', 'Western Australia'],
};

export const useCountriesNow = () => {
  const [countries, setCountries] = useState<CountryItem[]>(FALLBACK_COUNTRIES);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Fetch all countries on initialization or demand
  const fetchCountries = useCallback(async (): Promise<CountryItem[]> => {
    setCountriesLoading(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const mapped: CountryItem[] = json.data.map((item: any) => ({
            name: item.country || item.name,
            iso2: item.iso2 || item.code || '',
            iso3: item.iso3 || '',
          }));
          setCountries(mapped);
          return mapped;
        }
      }
    } catch {
      // Fallback on network refusal / sandbox mode
    } finally {
      setCountriesLoading(false);
    }
    setCountries(FALLBACK_COUNTRIES);
    return FALLBACK_COUNTRIES;
  }, []);

  // Fetch states for a chosen country
  const fetchStates = useCallback(async (countryName: string): Promise<string[]> => {
    if (!countryName) {
      setStates([]);
      return [];
    }

    setStatesLoading(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json?.data?.states && Array.isArray(json.data.states)) {
          const stateNames = json.data.states.map((s: StateItem) => s.name);
          setStates(stateNames);
          return stateNames;
        }
      }
    } catch {
      // Fallback
    } finally {
      setStatesLoading(false);
    }

    // Check fallback states
    const fallbackList = FALLBACK_STATES[countryName] || [];
    setStates(fallbackList);
    return fallbackList;
  }, []);

  // Fetch cities for a country and state
  const fetchCities = useCallback(async (countryName: string, stateName: string): Promise<string[]> => {
    if (!countryName || !stateName) {
      setCities([]);
      return [];
    }

    setCitiesLoading(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName, state: stateName }),
      });

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json?.data)) {
          setCities(json.data);
          return json.data;
        }
      }
    } catch {
      // Fallback
    } finally {
      setCitiesLoading(false);
    }

    setCities([]);
    return [];
  }, []);

  const clearStates = useCallback(() => setStates([]), []);
  const clearCities = useCallback(() => setCities([]), []);

  useEffect(() => {
    void fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    states,
    cities,
    countriesLoading,
    statesLoading,
    citiesLoading,
    fetchCountries,
    fetchStates,
    fetchCities,
    clearStates,
    clearCities,
  };
};

