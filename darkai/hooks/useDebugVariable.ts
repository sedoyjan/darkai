import equal from 'fast-deep-equal/es6';
import { useEffect, useRef } from 'react';

/**
 * This hook is used to debug variables. It will log to the console when the variable changes.
 * It can be useful to debug why a component is re-rendering.
 * With this hook, you can see if the variable is changing when it shouldn't be.
 *
 * @param value - variable to debug
 * @param name - optional variable name for debugging
 */
export function useDebugVariable<T>(value: T, name?: string) {
  const prev = useRef<T>(value);
  useEffect(() => {
    if (prev.current && prev.current !== value) {
      const isEqual = equal(prev.current, value);
      // eslint-disable-next-line no-console -- this is for debugging
      console.log(
        `${name || 'Variable'} changed, ${
          isEqual ? 'but values are equal!!!' : 'and values are different'
        }`,
        isEqual ? JSON.stringify(value).slice(0, 100) : '',
      );
    }
    prev.current = value;
  });
}
