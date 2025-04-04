import { ReactNode, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.defaultTaskColor,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  title: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 24,
    color: Colors.primaryText,
  },
});

interface PanelProps {
  title?: string;
  children?: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Panel = ({ children, onPress, style, title }: PanelProps) => {
  const wrapperStyles = useMemo(() => {
    return [styles.wrapper, style];
  }, [style]);

  if (onPress) {
    return (
      <>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <TouchableOpacity style={wrapperStyles} onPress={onPress}>
          {children}
        </TouchableOpacity>
      </>
    );
  }
  return (
    <>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={wrapperStyles}>{children}</View>
    </>
  );
};
