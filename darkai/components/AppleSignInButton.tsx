import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
} from 'expo-apple-authentication';
import { noop } from 'lodash';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { signInThunk } from '@/rdx/app/thunks';
import { useAppDispatch } from '@/rdx/store';

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 44,
  },
  buttonDisabled: {
    width: '100%',
    height: 44,
    opacity: 0.5,
    pointerEvents: 'none',
  },
});

interface AppleSignInButtonProps {
  redirectScreen?: string;
  isDisabled?: boolean;
  callback?: () => void;
}

export const AppleSignInButton = ({
  redirectScreen,
  isDisabled = false,
  callback,
}: AppleSignInButtonProps) => {
  const dispatch = useAppDispatch();

  const onSignIn = useCallback(async () => {
    await dispatch(
      signInThunk({
        redirectScreen,
      }),
    );
    callback?.();
  }, [callback, dispatch, redirectScreen]);

  return (
    <AppleAuthenticationButton
      buttonType={AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={isDisabled ? styles.buttonDisabled : styles.button}
      onPress={isDisabled ? noop : onSignIn}
    />
  );
};
