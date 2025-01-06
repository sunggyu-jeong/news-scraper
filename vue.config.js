const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.devtool("source-map");
  },
  outputDir: "dist",
  configureWebpack: {
    resolve: {
      fallback: {
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        os: require.resolve("os-browserify/browser"),
        vm: require.resolve("vm-browserify"),
        fs: false,
        net: false,
        child_process: false,
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  },
});
