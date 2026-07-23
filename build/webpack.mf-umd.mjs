// 基础模块
import path from 'path';

// 插件
import { merge } from 'webpack-merge';
import { ModuleFederationPlugin } from '@module-federation/enhanced';

// 环境变量
import { DEV_PORT, OUTPUT_PATH, MF_UMD_PUBLIC_PATH } from './env.mjs';

// 配置
import baseConfig from './webpack.base.mjs';
import mfConfig from './module-federation.config.mjs';

export default (env, argv) => {
  return merge(baseConfig(env, argv), {
    output: {
      path: path.resolve(process.cwd(), OUTPUT_PATH, MF_UMD_PUBLIC_PATH),
      publicPath: argv.mode === 'production' ? `/mock-database/${MF_UMD_PUBLIC_PATH}/` : `http://localhost:${DEV_PORT}/${MF_UMD_PUBLIC_PATH}/`,
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
      new ModuleFederationPlugin(mfConfig('umd')),
    ]
  });
}
