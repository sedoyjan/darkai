import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { StyleSheet } from 'react-native';

import loaderAnimation from '@/assets/animations/loader.json';
import { Colors } from '@/constants/Colors';

interface LoaderProps {
  isVisible: boolean;
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.semiBlack,
    ...StyleSheet.absoluteFillObject,
  },
  blur: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 180,
    height: 180,
  },
});

export const Loader = ({ isVisible }: LoaderProps) => {
  return (
    <AnimatePresence>
      {isVisible ? (
        <MotiView
          style={styles.wrapper}
          from={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <BlurView intensity={30} tint="default" style={styles.blur}>
            <LottieView
              autoPlay
              style={styles.animation}
              source={loaderAnimation}
            />
          </BlurView>
        </MotiView>
      ) : null}
    </AnimatePresence>
  );
};
