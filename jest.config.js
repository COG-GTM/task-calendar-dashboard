module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@react-native|react-native|react-native-safe-area-context|@react-native-async-storage)/)',
  ],
};
