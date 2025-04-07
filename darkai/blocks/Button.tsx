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

import { Icon, IconName } from '@/blocks/Icon';
import { ProBadge } from '@/components/ProBadge';
import { Colors, CtaGradientColors } from '@/constants/Colors';

interface ButtonProps {
  style?: ViewStyle;
  isLoading?: boolean;
  isDisabled?: boolean;
  title: string;
  onPress?: () => void;
  isGhost?: boolean;
  isSuccess?: boolean;
  isCTA?: boolean;
  icon?: IconName;
  iconAfter?: IconName;
  isSmall?: boolean;
  isPro?: boolean;
  color?: string;
  hitSlop?: number;
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
    ...StyleSheet.absoluteFill,
  },
  textWrapper: {
    flexDirection: 'row',
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
  style,
  isGhost = false,
  isSuccess = false,
  isCTA = false,
  icon,
  iconAfter,
  isSmall,
  color = Colors.primaryText,
  isPro = false,
  hitSlop,
}: ButtonProps) => {
  const isBlocked = isLoading || isDisabled;

  const wrapperStyle = useMemo(() => {
    return {
      ...styles.wrapper,
      opacity: isBlocked ? 0.7 : 1,

      ...(isGhost ? { backgroundColor: Colors.transparent } : {}),
      ...(isSuccess ? { backgroundColor: Colors.doneColor } : {}),
      // ...(isCTA ? { backgroundColor: Colors.doneColor } : {}),
      ...(isSmall
        ? {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 4,
          }
        : {}),
      style,
    };
  }, [isBlocked, isGhost, isSmall, isSuccess, style]);

  const textStyle = useMemo(() => {
    return {
      ...styles.text,
      ...(isSmall ? { fontSize: 14 } : {}),
      color,
      ...(isGhost ? { color: Colors.primaryText } : {}),
      ...(isSuccess ? { color: Colors.white } : {}),
      ...(isCTA ? { color: Colors.white } : {}),
    };
  }, [color, isCTA, isGhost, isSmall, isSuccess]);

  const iconColor = useMemo(() => {
    let iColor = color;
    if (isGhost) {
      iColor = Colors.primaryText;
    }
    if (isSuccess || isCTA) {
      iColor = Colors.white;
    }
    return iColor;
  }, [color, isCTA, isGhost, isSuccess]);

  const onButtonPress = useCallback(() => {
    if (!isBlocked) {
      onPress?.();
    }
  }, [isBlocked, onPress]);

  const onPressIn = useCallback(() => {
    if (!isBlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isBlocked]);

  const iconWrapperStyle = useMemo<ViewStyle>(() => {
    if (isSmall) {
      return {
        width: 16,
        height: 16,
      };
    }
    return {
      width: 18,
      height: 18,
    };
  }, [isSmall]);

  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      activeOpacity={0.7}
      onPress={onButtonPress}
      onPressIn={onPressIn}
      style={wrapperStyle}
    >
      {isCTA ? (
        <LinearGradient colors={CtaGradientColors} style={styles.gradient} />
      ) : null}
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <View style={styles.content}>
          <View style={iconWrapperStyle}>
            {icon ? (
              <Icon name={icon} size={isSmall ? 16 : 18} color={iconColor} />
            ) : null}
          </View>
          <View style={styles.textWrapper}>
            <Text style={textStyle}>{title}</Text>
            {isPro ? <ProBadge /> : null}
          </View>
          <View style={iconWrapperStyle}>
            {iconAfter ? (
              <Icon
                name={iconAfter}
                size={isSmall ? 16 : 18}
                color={iconColor}
              />
            ) : null}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
