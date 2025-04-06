import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';

import { Icon, IconName } from '../blocks/Icon';
import { BackButton } from './BackButton';

const styles = StyleSheet.create({
  wrapper: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flexShrink: 1,
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
      {onRightButtonPress && rightButtonIcon ? placeholder : null}
      {secondOnRightButtonPress && secondRightButtonIcon ? placeholder : null}
      <View style={styles.titleWrapper}>
        {title ? (
          <Text ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
        ) : null}
      </View>
      {withBackButton ? placeholder : null}
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
