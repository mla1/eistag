const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/js'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          globOptions: {
            ignore: ['**/js/*.js'],
          },
          context: path.resolve(__dirname, 'src'),
          to: '..',
        },
        'src/js/ui.js',
        'src/js/util.js',
        'src/js/jquery.min.js',
      ],
    }),
  ],
};