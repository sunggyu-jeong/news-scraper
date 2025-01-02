const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.devtool("source-map");
  },
  outputDir: "dist",
  devServer: {
    proxy: "http://localhost:3000",
  },
});
