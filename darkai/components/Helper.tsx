import { AnimatePresence, MotiView } from 'moti';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import AssistantImage from '@/assets/images/avatar.png';
import { IconButton } from '@/blocks/IconButton';
import { Colors } from '@/constants/Colors';

import { Panel } from './Panel';

interface HelperProps {
  title: string;
  text?: string;
  isVisible: boolean;
  children?: ReactNode;
  withCloseButton?: boolean;
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    marginLeft: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    color: Colors.primaryText,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: Colors.primaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  panel: {
    marginBottom: 0,
  },
  closeButton: {
    padding: 0,
  },
  children: {
    marginTop: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    overflow: 'hidden',
  },
});

export const Helper = ({
  text,
  title,
  children,
  isVisible,
  withCloseButton = true,
}: HelperProps) => {
  const [isVisibleLocal, setIsVisibleLocal] = useState(true);
  const isVisibleMerged = isVisible && isVisibleLocal;

  useEffect(() => {
    if (!isVisible) {
      setIsVisibleLocal(true);
    }
  }, [isVisible]);

  const hide = useCallback(() => {
    setIsVisibleLocal(false);
  }, []);

  return (
    <AnimatePresence>
      {isVisibleMerged ? (
        <MotiView
          from={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
        >
          <Panel style={styles.panel}>
            <View style={styles.wrapper}>
              <FastImage style={styles.image} source={AssistantImage} />
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <Text style={styles.title}>{title}</Text>
                  {withCloseButton ? (
                    <IconButton
                      name="close-outline"
                      onPress={hide}
                      style={styles.closeButton}
                    />
                  ) : null}
                </View>

                {text ? <Text style={styles.text}>{text}</Text> : null}
                {children ? (
                  <View style={styles.children}>{children}</View>
                ) : null}
              </View>
            </View>
          </Panel>
        </MotiView>
      ) : null}
    </AnimatePresence>
  );
};
