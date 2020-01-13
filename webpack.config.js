module.exports = {
  context: __dirname + '/app',
  entry: {
    entry:'./entry',
    entry_room:'./entry-room'
  },
  output: {
    path: __dirname + '/public/javascripts',
    filename: '[name].bundle.js'
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