const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add support for resolving modules from node_modules
config.resolver.platforms = ["ios", "android", "native", "web"];

// Ensure proper module resolution
config.resolver.nodeModulesPaths = [
  require("path").resolve(__dirname, "node_modules"),
];

module.exports = config;
