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
      extensions: ["*", ".js", ".vue", ".json"],
    },
    plugins: [],
  },
});
