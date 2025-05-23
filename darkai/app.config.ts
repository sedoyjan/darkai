import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  experiments: {
    typedRoutes: true,
  },
  name: 'Dark AI',
  slug: 'darkai',
  version: require('./package.json').version,
  scheme: 'darkai',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: false,
  ios: {
    supportsTablet: false,
    usesAppleSignIn: true,
    bundleIdentifier: require('./package.json').name,
    googleServicesFile: './configuration/ios/GoogleService-Info.plist',
    icon: './assets/images/icon.png',
    entitlements: {
      'aps-environment': 'production',
    },
    infoPlist: {
      UIBackgroundModes: ['fetch', 'remote-notification'],
      FirebaseAppDelegateProxyEnabled: '@NO',
      NSAppTransportSecurity: {
        NSExceptionDomains: {
          '85.222.235.31': {
            NSExceptionAllowsInsecureHTTPLoads: true,
            NSIncludesSubdomains: false,
          },
        },
      },
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    googleServicesFile: './configuration/android/google-services.json',
    package: require('./package.json').name,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  locales: {},
  updates: {
    enabled: false,
  },
  notification: {
    icon: './assets/images/notification-icon.png',
    color: '#0000ff',
    androidMode: 'collapse',
    androidCollapsedTitle: 'You have new notifications',
  },
  extra: {
    eas: {
      projectId: '154004f3-8eec-49c8-8861-bdb514972233',
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#020202',
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    // '@react-native-firebase/analytics',
    '@react-native-firebase/crashlytics',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '15.1',
        },
      },
    ],
    'expo-localization',
    [
      'react-native-permissions',
      {
        iosPermissions: ['AppTrackingTransparency', 'Notifications'],
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#0000ff',
      },
    ],
    'expo-video',
    require('./plugins/withModularHeaders'),
    require('./plugins/withRemoteNotifications'),
  ],
});
