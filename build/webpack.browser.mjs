// 基础模块
import path from 'path';

// 插件
import { merge } from 'webpack-merge';

// 环境变量
import { OUTPUT_PATH, BROWSER_PUBLIC_PATH } from './env.mjs';

// 配置
import baseConfig from './webpack.base.mjs';
import entries from './entries.mjs';

export default (env, argv) => {
  // 动态生成 entry
  const entry = {};
  entries.forEach(({ name, path: entryPath }) => {
    entry[name] = {
      import: entryPath,
      library: {
        type: 'var',
        name: ['mockDB', ...name.replace(/-([a-z])/g, (_, char) => char.toUpperCase()).split('/')], // window.mockDB.[name]
      },
    };
  });

  return merge(baseConfig(env, argv), {
    entry,
    output: {
      path: path.resolve(process.cwd(), OUTPUT_PATH, BROWSER_PUBLIC_PATH),
      publicPath: argv.mode === 'production' ? `/mock-database/${BROWSER_PUBLIC_PATH}/` : `/${BROWSER_PUBLIC_PATH}/`,
    },
  });
};