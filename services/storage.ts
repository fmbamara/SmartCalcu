
import { AnyHistoryItem, CurrencyCache } from '../types';
import { LOCALSTORAGE_KEYS } from '../constants';

// --- History Management ---

export const getHistory = (): AnyHistoryItem[] => {
  try {
    const items = localStorage.getItem(LOCALSTORAGE_KEYS.history);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error parsing history from localStorage", error);
    return [];
  }
};

export const saveHistory = (items: AnyHistoryItem[]): void => {
  localStorage.setItem(LOCALSTORAGE_KEYS.history, JSON.stringify(items));
};

export const addHistoryItem = (item: AnyHistoryItem): void => {
  const history = getHistory();
  // Keep history to a reasonable size, e.g., 100 items
  const newHistory = [item, ...history].slice(0, 100);
  saveHistory(newHistory);
};

export const clearHistory = (): void => {
  localStorage.removeItem(LOCALSTORAGE_KEYS.history);
};


// --- Currency Cache Management ---

export const getCurrencyCache = (): CurrencyCache | null => {
  try {
    const cache = localStorage.getItem(LOCALSTORAGE_KEYS.currencyCache);
    return cache ? JSON.parse(cache) : null;
  } catch (error) {
    console.error("Error parsing currency cache from localStorage", error);
    return null;
  }
};

export const setCurrencyCache = (cache: CurrencyCache): void => {
  localStorage.setItem(LOCALSTORAGE_KEYS.currencyCache, JSON.stringify(cache));
};
