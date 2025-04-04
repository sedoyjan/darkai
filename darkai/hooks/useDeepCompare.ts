import equal from 'fast-deep-equal/es6';
import { useRef } from 'react';

export function useDeepCompare<T>(val: T): T {
  const cacheRef = useRef<T>(val);

  if (!equal(cacheRef.current, val)) {
    cacheRef.current = val;
  }

  return cacheRef.current;
}
