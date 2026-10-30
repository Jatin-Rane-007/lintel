module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      // jsxImportSource lets NativeWind read `className` on core RN components.
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
