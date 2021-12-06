module.exports = {
  context: __dirname + '/app',
  entry: {
    entry:['./main_And_buttonEvents','./local-modules','./roby_And_buttonEvents','./play'],
  },
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'bundle.js'
  },
  mode: 'none',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
};