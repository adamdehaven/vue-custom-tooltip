// vue.config.js
module.exports = {
  css: {
    extract: false,
  },
  configureWebpack: {
    devtool: 'source-map',
    output: {
      libraryExport: 'default',
    },
  },
  productionSourceMap: false,
}
