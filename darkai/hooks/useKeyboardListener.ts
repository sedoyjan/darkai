import { useEffect } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardListener = ({
  onKeyboardDidShow,
  onKeyboardDidHide,
}: {
  onKeyboardDidShow: () => void;
  onKeyboardDidHide: () => void;
}) => {
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [onKeyboardDidHide, onKeyboardDidShow]);
};
