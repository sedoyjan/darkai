import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import {
  ColorValue,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';

import { CheckBox } from './CheckBox';
import { Icon, IconName } from './Icon';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.5,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    minHeight: 32,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  label: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: '500',
  },
  caption: {
    color: Colors.semiWhite,
    fontSize: 12,
    fontWeight: '400',
  },
  separatorWithIcon: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginRight: -16,
    marginLeft: 48,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginRight: -16,
  },
});

interface SettingsButtonProps {
  isDisabled?: boolean;
  withSeparator?: boolean;
  withArrow?: boolean;
  label: string;
  caption?: string;
  rightCaption?: string;
  value?: boolean;
  onPress: (value?: boolean) => void;
  icon?: IconName;
  iconBackgroundColor?: ColorValue;
  isLoading?: boolean;
  isCheckbox?: boolean;
  children?: React.ReactNode;
}

export const SettingsButton = ({
  isDisabled = false,
  withSeparator = false,
  withArrow = false,
  icon,
  value,
  label,
  caption,
  rightCaption,
  onPress,
  iconBackgroundColor = 'gray',
  isCheckbox = false,
  children,
}: SettingsButtonProps) => {
  const iconWrapperStyle = useMemo(() => {
    return {
      ...styles.iconWrapper,
      backgroundColor: iconBackgroundColor,
    };
  }, [iconBackgroundColor]);

  const onPressHandler = useCallback(() => {
    onPress(undefined);
  }, [onPress]);

  const onPressIn = useCallback(() => {
    if (!isDisabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isDisabled]);

  return (
    <>
      <View style={isDisabled ? styles.rowDisabled : styles.row}>
        <TouchableOpacity
          onPressIn={onPressIn}
          style={styles.wrapper}
          onPress={isDisabled ? undefined : onPressHandler}
          activeOpacity={isDisabled ? 1 : 0.7}
        >
          <View>
            <View style={styles.inline}>
              {icon ? (
                <View style={iconWrapperStyle}>
                  <Icon name={icon} size={20} color={Colors.primaryText} />
                </View>
              ) : null}
              <Text style={styles.label}>{label}</Text>
            </View>
            {caption ? <Text style={styles.caption}>{caption}</Text> : null}
          </View>
          {rightCaption ? (
            <Text style={styles.caption}>{rightCaption}</Text>
          ) : null}
          {withArrow ? (
            <Icon name="chevron-forward" size={18} color={Colors.primaryText} />
          ) : null}
          {value !== undefined ? (
            <>
              {isCheckbox ? (
                <CheckBox value={value} onChange={onPress} />
              ) : (
                <Switch
                  value={value}
                  onChange={() => {
                    onPress(!value);
                  }}
                />
              )}
            </>
          ) : null}
        </TouchableOpacity>
        {children}
      </View>
      {withSeparator ? (
        <View style={icon ? styles.separatorWithIcon : styles.separator} />
      ) : null}
    </>
  );
};
