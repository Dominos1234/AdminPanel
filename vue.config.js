module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "^/api": {
        target: "http://51.178.82.249:2067/",
        ws: true,
        changeOrigin: true
      }
    }
  }
};