import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

import { Icon } from '../Icon';

interface PillProgressProps {
  total: number;
  completed: number;
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caption: {
    color: Colors.primaryText,
    fontSize: 12,
  },
});

export const PillProgress = memo(({ completed, total }: PillProgressProps) => {
  const progress = `${completed} / ${total}`;
  return (
    <View style={styles.wrapper}>
      <Icon name="checkbox" color="white" size={14} />
      <Text style={styles.caption}>{progress}</Text>
    </View>
  );
});

PillProgress.displayName = 'PillProgress';
