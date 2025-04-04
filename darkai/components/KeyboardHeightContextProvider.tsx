import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

import { selectKeyboardHeight } from '@/rdx/settings/selectors';
import { setKeyboardHeight as setKeyboardHeightAction } from '@/rdx/settings/slice';
import { useAppDispatch, useAppSelector } from '@/rdx/store';

interface KeyboardHeightContextType {
  keyboardHeight: number;
  isOpen: boolean;
}

const KeyboardHeightContext = createContext<KeyboardHeightContextType | null>(
  null,
);
KeyboardHeightContext.displayName = 'KeyboardHeightContext';

const defaultKeyboardHeightContext: KeyboardHeightContextType = {
  keyboardHeight: 0,
  isOpen: false,
};

export const useKeyboardHeightContext = () => {
  const ctx = useContext(KeyboardHeightContext);
  return ctx || defaultKeyboardHeightContext;
};

interface KeyboardHeightContextProviderProps {
  children: ReactNode;
}

export const KeyboardHeightContextProvider = ({
  children,
}: KeyboardHeightContextProviderProps) => {
  const storedKeyboardHeight = useAppSelector(selectKeyboardHeight);
  const [keyboardHeight, setKeyboardHeight] = useState(
    storedKeyboardHeight || 0,
  );
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const onKeyboardDidShow = useCallback(
    (e: KeyboardEvent) => {
      const newHeight = e.endCoordinates.height;
      if (newHeight && newHeight !== storedKeyboardHeight) {
        dispatch(setKeyboardHeightAction(newHeight));
        setKeyboardHeight(newHeight);
      }
    },
    [dispatch, storedKeyboardHeight], // Only re-create if stored height changes
  );

  const onKeyboardWillShow = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onKeyboardWillHide = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', onKeyboardDidShow),
      Keyboard.addListener('keyboardWillShow', onKeyboardWillShow),
      Keyboard.addListener('keyboardWillHide', onKeyboardWillHide),
    ];

    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, [onKeyboardDidShow, onKeyboardWillShow, onKeyboardWillHide]);

  const keyboardHeightContext = useMemo(
    () => ({
      keyboardHeight,
      isOpen,
    }),
    [keyboardHeight, isOpen],
  );

  return (
    <KeyboardHeightContext.Provider value={keyboardHeightContext}>
      {children}
    </KeyboardHeightContext.Provider>
  );
};
