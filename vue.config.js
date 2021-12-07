module.exports = {
  devServer: {
    proxy: {
      "/org": {
        // target: 'http://10.16.16.188:28082/org', // 产品部环境
        // target: 'http://ge.primeton.com:31183/', // ge环境、
        target: "http://172.50.1.176:9090/", // 昌政
        changeOrigin: true,
        secure: true,
      },
    },
  },
  // productionSourceMap: false,
};
