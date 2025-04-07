import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { IS_DEV } from '@/const';

const APIKeys = {
  apple: 'appl_lkftktjGVRKPuNXucexWIbGrBxv',
  google: 'your_revenuecat_google_api_key',
};

export const configurePurchases = async () => {
  if (IS_DEV) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  if (Platform.OS === 'android') {
    await Purchases.configure({ apiKey: APIKeys.google });
    return { isConfigured: true };
  }
  if (Platform.OS === 'ios') {
    await Purchases.configure({ apiKey: APIKeys.apple });

    // const offerings = await Purchases.getOfferings();
    // console.log('🚀 ~ configurePurchases ~ offerings:', offerings);

    return { isConfigured: true };
  }

  return { isConfigured: false };
};

export const checkSubscription = async () => {
  let hasActiveSubscription = false;

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    hasActiveSubscription = customerInfo.activeSubscriptions.includes(
      'com.sedoyjan.darkai.premium.monthly',
    );
  } catch (error) {
    console.error('Error checking subscription:', error);
    hasActiveSubscription = false;
  }

  return hasActiveSubscription;
};
