import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';

import { GradientColors } from '@/constants/Colors';
import { sharedStyles } from '@/sharedStyles';

export const BottomSheetBackground = (props: BottomSheetBackgroundProps) => {
  const style = useMemo<ViewStyle>(() => {
    const extraStyles = props.style
      ? (props.style as ViewStyle)
      : ({} as ViewStyle);
    return {
      backgroundColor: 'transparent',
      borderRadius: 32,
      overflow: 'hidden',
      ...extraStyles,
    };
  }, [props.style]);

  return (
    <View style={style}>
      <LinearGradient colors={GradientColors} style={sharedStyles.wrapper} />
    </View>
  );
};
