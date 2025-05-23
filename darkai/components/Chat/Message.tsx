import LottieView from 'lottie-react-native';
import { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';

import typingAnimation from '@/assets/animations/typing.json';
import { Icon } from '@/blocks/Icon';
import { Colors } from '@/constants/Colors';
import { markdownStyles } from '@/sharedStyles';
import { ChatMessage, ChatMessageType } from '@/types';
import { getMessageTime } from '@/utils/dates';

import { Avatar } from './Avatar';

interface MessageProps extends Omit<ChatMessage, 'text'> {
  isTyping?: boolean;
  children?: ReactNode;
  text?: string;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexShrink: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  innerWrapper: {
    flexDirection: 'row',
    gap: 4,
  },
  outWrapper: {
    flexDirection: 'column',
  },
  wrapper: {
    backgroundColor: Colors.semiTransparentBg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderCurve: 'continuous',
    borderColor: Colors.borderColor,
  },
  textWrapper: {
    paddingVertical: 0,
  },
  text: {
    maxWidth: 200,
    color: Colors.primaryText,
  },
  captionRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    marginTop: 2,
    gap: 4,
  },
  captionRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    marginTop: 2,
    gap: 4,
  },
  animationWrapper: {
    height: 24,
    width: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  animation: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: -4,
    left: -6,
  },
  smallCaption: {
    fontSize: 12,
    color: Colors.white,
  },
});

export const Message = ({
  text,
  type,
  children,
  isTyping,
  createdAt,
}: MessageProps) => {
  const rowStyle = useMemo<ViewStyle>(() => {
    let justifyContent: 'flex-start' | 'flex-end' | 'center' = 'flex-end';

    if (type === ChatMessageType.BOT) {
      justifyContent = 'flex-start';
    }

    return {
      ...styles.row,
      justifyContent,
    };
  }, [type]);

  const messageCreatedAt = getMessageTime(createdAt);
  const isBot = type === ChatMessageType.BOT;

  return (
    <View style={rowStyle}>
      <View style={styles.innerWrapper}>
        {isBot ? <Avatar /> : null}
        <View style={styles.outWrapper}>
          <View style={styles.wrapper}>
            {text ? (
              <>
                {isBot ? (
                  <Markdown style={markdownStyles}>{text}</Markdown>
                ) : (
                  <View style={styles.textWrapper}>
                    <Text style={styles.text}>{text}</Text>
                  </View>
                )}
              </>
            ) : null}
            {isTyping ? (
              <View style={styles.animationWrapper}>
                <LottieView
                  autoPlay
                  style={styles.animation}
                  source={typingAnimation}
                />
              </View>
            ) : null}
            {children}
          </View>
          <View style={isBot ? styles.captionRowLeft : styles.captionRowRight}>
            <Text style={styles.smallCaption}>{messageCreatedAt}</Text>
            {isBot ? null : <Icon name="checkmark" color={Colors.white} />}
          </View>
        </View>
      </View>
    </View>
  );
};
