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

// ✅ Type for cached data
interface CachedData {
  data: CountryOption[];
  timestamp: number;
}

// ✅ COMPREHENSIVE fallback countries (all major countries)
const FALLBACK_COUNTRIES: CountryOption[] = [
  { value: 'af', label: 'Afghanistan' },
  { value: 'al', label: 'Albania' },
  { value: 'dz', label: 'Algeria' },
  { value: 'ar', label: 'Argentina' },
  { value: 'am', label: 'Armenia' },
  { value: 'au', label: 'Australia' },
  { value: 'at', label: 'Austria' },
  { value: 'az', label: 'Azerbaijan' },
  { value: 'bh', label: 'Bahrain' },
  { value: 'bd', label: 'Bangladesh' },
  { value: 'by', label: 'Belarus' },
  { value: 'be', label: 'Belgium' },
  { value: 'br', label: 'Brazil' },
  { value: 'bn', label: 'Brunei' },
  { value: 'bg', label: 'Bulgaria' },
  { value: 'kh', label: 'Cambodia' },
  { value: 'cm', label: 'Cameroon' },
  { value: 'ca', label: 'Canada' },
  { value: 'cl', label: 'Chile' },
  { value: 'cn', label: 'China' },
  { value: 'co', label: 'Colombia' },
  { value: 'cr', label: 'Costa Rica' },
  { value: 'hr', label: 'Croatia' },
  { value: 'cy', label: 'Cyprus' },
  { value: 'cz', label: 'Czech Republic' },
  { value: 'dk', label: 'Denmark' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'eg', label: 'Egypt' },
  { value: 'sv', label: 'El Salvador' },
  { value: 'ee', label: 'Estonia' },
  { value: 'et', label: 'Ethiopia' },
  { value: 'fi', label: 'Finland' },
  { value: 'fr', label: 'France' },
  { value: 'ge', label: 'Georgia' },
  { value: 'de', label: 'Germany' },
  { value: 'gh', label: 'Ghana' },
  { value: 'gr', label: 'Greece' },
  { value: 'gt', label: 'Guatemala' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'hu', label: 'Hungary' },
  { value: 'is', label: 'Iceland' },
  { value: 'in', label: 'India' },
  { value: 'id', label: 'Indonesia' },
  { value: 'ir', label: 'Iran' },
  { value: 'iq', label: 'Iraq' },
  { value: 'ie', label: 'Ireland' },
  { value: 'il', label: 'Israel' },
  { value: 'it', label: 'Italy' },
  { value: 'jm', label: 'Jamaica' },
  { value: 'jp', label: 'Japan' },
  { value: 'jo', label: 'Jordan' },
  { value: 'kz', label: 'Kazakhstan' },
  { value: 'ke', label: 'Kenya' },
  { value: 'kw', label: 'Kuwait' },
  { value: 'lv', label: 'Latvia' },
  { value: 'lb', label: 'Lebanon' },
  { value: 'lt', label: 'Lithuania' },
  { value: 'lu', label: 'Luxembourg' },
  { value: 'my', label: 'Malaysia' },
  { value: 'mt', label: 'Malta' },
  { value: 'mx', label: 'Mexico' },
  { value: 'ma', label: 'Morocco' },
  { value: 'mm', label: 'Myanmar' },
  { value: 'np', label: 'Nepal' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'no', label: 'Norway' },
  { value: 'om', label: 'Oman' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'pa', label: 'Panama' },
  { value: 'pe', label: 'Peru' },
  { value: 'ph', label: 'Philippines' },
  { value: 'pl', label: 'Poland' },
  { value: 'pt', label: 'Portugal' },
  { value: 'qa', label: 'Qatar' },
  { value: 'ro', label: 'Romania' },
  { value: 'ru', label: 'Russia' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'rs', label: 'Serbia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'sk', label: 'Slovakia' },
  { value: 'si', label: 'Slovenia' },
  { value: 'za', label: 'South Africa' },
  { value: 'kr', label: 'South Korea' },
  { value: 'es', label: 'Spain' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'se', label: 'Sweden' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'th', label: 'Thailand' },
  { value: 'tr', label: 'Turkey' },
  { value: 'ua', label: 'Ukraine' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'uy', label: 'Uruguay' },
  { value: 've', label: 'Venezuela' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'ye', label: 'Yemen' },
  { value: 'zm', label: 'Zambia' },
  { value: 'zw', label: 'Zimbabwe' },
];

// ✅ Cache key for localStorage
const CACHE_KEY = 'countries_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ✅ Get cached countries from localStorage
const getCachedCountries = (): CountryOption[] | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached) as CachedData;
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.warn('Failed to read cached countries:', error);
    return null;
  }
};

// ✅ Save countries to localStorage
const setCachedCountries = (countries: CountryOption[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData: CachedData = {
      data: countries,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache countries:', error);
  }
};

// ✅ Fetch countries with timeout
const fetchCountries = async (): Promise<ApiCountry[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    const response = await fetch('https://restcountries.com/v3.1/all', {
      signal: controller.signal,
      cache: 'force-cache',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as ApiCountry[];
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - using cached data');
      }
      throw error;
    }
    throw new Error('Unknown error fetching countries');
  }
};

export const useCountries = () => {
  const [countries, setCountries] = useState<CountryOption[]>(() => {
    // ✅ Try to load from cache on initial render
    const cached = getCachedCountries();
    return cached || FALLBACK_COUNTRIES;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadCountries = async () => {
      // ✅ Check cache first
      const cached = getCachedCountries();
      if (cached) {
        console.log('✅ Using cached countries');
        setCountries(cached);
        return; // Don't fetch if we have valid cache
      }
      
      // ✅ No cache, fetch from API
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🌍 Fetching countries from API...');
        const countryData = await fetchCountries();
        
        if (!isMounted) return;
        
        const formattedCountries = countryData
          .map((country) => ({
            value: country.cca2.toLowerCase(),
            label: country.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setCountries(formattedCountries);
        setCachedCountries(formattedCountries); // ✅ Cache the results
        console.log('✅ Countries loaded and cached successfully');
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.warn('⚠️ Failed to load countries from API, using fallback list:', errorMessage);
        setError('Using offline country list');
        
        // ✅ Keep fallback countries - don't reset to empty array
        setCountries(FALLBACK_COUNTRIES);
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