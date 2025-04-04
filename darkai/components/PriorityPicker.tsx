import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Priority as PriorityType } from '@/types';

import { Priority } from './Priority';

interface PriorityPickerProps {
  value: number;
  onChange: (value: PriorityType) => void;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    backgroundColor: Colors.borderColor,
    flexGrow: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    minWidth: 80,
  },
  label: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const PRIORITY_VALUES: {
  label: string;
  value: PriorityType;
}[] = [
  { label: 'Lowest', value: 0 },
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
];

export const PriorityPicker = memo(
  ({ onChange, value }: PriorityPickerProps) => {
    const { t } = useTranslation();

    const priorityValues = useMemo(() => {
      return PRIORITY_VALUES.map(item => {
        switch (item.value) {
          case 0:
            return {
              ...item,
              label: t('components.priority.lowest'),
            };
          case 1:
            return {
              ...item,
              label: t('components.priority.low'),
            };
          case 2:
            return {
              ...item,
              label: t('components.priority.medium'),
            };
          case 3:
            return {
              ...item,
              label: t('components.priority.high'),
            };
          default:
            return {
              ...item,
              label: '',
            };
        }
      });
    }, [t]);

    const selectedButtonStyle = useMemo(() => {
      return {
        ...styles.button,
        backgroundColor: Colors.placeholder,
      };
    }, []);

    return (
      <View style={styles.wrapper}>
        {priorityValues.map((item, index) => {
          const isSelected = item.value === value;
          return (
            <TouchableOpacity
              key={item.label + index}
              onPress={() => onChange(item.value)}
              style={isSelected ? selectedButtonStyle : styles.button}
            >
              <Priority value={item.value} />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);

PriorityPicker.displayName = 'PriorityPicker';
