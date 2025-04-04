import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';

import { usePreviousWithInitialValue } from './usePrevious';

export const useFocusCallback = (clb: () => void) => {
  const isFocused = useIsFocused();
  const isFocusedPrev = usePreviousWithInitialValue(isFocused);

  useEffect(() => {
    if (isFocused && !isFocusedPrev) {
      clb();
    }
  }, [clb, isFocused, isFocusedPrev]);
};
