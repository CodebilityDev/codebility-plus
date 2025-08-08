// hooks/useCountries.ts
import { useState, useEffect } from 'react';

// Types for our formatted country options
interface CountryOption {
  value: string;
  label: string;
}

// Type for the API response
interface ApiCountry {
  cca2: string;
  name: { common: string };
}

// Static fallback countries to prevent empty selects
const FALLBACK_COUNTRIES: CountryOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ph', label: 'Philippines' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'sg', label: 'Singapore' },
  { value: 'in', label: 'India' }
];

const fetchCountries = async (): Promise<ApiCountry[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all', {
    cache: 'force-cache'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  
  const data = await response.json();
  return data as ApiCountry[];
};

export const useCountries = () => {
  const [countries, setCountries] = useState<CountryOption[]>(FALLBACK_COUNTRIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadCountries = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const countryData = await fetchCountries();
        
        if (!isMounted) return;
        
        const formattedCountries = countryData
          .map((country) => ({
            value: country.cca2.toLowerCase(),
            label: country.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setCountries(formattedCountries);
      } catch (err) {
        if (!isMounted) return;
        
        console.warn('Failed to load countries, using fallback list:', err);
        setError('Could not load full country list');
        // Keep fallback countries - don't reset to empty array
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadCountries();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { countries, isLoading, error };
};