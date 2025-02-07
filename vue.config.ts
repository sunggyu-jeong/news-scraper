const { defineConfig } = require("@vue/cli-service");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.devtool("source-map");
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        return options;
      });
  },
  outputDir: "dist",
  configureWebpack: {
    resolve: {
      extensions: [".js", ".ts", ".vue", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
  },
});
