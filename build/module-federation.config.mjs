import entries from './entries.mjs';

export default (libType) => {
  // 动态生成 exposes
  const exposes = {};
  entries.forEach(({ name, path }) => {
    exposes[`./${name}`] = path;
  });

  const library = {
    type: libType,
  };
  // 为 var 和 umd 类型添加 name
  if (libType === 'var' || libType === 'umd') {
    library.name = 'mockDB';
  }

  return {
    name: 'mockDB',
    library,
    filename: 'remoteEntry.js',
    exposes,
  };
};