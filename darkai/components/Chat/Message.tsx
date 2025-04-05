import LottieView from 'lottie-react-native';
import { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Image from 'react-native-fast-image';
import Markdown from 'react-native-markdown-display';

import typingAnimation from '@/assets/animations/typing.json';
import avatarImage from '@/assets/images/avatar.png';
import { Icon } from '@/blocks/Icon';
import { Colors } from '@/constants/Colors';
import { markdownStyles } from '@/sharedStyles';
import { ChatMessage, ChatMessageType } from '@/types';
import { getMessageTime } from '@/utils/dates';

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
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  innerWrapper: {
    flexDirection: 'row',
    gap: 4,
  },
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
  outWrapper: {
    flexDirection: 'column',
  },
  wrapper: {
    backgroundColor: Colors.semiTransparentBg,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderCurve: 'continuous',
    borderColor: Colors.borderColor,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  textWrapper: {
    paddingVertical: 8,
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
    height: 16,
    width: 24,
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
  imageUrl,
  type,
  children,
  isTyping,
  createdAt,
  imageHash,
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
        {isBot ? (
          <View style={styles.avatar}>
            <Image style={styles.avatarImage} source={avatarImage} />
          </View>
        ) : null}
        <View style={styles.outWrapper}>
          <View style={styles.wrapper}>
            {imageUrl ? <Image style={styles.image} source={imageUrl} /> : null}
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
