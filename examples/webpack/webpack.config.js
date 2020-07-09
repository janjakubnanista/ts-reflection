const transformer = require('ts-reflection/transformer');

module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: `index.js`,
    path: __dirname,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // awesome-typescript-loader works just as good
        loader: 'ts-loader',
        options: {
          getCustomTransformers: (program) => ({
            before: [transformer(program)],
          }),
        },
      },
    ],
  },
};
