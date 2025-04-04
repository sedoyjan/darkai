const { withPodfile } = require('@expo/config-plugins');
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');

// use_modular_headers!

const podsFirebaseModularHeadersSrc = `\
  
  pod 'FirebaseCore', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true
`;

// pod 'FirebaseCore', '~> 11.7.0'
// pod 'FirebaseAuth', '~> 11.7.0'
// pod 'Firebase/AppCheckInterop', '~> 11.7.0'
// pod 'Firebase/CoreOnly', '~> 11.7.0'
// pod 'SDWebImage', '~> 5.19.1'
// pod 'SDWebImageAVIFCoder', '~> 0.11.0'

function withFirebaseModularHeaders(config) {
  return withPodfile(config, config => {
    if (config.modResults.contents) {
      config.modResults.contents = mergeContents({
        tag: 'firebase-modular-headers',
        src: config.modResults.contents,
        newSrc: podsFirebaseModularHeadersSrc,
        anchor: /use_native_modules!/,
        offset: 1,
        comment: '#',
      }).contents;
    }
    return config;
  });
}

const podsRecaptchaModularHeadersSrc = `\
  pod 'RecaptchaInterop', :modular_headers => true`;

function withRecaptchaModularHeaders(config) {
  return withPodfile(config, config => {
    if (config.modResults.contents) {
      config.modResults.contents = mergeContents({
        tag: 'recaptcha-modular-headers',
        src: config.modResults.contents,
        newSrc: podsRecaptchaModularHeadersSrc,
        anchor: /use_native_modules!/,
        offset: 1,
        comment: '#',
      }).contents;
    }
    return config;
  });
}

function withModularHeaders(config) {
  config = withFirebaseModularHeaders(config);
  config = withRecaptchaModularHeaders(config);
  return config;
}

module.exports = withModularHeaders;
