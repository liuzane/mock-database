// 插件
import { merge } from 'webpack-merge';

// 环境变量
import { DEV_PORT } from './env.mjs';

// 配置
import browserConfig from './webpack.browser.mjs';
import mfEsmConfig from './webpack.mf-esm.mjs';
import mfUmdConfig from './webpack.mf-umd.mjs';

export default (env, argv) => {
  const config = merge(browserConfig(env, argv), {
    devServer: {
      port: DEV_PORT,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  });
  return [config, mfEsmConfig(env, argv), mfUmdConfig(env, argv)];
};