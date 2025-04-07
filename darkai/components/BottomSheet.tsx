import {
  BottomSheetBackgroundProps,
  default as RNBottomSheet,
} from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { WithSpringConfig } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetBackground } from '@/components/BottomSheetBackground';
import { Colors } from '@/constants/Colors';

import { Icon } from '../blocks/Icon';
import { CustomBackdrop } from './CustomBackdrop';
import { useKeyboardHeightContext } from './KeyboardHeightContextProvider';

const ANIMATION_CONFIG: WithSpringConfig = {
  stiffness: 800, // Slightly lower than 2000 for more natural speed
  damping: 55, // Reduced from 80 for a bit of bounce
  mass: 1, // Default mass for predictable motion
  restDisplacementThreshold: 0.01, // Tighter threshold for precision
  restSpeedThreshold: 0.01, // Faster settling
  velocity: 10, // Boosted initial velocity for snappiness
  overshootClamping: false, // Allow slight overshoot for bounce
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: -6,
  },
  button: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleIndicatorStyle: { backgroundColor: Colors.semiWhite },
});

interface BottomSheetProps {
  withHeader?: boolean;
  children: ReactNode | ((onClose: () => Promise<void>) => ReactNode);
  height?: number;
  onClose?: () => void;
}

export const BottomSheet = ({
  withHeader = false,
  children,
  height = 200,
  onClose,
}: BottomSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { keyboardHeight, isOpen } = useKeyboardHeightContext();
  const bottomSheetModalRef = useRef<RNBottomSheet>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const callbackRef = useRef<() => void>(() => {});

  const maxHeight = useMemo(
    () => windowHeight - top - bottom,
    [windowHeight, top, bottom],
  );

  const mappedSnapPoints = useMemo(() => {
    const baseHeight = Math.min(maxHeight, height + bottom);
    const snapPoints = [baseHeight];
    if (keyboardHeight > 0) {
      snapPoints.push(Math.min(maxHeight, height + keyboardHeight));
    }
    return snapPoints;
  }, [bottom, height, keyboardHeight, maxHeight]);

  const closeSheet = useCallback(() => {
    Keyboard.dismiss();
    return new Promise<void>(resolve => {
      bottomSheetModalRef.current?.close();
      callbackRef.current = resolve;
    });
  }, []);

  const onDismissHandler = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    callbackRef.current();
    onClose?.();
  }, [navigation, onClose]);

  const renderBackground = useCallback(
    (props: BottomSheetBackgroundProps) => <BottomSheetBackground {...props} />,
    [],
  );

  const BackdropComponent = useCallback(
    (props: BottomSheetBackgroundProps) => (
      <CustomBackdrop {...props} onPress={closeSheet} />
    ),
    [closeSheet],
  );

  useEffect(() => {
    if (isFocused && isOpen) {
      requestAnimationFrame(() => {
        bottomSheetModalRef.current?.expand();
      });
    }
  }, [isFocused, isOpen]);

  const isChildrenFunction = typeof children === 'function';

  return (
    <RNBottomSheet
      backgroundComponent={renderBackground}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={mappedSnapPoints}
      enablePanDownToClose
      backdropComponent={BackdropComponent}
      onClose={onDismissHandler}
      animationConfigs={ANIMATION_CONFIG}
      handleIndicatorStyle={styles.handleIndicatorStyle}
    >
      {withHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={closeSheet} style={styles.button}>
            <Icon name="close-circle" size={24} color={Colors.semiWhite} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.wrapper}>
        {isChildrenFunction ? children(closeSheet) : children}
      </View>
    </RNBottomSheet>
  );
};
