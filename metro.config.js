const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Worklets are native-only in this project, so keep web builds from resolving them.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native-worklets") {
    return { type: "empty" };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
