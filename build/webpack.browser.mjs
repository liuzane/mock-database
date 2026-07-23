// 基础模块
import path from 'path';

// 插件
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';

// 环境变量
import { OUTPUT_PATH, BROWSER_PUBLIC_PATH } from './env.mjs';

// 配置
import baseConfig from './webpack.base.mjs';
import entries from './entries.mjs';

export default (env, argv) => {
  const isProduction = argv.mode === 'production';

  // 动态生成 entry
  const entry = {};
  entries.forEach(({ name, path: entryPath }) => {
    entry[name] = {
      import: entryPath,
      library: {
        type: 'var',
        name: ['mockDB', ...name.replace(/-([a-z])/g, (_, char) => char.toUpperCase()).split('/')], // window.mockDB.[name]
        export: name.startsWith('data/') ? 'default' : undefined,
      },
    };
  });

  return merge(baseConfig(env, argv), {
    entry,
    output: {
      path: path.resolve(process.cwd(), OUTPUT_PATH, BROWSER_PUBLIC_PATH),
      publicPath: argv.mode === 'production' ? `/mock-database/${BROWSER_PUBLIC_PATH}/` : `/${BROWSER_PUBLIC_PATH}/`,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',        // 处理 TypeScript 语法
                [
                  '@babel/preset-env',
                  {
                    targets: { ie: '11' },         // 目标浏览器
                  },
                ],
              ],
              plugins: [
                [
                  'babel-plugin-polyfill-corejs3',
                  {
                    method: 'usage-pure',          // 按需注入，不污染全局（适合库）
                    proposals: true,               // 支持提案阶段的 polyfill
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimizer: isProduction
        ? [
            new TerserPlugin({
              extractComments: false,
            }),
          ]
        : [], // 开发环境不压缩
    },
  });
};