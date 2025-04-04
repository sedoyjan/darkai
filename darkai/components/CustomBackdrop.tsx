import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
    opacity: 0,
    top: -1500,
  },
});

export const CustomBackdrop = ({
  animatedIndex,
  onPress,
}: BottomSheetBackdropProps & {
  onPress?: () => void;
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [-1, 0],
        [0, 0.4],
        Extrapolation.CLAMP,
      ),
    };
  }, []);

  const containerStyle = useMemo(
    () => [styles.wrapper, containerAnimatedStyle],
    [containerAnimatedStyle],
  );

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity style={styles.wrapper} onPress={onPress} />
    </Animated.View>
  );
};
