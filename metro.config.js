const { getDefaultConfig } = require('expo/metro-config');
const getPolyfills = require('@react-native/js-polyfills');

const config = getDefaultConfig(__dirname);

if (config.serializer) {
  config.serializer.getPolyfills = (options) => {
    try {
      return getPolyfills();
    } catch (e) {
      return [];
    }
  };
}


module.exports = config;
