export default (env, argv) => {
  return {
    entry: './src/bootstrap.ts',
    output: {
      filename: '[name].js',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    }
  };
}
