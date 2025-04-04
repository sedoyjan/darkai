import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';

import { Icon } from '../Icon';

interface TaskRightActionButtonProps {
  progressAnimatedValue: SharedValue<number>;
  dragAnimatedValue: SharedValue<number>;
  swipeable: SwipeableMethods;
}

const size = 100;

const styles = StyleSheet.create({
  wrapper: {
    width: size,
    height: '100%',
    paddingBottom: 10,
  },
  button: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const TaskRightActionButton = ({
  dragAnimatedValue,
  // progressAnimatedValue,
  // swipeable,
}: TaskRightActionButtonProps) => {
  const onPress = useCallback(() => {}, []);

  const rowStyle = useAnimatedStyle(() => {
    const width = Math.max(-dragAnimatedValue.value, size);
    const translateX = dragAnimatedValue.value + width;
    return {
      ...styles.wrapper,
      width,
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={rowStyle}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon name="trash-bin" color={Colors.semiWhite} size={24} />
      </TouchableOpacity>
    </Animated.View>
  );
};
