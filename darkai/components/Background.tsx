import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { GradientColors } from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: GradientColors[0],
  },
  containerSolid: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: GradientColors[0],
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});

interface BackgroundProps {
  solid?: boolean;
  children: ReactNode;
  style?: ViewStyle;
}

export const Background = ({ children, solid, style }: BackgroundProps) => {
  if (solid) {
    return <View style={[styles.containerSolid, style]}>{children}</View>;
  }
  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={GradientColors} style={styles.background} />
      {children}
    </View>
  );
};
