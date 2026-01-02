/**
 * useLocalStorage Hook
 *
 * A generic hook for persisting React state to localStorage with automatic
 * serialization/deserialization.
 *
 * Design Choices:
 * - Generic type parameter <T> allows reuse for any serializable data type
 * - Lazy initialization in useState prevents unnecessary localStorage reads
 * - useEffect for writes (not reads) avoids blocking the initial render
 * - Silent error handling prevents crashes from localStorage quota/access issues
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  /**
   * Initialize state with a lazy initializer function.
   * This runs only once on mount, reading from localStorage.
   * Falls back to initialValue if key doesn't exist or JSON is invalid.
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Handle JSON parse errors or localStorage access issues
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Sync state changes to localStorage.
   *
   * Design Choice: Using useEffect instead of writing in setValue ensures
   * that localStorage stays in sync even if state is modified by other means.
   * The dependency array [key, storedValue] handles both value changes and
   * potential key changes (though key changes are rare in practice).
   */
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Handle quota exceeded or access denied errors
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  /**
   * Memoized setter that supports both direct values and updater functions.
   * Mirrors the useState API for familiar usage patterns.
   */
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue];
}
