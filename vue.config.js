const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: [
        {
          loader: "webpack-glsl-loader",
        },
      ],
    });
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4523/m1/3425979-1265367-default/', // 设置代理目标，包括端口号
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '/api', // 将路径中的 '/api' 替换为空字符串        
        // },
      },
    },
  },
});
