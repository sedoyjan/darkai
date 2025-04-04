const fs = require('fs-extra');
const path = require('path');

// Copy the configuration/ios-config directory to ios/Configurations
// for backwards compatibility with UIP infra, which reads the xcconfig files from this directory.
const withXcConfig = (config) => {
  if (!fs.existsSync(path.resolve(__dirname, '..', 'ios'))) {
    return config;
  }
  const sourceDir = path.resolve(__dirname, '..', 'configuration', 'ios-config');
  const destDir = path.resolve(__dirname, '..', 'ios', 'Configurations');
  fs.copySync(sourceDir, destDir, { overwrite: true });

  return config;
};

module.exports = withXcConfig;
