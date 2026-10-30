// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // `.expo` holds Metro's exported bundles and `android` holds generated
    // native sources; neither is ours to lint.
    ignores: ['dist/*', '.expo/*', 'android/*', 'ios/*'],
  },
]);
