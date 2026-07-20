// 配置
import browserConfig from './webpack.browser.mjs';
import mfEsmConfig from './webpack.mf-esm.mjs';
import mfUmdConfig from './webpack.mf-umd.mjs';

export default (env, argv) => {
  return [
    browserConfig(env, argv),
    mfEsmConfig(env, argv),
    mfUmdConfig(env, argv),
  ];
}
