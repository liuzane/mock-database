export default {
  name: 'mockDB',
  library: {
    type: "module",
  },
  filename: 'remoteEntry.js',
  exposes: {
    './init': './src/init',
    './mapper': './src/mapper',
    './store-names': './src/store-names',
    './data/orders': './src/data/orders',
    './data/products': './src/data/products',
    './data/users': './src/data/users',
    './data/roles': './src/data/roles',
  }
};
