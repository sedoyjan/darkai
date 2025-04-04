import { StyleSheet } from 'react-native';

import { Colors } from './constants/Colors';

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
