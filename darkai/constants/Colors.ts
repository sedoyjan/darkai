import { Theme as CalendarTheme } from 'react-native-calendars/src/types';

export const Colors = {
  /**
   * Darker start color of the gradient
   */
  gradientStart: '#002F5E',
  /**
   * Darker end color of the gradient
   */
  gradientEnd: '#061A2E',

  /**
   * Deep purple start color for CTA buttons
   */
  ctaGradientStart: '#6A0DAD',
  /**
   * Bright pink end color for CTA buttons
   */
  ctaGradientEnd: '#2e024f',

  /**
   * Use for the overall background
   */
  primaryBackground: '#1C3B57',

  /**
   * Use for input fields, task cards, and other secondary elements
   */
  secondaryBackground: '#2A4D6A',

  /**
   * Main text color
   */
  primaryText: '#FFFFFF',
  /**
   * Secondary text color
   */
  secondaryText: 'rgba(255, 255, 255, 0.6)',
  /**
   * Accent color 1 for buttons, icons, etc.
   */
  accentColor1: '#FFAA00',
  /**
   * Accent color 2 for additional elements
   */
  accentColor2: '#00BFFF',
  /**
   * Color for error or delete actions
   */
  errorColor: '#FF4C4C',
  /**
   * Placeholder text color in input fields
   */
  placeholderText: '#B0B0B0',
  /**
   * Background color for bottom navigation bar
   */
  bottomNavBackground: '#0F1E33',
  /**
   * Icon color for bottom navigation bar
   */
  bottomNavIcon: '#FFFFFF',
  /**
   * Active icon color for bottom navigation bar
   */
  bottomNavActiveIcon: '#FFAA00',

  /**
   * Default color for tasks
   */
  defaultTaskColor: 'rgba(0, 0, 0, 0.2)',

  /**
   * Done green color
   */
  doneColor: '#2ecc71',

  /**
   * Cool Blue
   */
  color1: 'rgba(70, 130, 180, 0.25)',
  /**
   * Mint Green
   */
  color2: 'rgba(152, 251, 152, 0.25)',
  /**
   * Lavender
   */
  color3: 'rgba(230, 230, 250, 0.25)',
  /**
   * Sky Blue
   */
  color4: 'rgba(135, 206, 235, 0.25)',
  /**
   * Soft Purple
   */
  color5: 'rgba(147, 112, 219, 0.25)',
  /**
   * Light Coral
   */
  color6: 'rgba(240, 128, 128, 0.25)',
  /**
   * Pale Turquoise
   */
  color7: 'rgba(175, 238, 238, 0.25)',
  /**
   * Light Pink
   */
  color8: 'rgba(255, 182, 193, 0.25)',
  /**
   * Peach Puff
   */
  color9: 'rgba(255, 218, 185, 0.25)',
  /**
   * Honeydew
   */
  color10: 'rgba(240, 255, 240, 0.25)',

  borderColor: 'rgba(255, 255, 255, 0.2)',
  transparent: 'rgba(0, 0, 0, 0)',
  semiWhite: 'rgba(255, 255, 255, 0.5)',
  semiBlack: 'rgba(0, 0, 0, 0.5)',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.2)',
  placeholder: 'rgba(255, 255, 255, 0.3)',
};

export const GradientColors = [
  Colors.gradientStart,
  Colors.gradientEnd,
] as const;
export const CtaGradientColors = [
  Colors.ctaGradientStart,
  Colors.ctaGradientEnd,
];
export const TaskColors = [
  Colors.color1,
  Colors.color2,
  Colors.color3,
  Colors.color4,
  Colors.color5,
  Colors.color6,
  Colors.color7,
  Colors.color8,
  Colors.color9,
  Colors.color10,
];

export const calendarTheme: CalendarTheme = {
  backgroundColor: Colors.gradientStart,
  calendarBackground: Colors.gradientStart,
  textSectionTitleColor: Colors.primaryText,
  textSectionTitleDisabledColor: Colors.semiWhite,
  selectedDayBackgroundColor: Colors.primaryText,
  selectedDayTextColor: Colors.black,
  todayTextColor: Colors.primaryText,
  dayTextColor: Colors.primaryText,
  textDisabledColor: Colors.semiWhite,
  dotColor: Colors.primaryText,
  selectedDotColor: Colors.primaryText,
  arrowColor: Colors.primaryText,
  disabledArrowColor: Colors.semiWhite,
  monthTextColor: Colors.primaryText,
  indicatorColor: Colors.primaryText,
  textDayFontFamily: 'monospace',
  textMonthFontFamily: 'monospace',
  textDayHeaderFontFamily: 'monospace',
  textDayFontWeight: '300',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
  todayBackgroundColor: Colors.borderColor,
  todayDotColor: Colors.accentColor1,
  stylesheet: {
    expandable: {
      main: {
        backgroundColor: 'red',
      },
    },
  },
};

export const PRIORITY_COLORS = {
  0: Colors.primaryText,
  1: Colors.accentColor2,
  2: Colors.accentColor1,
  3: Colors.errorColor,
};
