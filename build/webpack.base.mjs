export default (env, argv) => {
  return {
    entry: './src/bootstrap.ts',
    output: {
      filename: '[name].js',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
}
