import { useCallback, useState } from 'react';

export const useTypingSimulator = (textToType: string, delay = 100) => {
  const [typedText, setTypedText] = useState('');

  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const clearTypedText = useCallback(() => {
    setTypedText('');
  }, []);

  const startTyping = useCallback(
    (index = -1, clb?: () => void) => {
      setIsTyping(true);
      if (index === -1) {
        setTypedText('');
      }
      if (index < textToType.length) {
        setTimeout(() => {
          setTypedText(prevText => prevText + textToType.charAt(index + 1));

          startTyping(index + 1, clb);
        }, delay);
      } else {
        setIsTypingComplete(true);
        setIsTyping(false);
        clb?.();
      }
    },
    [delay, textToType],
  );

  return {
    isTyping,
    typedText,
    isTypingComplete,
    startTyping,
    clearTypedText,
  };
};
