export const Colors = {
  white: '#FFFFFF',
  transparent: 'rgba(0, 0, 0, 0)',
  semiWhite: 'rgba(255, 255, 255, 0.5)',
  semiTransparentBg: 'rgba(255, 255, 255, 0.15)',
  semiBlack: 'rgba(0, 0, 0, 0.5)',
  secondaryText: 'rgba(255, 255, 255, 0.6)',
  primaryText: '#FFFFFF',
  placeholder: 'rgba(255, 255, 255, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.2)',
  gradientStart: '#002504',
  gradientEnd: '#020202',
  errorColor: '#FF4C4C',
  // doneColor: '#2ecc71',
  doneColor: '#1A9C51',
  defaultTaskColor: 'rgba(0, 0, 0, 0.2)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  black: '#000000',
  accentColor1: '#FFAA00',
  accentColor2: '#00BFFF',
  ctaGradientStart: '#105915',
  ctaGradientEnd: '#104E2B',
  premiumGradientStart: '#F3FF09',
  premiumGradientEnd: '#C4F244',
};

export const GradientColors = [
  Colors.gradientStart,
  Colors.gradientEnd,
] as const;

export const CtaGradientColors = [
  Colors.ctaGradientStart,
  Colors.ctaGradientEnd,
] as const;

export const PremiumGradientColors = [
  Colors.premiumGradientStart,
  Colors.premiumGradientEnd,
] as const;
