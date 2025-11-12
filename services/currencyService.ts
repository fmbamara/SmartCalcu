
import { CURRENCY_API_URL, CURRENCY_CACHE_TTL } from '../constants';
import { CurrencyCache } from '../types';
import { getCurrencyCache, setCurrencyCache } from './storage';

export const getRates = async (base: string): Promise<{ rates: { [key: string]: number }; isCached: boolean; timestamp?: number }> => {
  const cachedData = getCurrencyCache();

  if (cachedData && cachedData.base === base && (Date.now() - cachedData.timestamp < CURRENCY_CACHE_TTL)) {
    console.log('Using cached currency rates.');
    return { rates: cachedData.rates, isCached: true, timestamp: cachedData.timestamp };
  }

  try {
    console.log(`Fetching new rates for base: ${base}`);
    const response = await fetch(`${CURRENCY_API_URL}?base=${base}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    if (data.rates) {
      const newCache: CurrencyCache = {
        base,
        rates: data.rates,
        timestamp: Date.now(),
      };
      setCurrencyCache(newCache);
      return { rates: data.rates, isCached: false, timestamp: newCache.timestamp };
    } else {
        throw new Error('Invalid API response structure');
    }

  } catch (error) {
    console.error('Failed to fetch new rates:', error);
    // If fetch fails but we have stale cache, use it as a fallback.
    if (cachedData && cachedData.base === base) {
      console.warn('API fetch failed, using stale cached data.');
      return { rates: cachedData.rates, isCached: true, timestamp: cachedData.timestamp };
    }
    // If no cache and fetch fails, throw error
    throw new Error('Could not retrieve currency rates.');
  }
};
