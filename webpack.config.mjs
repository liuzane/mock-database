import path from 'path';
import { ModuleFederationPlugin } from '@module-federation/enhanced';
import mfConfig from './module-federation.config.mjs';

export default {
  entry: './src/bootstrap.ts',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    publicPath: '/',
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
  plugins: [
    new ModuleFederationPlugin(mfConfig),
  ],
  experiments: {
    outputModule: true,
  },
  devServer: {
    port: 1000,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};