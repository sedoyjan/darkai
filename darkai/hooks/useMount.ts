import { useEffect } from 'react';

export function useMount(mount: () => void) {
  useEffect(() => {
    return mount();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We need no deps here, to force this useEffect to act as mount/unmount one
  }, []);
}
