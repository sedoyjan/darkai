import { useEffect, useState } from 'react';

export const useTimerKey = (
  delay: number = 1000 * 60,
  name: string = 'timer',
) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(key => key + 1);
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);

  return `${name}-${key}`;
};
