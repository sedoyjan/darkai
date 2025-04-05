import { Dimensions, Platform, StyleSheet } from 'react-native';

import { Colors } from './constants/Colors';

const windowWidth = Dimensions.get('window').width;

export const markdownStyles = StyleSheet.create({
  body: {
    maxWidth: windowWidth - 120,
    padding: 0,
    gap: 0,
    color: Colors.primaryText,
  },
  heading1: {
    flexDirection: 'row',
    fontSize: 18,
  },
  heading2: {
    flexDirection: 'row',
    fontSize: 16,
  },
  heading3: {
    flexDirection: 'row',
    fontSize: 14,
  },
  heading4: {
    flexDirection: 'row',
    fontSize: 12,
  },
  heading5: {
    flexDirection: 'row',
    fontSize: 12,
  },
  heading6: {
    flexDirection: 'row',
    fontSize: 11,
  },

  // Horizontal Rule
  hr: {
    backgroundColor: '#ffffff',
    height: 1,
  },

  // Emphasis
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },

  // Blockquotes
  blockquote: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
    borderLeftWidth: 4,
    marginLeft: 5,
    paddingHorizontal: 5,
  },

  // Lists
  bullet_list: {},
  ordered_list: {},
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_content: {
    flex: 1,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_content: {
    flex: 1,
  },

  // Code
  code_inline: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
  },
  code_block: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
  },
  fence: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
  },

  // Tables
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 3,
  },
  thead: {},
  tbody: {},
  th: {
    flex: 1,
    padding: 5,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: 5,
  },

  // Links
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: '#000000',
    borderBottomWidth: 1,
  },

  // Images
  image: {
    flex: 1,
  },

  // Text Output
  text: {},
  textgroup: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
});

export const sharedStyles = StyleSheet.create({
  gap: {
    gap: 16,
  },
  text: {
    color: Colors.primaryText,
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    color: Colors.doneColor,
    textDecorationLine: 'underline',
  },
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  header: {
    color: Colors.primaryText,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subheader: {
    color: Colors.primaryText,
    textAlign: 'center',
    fontSize: 24,
  },
  image: {
    width: 124,
    height: 124,
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  row: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  col: {
    flexDirection: 'column',
  },
  title: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});
