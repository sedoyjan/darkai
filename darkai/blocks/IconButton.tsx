import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';

import { Icon, IconName } from './Icon';

interface IconButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  name: IconName;
  disabled?: boolean;
  size?: number;
  color?: string;
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});

export const IconButton = ({
  onPress,
  name,
  style,
  disabled,
  size = 24,
  color = Colors.primaryText,
}: IconButtonProps) => {
  const mergedStyle = useMemo(() => {
    return [styles.wrapper, style, { opacity: disabled ? 0.5 : 1 }];
  }, [disabled, style]);

  const onPressIn = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [disabled]);

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      style={mergedStyle}
    >
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};
