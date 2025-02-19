const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // 소스 맵 설정
    config.devtool("source-map");

    // TypeScript 확장자를 resolve.extensions에 추가
    config.resolve.extensions.add(".ts").add(".tsx");
  },
  outputDir: "dist",
  configureWebpack: {
    resolve: {
      // .ts, .vue, .js, .json 등의 확장자에 대한 처리
      extensions: ["*", ".ts", ".tsx", ".js", ".vue", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader", // TypeScript 파일 처리
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/], // .vue 파일 안에 있는 TypeScript 코드 처리
          },
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
      ],
    },
  },
});
