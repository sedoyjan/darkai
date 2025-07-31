const { withGradleProperties } = require('@expo/config-plugins');

function withCustomGradleProperties(config) {
  return withGradleProperties(config, function (config) {
    const additionalGradleProperties = [
      // Jetifier is not enabled by default from React Native 0.75, but we have 3rd party deps that still require it
      { type: 'property', key: 'android.enableJetifier', value: 'true' },
      // # Enables PNG crunching
      { type: 'property', key: 'android.enablePngCrunchInReleaseBuilds', value: 'true' },
      // Disables unused App Performance Management (APM) used by AppGallery Connect to avoid error "API 'android.registerTransform' is removed"
      { type: 'property', key: 'apmsInstrumentationEnabled', value: 'false' },
      // New Architecture properties
      { type: 'property', key: 'newArchEnabled', value: 'true' },
      { type: 'property', key: 'hermesEnabled', value: 'true' },
      // Enable React Native new renderer (Fabric)
      { type: 'property', key: 'react.native.fabric.enabled', value: 'true' },
      // Enable TurboModules
      { type: 'property', key: 'react.native.turboModules.enabled', value: 'true' },
    ];
    additionalGradleProperties.map(function (gradleProperty) {
      config.modResults.push(gradleProperty);
    });
    return config;
  });
}

module.exports = withCustomGradleProperties;
