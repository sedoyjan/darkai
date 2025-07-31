import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import assistantImage from '@/assets/images/assistant.png';

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export const Avatar = () => {
  return <Image source={assistantImage} style={styles.image} />;
};
