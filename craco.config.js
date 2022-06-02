const CracoAntDesignPlugin = require("craco-antd");
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [{ plugin: CracoAntDesignPlugin }, { plugin: CracoLessPlugin }],
  babel: {
    presets: ['@emotion/babel-preset-css-prop']
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "os": require.resolve("os-browserify/browser"),
          "stream": require.resolve("stream-browserify")
        }
      }
    }
  }
};