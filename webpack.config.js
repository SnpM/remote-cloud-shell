const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node', // Required for VS Code extensions
  entry: './src/extension.ts', // Update to your main TypeScript file
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // Exclude VS Code API from the bundle
  },
};