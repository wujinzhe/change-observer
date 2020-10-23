const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './index.js'
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: "Observer",
    globalObject: "this" // webpack v5添加的新属性，需要制定全局的值，在umd的模式下
  },
  plugins: [
    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       // warnings: false,
    //       drop_console: true,//console
    //       // pure_funcs: ['console.log']//移除console
    //     }
    //   }
    // })
  ]
}