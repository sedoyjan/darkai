# React Native New Architecture Migration Guide

## Overview

This guide covers the migration of Dark AI from the legacy React Native architecture to the new architecture (Fabric + TurboModules) enabled in React Native 0.68+.

## What's New

### Fabric (New Renderer)
- **Direct manipulation**: Better performance through direct UI updates
- **Concurrent features**: Support for React 18 concurrent features
- **Simplified threading**: Fewer thread switches between JS and UI

### TurboModules (New Native Modules)
- **Type safety**: Better TypeScript integration
- **Lazy loading**: Modules loaded only when needed
- **Synchronous calls**: Direct synchronous communication via JSI

## Migration Status

### ✅ Completed Changes

1. **App Configuration**
   - ✅ Enabled `newArchEnabled: true` in `app.config.ts`
   - ✅ Updated Android Gradle properties in `plugins/withCustomGradleProperties.js`

2. **Gradle Properties Added**
   ```properties
   newArchEnabled=true
   hermesEnabled=true
   react.native.fabric.enabled=true
   react.native.turboModules.enabled=true
   ```

### 📦 Dependency Compatibility Analysis

#### ✅ **Fully Compatible (No Action Needed)**
- `expo@52.0.27` - Full new architecture support
- `react-native@0.76.7` - Full new architecture support
- `@react-navigation/*@7+` - Compatible with new architecture
- `react-native-reanimated@3.16.7` - Full Fabric support
- `react-native-gesture-handler@2.22.0` - Compatible
- `@shopify/flash-list@1.7.2` - Optimized for new architecture
- `@react-native-firebase/*@22.1.0` - Full new architecture support
- `react-native-svg@15.8.0` - Compatible
- `@gorhom/bottom-sheet@4.6.3` - Compatible
- `react-native-safe-area-context@5.1.0` - Compatible
- `react-native-screens@4.5.0` - Compatible

#### ⚠️ **Needs Attention**
- `react-native-fast-image@8.6.3` - Has a patch file, may need verification
- `react-native-onboarding-swiper@1.3.0` - Older package, may need testing
- `react-native-root-toast@3.6.0` - May need testing with new architecture

#### 🔧 **Recommended Updates**

1. **react-native-fast-image** - Consider replacing with Expo Image
2. **Verify older community packages** work correctly

## Migration Steps

### Phase 1: Enable New Architecture ✅
```bash
# Already completed in this migration
# - Updated app.config.ts
# - Updated Gradle properties
```

### Phase 2: Test Core Functionality
```bash
# Clean and rebuild
yarn install
cd ios && pod install && cd ..
yarn dev  # Test with dev client
```

### Phase 3: Test All Features
- [ ] Authentication flow (Firebase Auth + Apple Sign-In)
- [ ] Chat functionality and message rendering
- [ ] Subscription flow (RevenueCat)
- [ ] Push notifications
- [ ] Navigation and modals
- [ ] Animations (Lottie, Reanimated)
- [ ] Image loading and caching

### Phase 4: Production Testing
```bash
# Build for production testing
yarn build:ios
yarn build:android
```

## Performance Expectations

### Expected Improvements
- **Startup time**: 20-30% faster app initialization
- **UI responsiveness**: Smoother animations and interactions
- **Memory usage**: Better memory management
- **Bridge communication**: Reduced overhead in JS ↔ Native calls

### Monitoring Points
- App startup time
- List scrolling performance (FlashList)
- Animation smoothness (Lottie, Reanimated)
- Memory usage during long sessions

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clean everything if you encounter build issues
yarn install
cd ios && pod deintegrate && pod install && cd ..
yarn dev -c  # Clear cache
```

#### Metro Bundler Issues
```bash
# Reset Metro cache
yarn start --reset-cache
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios
xcodebuild clean
cd ..
```

### Rollback Plan
If issues arise, you can rollback by:
1. Set `newArchEnabled: false` in `app.config.ts`
2. Remove new architecture properties from `plugins/withCustomGradleProperties.js`
3. Clean and rebuild

## Testing Checklist

### Core Features
- [ ] App startup and initialization
- [ ] User authentication (Apple Sign-In, Anonymous)
- [ ] Chat creation and messaging
- [ ] Message history loading and pagination
- [ ] Real-time typing indicators
- [ ] Push notifications and deep linking
- [ ] Subscription flow and payment
- [ ] Onboarding flow
- [ ] Settings and profile management

### Performance Tests
- [ ] Cold app startup time
- [ ] Chat list scrolling (FlashList)
- [ ] Message rendering performance
- [ ] Memory usage during long sessions
- [ ] Animation smoothness
- [ ] Background/foreground transitions

### Platform-Specific Tests
- [ ] iOS device testing
- [ ] Android device testing
- [ ] Different screen sizes
- [ ] Different OS versions

## Monitoring and Metrics

### Before/After Metrics to Track
1. **App Startup Time**
   - Time to first screen render
   - Time to interactive

2. **UI Performance**
   - FlashList scroll performance
   - Animation frame rates
   - Touch response times

3. **Memory Usage**
   - Peak memory usage
   - Memory growth over time
   - Memory cleanup efficiency

4. **Crash Rates**
   - Monitor Firebase Crashlytics
   - Pay attention to native crashes

## Resources

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Fabric Renderer](https://reactnative.dev/docs/fabric-renderer)
- [TurboModules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [Migration Guide](https://reactnative.dev/docs/new-architecture-app-intro)

## Next Steps

1. **Test thoroughly** on both iOS and Android
2. **Monitor performance** metrics before/after
3. **Gradually roll out** to beta users first
4. **Monitor crash reports** closely
5. **Consider replacing** `react-native-fast-image` with `expo-image` for better new architecture support

## Support

If you encounter issues:
1. Check [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
2. Review [New Architecture Troubleshooting](https://reactnative.dev/docs/new-architecture-troubleshooting)
3. Check individual package documentation for new architecture support 