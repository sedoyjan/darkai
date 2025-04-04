import { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Icon } from './Icon';

interface CheckBoxProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

const styles = StyleSheet.create({
  wrapper: {
    width: 32,
    height: 32,
  },
});

export const CheckBox = memo(({ onChange, value }: CheckBoxProps) => {
  const onPress = useCallback(() => {
    onChange?.(!value);
  }, [onChange, value]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <Icon
        name={value ? 'checkmark-circle-outline' : 'ellipse-outline'}
        // color={value ? '#2ecc71' : 'rgba(255,255,255,0.5)'}
        color={value ? '#35C759' : 'rgba(255,255,255,0.5)'}
        size={32}
      />
    </TouchableOpacity>
  );
});

CheckBox.displayName = 'CheckBox';
