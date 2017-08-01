var path = require('path')
var webpack = require('webpack')
var rootPath = "D:/react/newProject";

module.exports = {
  //记着发布时候要去掉devtools否则打包很大
  devtool: 'cheap-module-eval-source-map', 
  entry: {
    hot: 'webpack-hot-middleware/client',
    //kpAll: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true','./entry/kpAll']
    //processAll:['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true','./entry/processAll']
    insuranceAll: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true','./entry/insuranceAll']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-bundle.js',
    publicPath: '/js/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    //限制整体chunk的数量，如果chunk数量大于num，则不会有splitting
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    //会合并大小小于\d b的chunk，但至少会有一个 不会合并到parent中
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000}),
    //new webpack.optimize.CommonsChunkPlugin("commonV3.js",["proManagement","assignResponsibility"]),
    // new webpack.optimize.UglifyJsPlugin({compresskey: "value", {warnings:false}})
  ],
  module: {
    loaders: [
      {test: /\.css$/, loader: require.resolve("style-loader") + "!" + require.resolve("css-loader")},
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.woff2$|\.eot$/, loader: require.resolve("file-loader") + "?name=images/[hash:8].[ext]"},
      { test: /jquery$|jquery(-|\d|\.|min)*.js$/, loader: 'expose?jQuery!expose?$' },
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  resolve: { 
     alias: {
        jquery: rootPath +"/lib/jquery-2.2.1.min.js",
     }
  },
}
