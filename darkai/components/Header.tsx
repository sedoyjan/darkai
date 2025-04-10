import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';

import { BackButton } from '../blocks/BackButton';
import { Icon, IconName } from '../blocks/Icon';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    height: 44,
    flexDirection: 'row',
    width: '100%',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flexGrow: 1,
    textAlign: 'center',
  },
});

interface HeaderProps {
  title?: string;
  withBackButton?: boolean;
  rightButtonIcon?: IconName;
  onRightButtonPress?: () => void;
  secondRightButtonIcon?: IconName;
  secondOnRightButtonPress?: () => void;
}

export const Header = ({
  title,
  withBackButton = true,
  onRightButtonPress,
  rightButtonIcon,
  secondOnRightButtonPress,
  secondRightButtonIcon,
}: HeaderProps) => {
  const placeholder = useMemo(() => {
    return <View style={styles.button} />;
  }, []);
  return (
    <View style={styles.wrapper}>
      {withBackButton ? <BackButton /> : null}
      {onRightButtonPress && rightButtonIcon && !withBackButton
        ? placeholder
        : null}
      {secondOnRightButtonPress && secondRightButtonIcon ? placeholder : null}
      <View style={styles.titleWrapper}>
        {title ? (
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
        ) : null}
      </View>
      {withBackButton &&
      !secondOnRightButtonPress &&
      !secondRightButtonIcon &&
      !onRightButtonPress &&
      !rightButtonIcon
        ? placeholder
        : null}
      <View style={styles.buttons}>
        {secondOnRightButtonPress && secondRightButtonIcon ? (
          <TouchableOpacity
            onPress={secondOnRightButtonPress}
            style={styles.button}
          >
            <Icon
              name={secondRightButtonIcon}
              size={24}
              color={Colors.primaryText}
            />
          </TouchableOpacity>
        ) : null}
        {onRightButtonPress && rightButtonIcon ? (
          <TouchableOpacity onPress={onRightButtonPress} style={styles.button}>
            <Icon name={rightButtonIcon} size={24} color={Colors.primaryText} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
