import { useEffect, useRef } from 'react';

/**
 * https://usehooks.com/usePrevious/
 * NB: Deprecated, do not use.
 * @deprecated
 * @param value
 */
export function usePrevious<T>(value?: T): T | undefined {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

/**
 * This is an improved version of https://usehooks.com/usePrevious/
 * @param value
 */
export function usePreviousWithInitialValue<T>(value: T): T | undefined {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>(value);

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
