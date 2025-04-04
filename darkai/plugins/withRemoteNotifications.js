// plugins/withRemoteNotifications.js
const { withAppDelegate } = require('@expo/config-plugins');
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');

/**
 * Insert `[application registerForRemoteNotifications];` after `[FIRApp configure];`
 */
function addRegisterForRemoteNotifications(src) {
  return mergeContents({
    tag: 'register-for-remote-notifications', // A unique tag to avoid re-inserting
    src,
    newSrc: '[application registerForRemoteNotifications];',
    anchor: /self\.moduleName = @"main";/,
    offset: -1, // Insert on the next line after the anchor
    comment: '//',
  });
}

/**
 * Insert `[FIRMessaging messaging].APNSToken = deviceToken;` right before
 * `return [super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];`
 */
function addSetAPNSToken(src) {
  return mergeContents({
    tag: 'set-apns-token',
    src,
    newSrc: '[FIRMessaging messaging].APNSToken = deviceToken;',
    anchor:
      /return \[super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken\];/,
    offset: 0, // Insert on the line right above the anchor
    comment: '//',
  });
}

function withRemoteNotifications(config) {
  return withAppDelegate(config, config => {
    if (
      config.modResults.language === 'objc' ||
      config.modResults.language === 'objcpp'
    ) {
      let contents = config.modResults.contents;

      const addRegisterResult = addRegisterForRemoteNotifications(contents);
      if (addRegisterResult.didMerge) {
        contents = addRegisterResult.contents;
      } else {
        console.warn(
          'withRemoteNotifications: Failed to insert [application registerForRemoteNotifications];',
        );
      }

      // 2. Add the APNSToken line
      const addTokenResult = addSetAPNSToken(contents);
      if (addTokenResult.didMerge) {
        contents = addTokenResult.contents;
      } else {
        console.warn(
          'withRemoteNotifications: Failed to insert [FIRMessaging messaging].APNSToken = deviceToken;',
        );
      }

      // Assign final modified contents back
      config.modResults.contents = contents;
    } else {
      console.warn(
        'withRemoteNotifications: AppDelegate is not Objective-C. This plugin only supports Objective-C.',
      );
    }
    return config;
  });
}

module.exports = withRemoteNotifications;
