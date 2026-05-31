const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Shim react-native-worklets on web — worklets are native-only
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-worklets') {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
