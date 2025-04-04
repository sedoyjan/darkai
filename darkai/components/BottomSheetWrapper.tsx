import { useIsFocused } from '@react-navigation/native';
import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';

import { SafeAreaKeyboardAvoidingView } from './SafeAreaKeyboardAvoidingView';

interface BottomSheetWrapperProps {
  height?: number;
  children: ReactNode;
  onClose?: () => void;
}

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
    backgroundColor: Colors.overlay,
    opacity: 0,
  },
  button: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: 200,
    overflow: 'hidden',
  },
});

export const BottomSheetWrapper = ({
  height = 200,
  children,
  onClose,
}: BottomSheetWrapperProps) => {
  const isFocused = useIsFocused();
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    overlayOpacity.value = isFocused
      ? withDelay(300, withTiming(1, { duration: 200 }))
      : withTiming(0, { duration: 0 });
  }, [isFocused, overlayOpacity]);

  const spacerAnimatedStyle = useAnimatedStyle(() => {
    return { ...styles.spacer, opacity: overlayOpacity.value };
  }, []);

  const onOverlayPress = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(onClose ?? (() => {}))();
    });
  }, [overlayOpacity, onClose]);

  const sheetStyles = useMemo(
    () => ({
      ...styles.sheet,
      height,
    }),
    [height],
  );

  return (
    <SafeAreaKeyboardAvoidingView edges={['bottom']}>
      <Animated.View style={spacerAnimatedStyle}>
        <TouchableOpacity style={styles.button} onPress={onOverlayPress} />
      </Animated.View>
      <View style={sheetStyles}>{children}</View>
    </SafeAreaKeyboardAvoidingView>
  );
};
