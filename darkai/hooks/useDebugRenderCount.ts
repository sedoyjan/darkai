import { useEffect, useRef } from 'react';

/**
 * This hook is used to debug how many times a component is re-rendering.
 *
 * @param name - the name of the component to debug
 */
export function useDebugRenderCount(name: string) {
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current += 1;
    // eslint-disable-next-line no-console -- this is for debugging
    console.log(`${name} rendered ${countRef.current} times`);
  });
}
