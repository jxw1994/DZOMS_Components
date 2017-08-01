var path = require('path')
var webpack = require('webpack')

module.exports = {
  //记着发布时候要去掉devtools否则打包很大
  //devtool: 'cheap-module-eval-source-map', 
  entry: {
    hot: 'webpack-hot-middleware/client',
    kpAll: './entry/kpAll',
    processAll:'./entry/processAll',
    insuranceAll: './entry/insuranceAll',
    goodsAll:'./entry/goodsAll',
    driverKp:'./entry/driverKp',
    //testAll:'./entry/testAll'
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
    //限制整体chunk的数量，如果chunk数量大于num，则不会有splitting
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    //会合并大小小于\d b的chunk，但至少会有一个 不会合并到parent中
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000}),
    // new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
    new webpack.optimize.CommonsChunkPlugin({
      name:"init",
      filename:"commonV3.js",
      minChunks:3
    })
    // "commonV3.js",["kpAll","processAll","insuranceAll","goodsAll","driverKp"]),
    //  new webpack.optimize.UglifyJsPlugin({compresskey: "value"})
  ],
  module: {
    rules: [
      {
        test:/\.css$/,
        use:["style-loader","css-loader"]
      },{
        test:/\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.woff2$|\.eot$/,
        use:["file-loader"],
      },{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ],
      },
      {test: require.resolve("jquery"), use: "expose-loader?jQuery!expose-loader?$"},
      {test: require.resolve("react"), use: "expose-loader?React"},
      {test: require.resolve("react-dom"), use: "expose-loader?ReactDOM"},
      {test: require.resolve("underscore"), use: "expose-loader?_"}
    ]
  },
  resolve: { 
     alias: {
        jquery: path.join(__dirname, '/lib/jquery-2.2.1.min.js'),
     }
  },
}
