import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';

import avatarImage from '@/assets/images/avatar.png';
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderCurve: 'continuous',
    borderColor: Colors.white,
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export const Avatar = () => {
  return (
    <View style={styles.avatar}>
      <Image style={styles.avatarImage} source={avatarImage} />
    </View>
  );
};
