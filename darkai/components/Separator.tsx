import { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';

interface SeparatorProps {
  style?: ViewStyle;
  left?: number;
  right?: number;
}

const styles = StyleSheet.create({
  wrapper: {
    height: 1,
    backgroundColor: Colors.borderColor,
  },
});

export const Separator = ({ style, left, right }: SeparatorProps) => {
  const mergedStyle = useMemo(() => {
    return {
      ...styles.wrapper,
      ...style,
      marginLeft: left,
      marginRight: right,
    };
  }, [left, right, style]);

  return <View style={mergedStyle} />;
};
