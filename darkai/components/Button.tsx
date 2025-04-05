import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Colors, CtaGradientColors } from '@/constants/Colors';

import { Icon, IconName } from '../blocks/Icon';
import { ProBadge } from './ProBadge';

interface ButtonProps {
  style?: ViewStyle;
  isCTA?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  title: string;
  onPress?: () => void;
  isDanger?: boolean;
  isSuccess?: boolean;
  icon?: IconName;
  isSmall?: boolean;
  isPro?: boolean;
  color?: string;
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.borderColor,
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientTransparent: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  text: {
    color: Colors.primaryText,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export const Button = ({
  onPress,
  title,
  isLoading = false,
  isDisabled = false,
  isCTA = false,
  style,
  isDanger = false,
  isSuccess = false,
  icon,
  isSmall,
  color = Colors.primaryText,
  isPro = false,
}: ButtonProps) => {
  const isBlocked = isLoading || isDisabled;

  const wrapperStyle = useMemo(() => {
    return {
      ...styles.wrapper,
      opacity: isBlocked ? 0.7 : 1,

      ...(isDanger ? { backgroundColor: Colors.transparent } : {}),
      ...(isSmall
        ? {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 4,
          }
        : {}),
      style,
    };
  }, [isBlocked, isDanger, isSmall, style]);

  const textStyle = useMemo(() => {
    return {
      ...styles.text,
      ...(isSmall ? { fontSize: 14 } : {}),
      color,
      ...(isDanger ? { color: Colors.errorColor } : {}),
    };
  }, [color, isDanger, isSmall]);

  const onPressIn = useCallback(() => {
    if (!isBlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isBlocked]);

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      activeOpacity={isBlocked ? 1 : 0.7}
      onPress={isBlocked ? undefined : onPress}
      style={wrapperStyle}
    >
      {isCTA ? (
        <LinearGradient colors={CtaGradientColors} style={styles.gradient} />
      ) : null}
      {isSuccess ? (
        <LinearGradient
          colors={['#00FF00', '#32CD32']}
          style={styles.gradientTransparent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      ) : null}
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Icon name={icon} size={isSmall ? 16 : 18} color={color} />
          ) : null}
          <Text style={textStyle}>{title}</Text>
          {isPro ? <ProBadge /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};
