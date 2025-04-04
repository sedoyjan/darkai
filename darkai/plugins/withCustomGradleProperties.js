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
    ];
    additionalGradleProperties.map(function (gradleProperty) {
      config.modResults.push(gradleProperty);
    });
    return config;
  });
}

module.exports = withCustomGradleProperties;
