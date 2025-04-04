import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboardHeight = () => {
  const baseKeyboardHeight = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      if (
        e.endCoordinates.height !== baseKeyboardHeight.current &&
        e.endCoordinates.height > 0
      ) {
        setKeyboardHeight(e.endCoordinates.height);
        baseKeyboardHeight.current = e.endCoordinates.height;
      }
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }
    function onKeyboardWillShow(_e: KeyboardEvent) {
      if (baseKeyboardHeight.current > 0 && !keyboardHeight) {
        setKeyboardHeight(baseKeyboardHeight.current);
      }
    }

    function onKeyboardWillHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    const willShowSubscription = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardWillShow,
    );
    const willHideSubscription = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardWillHide,
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      willShowSubscription.remove();
      willHideSubscription.remove();
    };
  }, [baseKeyboardHeight, keyboardHeight]);

  return keyboardHeight;
};
