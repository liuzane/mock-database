# mock-database

基于 IndexedDB 的模拟数据库模块，通过 **Module Federation 2.0**（`@module-federation/enhanced`）提供远程数据服务，也可直接在浏览器中以纯脚本标签方式使用。专为微前端架构设计，允许多个应用共享同一数据源，并提供类型安全的 Mapper 接口。


## 特性

- **Module Federation 2.0**：采用现代 Module Federation 实现（`@module-federation/enhanced`），支持更灵活的加载策略和更优的性能。
- **浏览器原生用法**：也可作为纯 JavaScript 包加载，暴露全局对象 `window.mockDB`，非常适合传统项目或非打包项目。
- **IndexedDB 存储**：浏览器端持久化存储，无需真实后端即可进行数据操作。
- **类型安全**：使用 TypeScript 编写，提供泛型 `DatabaseMapper<T>` 以保证数据结构正确。
- **开箱即用**：内置四组模拟数据：`orders`、`products`、`users` 和 `roles`，立即可用。
- **轻量初始化**：仅在首次使用时创建数据库和对象存储，并自动填充初始数据。
- **CRUD + 分页**：支持创建、读取、更新、删除、批量插入、条件过滤和分页查询。


## 安装

### 1. 安装依赖（消费方）

消费方需要安装 [Module Federation 2.0](https://module-federation.io) 插件：

- Node.js >= 20

```bash
# 使用 npm
npm install @module-federation/enhanced --save-dev

# 使用 yarn
yarn add @module-federation/enhanced --dev

# 使用 pnpm
pnpm add @module-federation/enhanced -D
```

### 2. 配置构建工具（以 Webpack 为例）

在消费方的 `webpack.config.js` 中，使用 `@module-federation/enhanced` 提供的 `ModuleFederationPlugin`：

```javascript
const { ModuleFederationPlugin } = require('@module-federation/enhanced');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app', // 当前应用的名称
      remotes: {
        mockDB: {
          type: 'module',
          name: 'mockDB',
          entry: 'https://liuzane.github.io/mock-database/mf/esm/remoteEntry.js',
          entryGlobalName: 'mockDB',
          shareScope: 'default',
        }
      },
      shared: {
        // 需要共享的依赖（可选）
      },
    }),
  ],
};
```

> **注意**：如果你使用 Rspack 或其他支持 Module Federation 2.0 的构建工具，配置方式类似，请参考相应工具的文档。

### 3. 类型声明

Module Federation 2.0 会在项目启动后自动生成远程模块的类型定义文件，位于项目根目录的 `@mf-types` 文件夹中。只需在 `tsconfig.json` 中包含该目录，并可选地设置路径别名以简化导入。

#### 配置 `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      // 为 mockDB 模块类型设置别名，指向自动生成的类型
      "mockDB/*": ["./@mf-types/mockDB/*"]
    }
    // 其他选项...
  },
  // 确保包含自动生成的类型目录
  "include": ["src", "@mf-types"]
}
```

配置完成后，即可在代码中直接使用类型安全的导入，例如：

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
```

编辑器会提供自动补全和类型检查。


## 使用

### 第一步：初始化数据库

在启动宿主应用之前调用 `initIndexedDB` 以创建数据库和对象存储（**只需调用一次**）。

```typescript
import { initIndexedDB } from 'mockDB/init';

// 数据库名称（建议从共享常量中导入）
const DATABASE_NAME = 'MyAppDB';

await initIndexedDB(DATABASE_NAME);
console.log('IndexedDB 已初始化');
```

### 第二步：获取数据映射器（Mapper）

在任何子应用或模块中，使用 `DatabaseMapper` 操作特定的数据表。

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
import type { IOrder } from '@/models/order';

const mapper = new DatabaseMapper<IOrder>(DATABASE_NAME, ORDER_STORE_NAME);
```

### 第三步：执行数据操作

```typescript
// 查询所有订单
const allOrders = await mapper.getAll();

// 分页查询（第1页，每页10条，带过滤条件）
const pageResult = await mapper.query(1, 10, (item) => item.status === 'pending');

// 插入单条记录
await mapper.insert({ id: 1, orderNo: 'ORD-001', ... });

// 批量插入
await mapper.insertBatch([order1, order2]);

// 更新
await mapper.update({ ...updatedOrder });

// 按 id 删除
await mapper.deleteByKey(1);

// 统计总记录数
const count = await mapper.count();

// 清空整个表
await mapper.clear();
```


## 浏览器用法（不使用 Module Federation）

如果你不使用 Module Federation，也可以直接在浏览器中通过加载预构建的 var 风格包来使用本库。每个模块作为一个独立的脚本，并挂载到全局对象 `window.mockDB` 上。

### 可用脚本

每个模块对应一个独立的 JavaScript 文件。可用的脚本如下：

| 脚本 URL | 全局访问方式 |
|----------|-------------|
| `/browser/init.js` | `window.mockDB.init` |
| `/browser/mapper.js` | `window.mockDB.mapper` |
| `/browser/store-names.js` | `window.mockDB.storeNames` |
| `/browser/data/orders.js` | `window.mockDB.data.orders` |
| `/browser/data/products.js` | `window.mockDB.data.products` |
| `/browser/data/users.js` | `window.mockDB.data.users` |
| `/browser/data/roles.js` | `window.mockDB.data.roles` |

> **注意**：由于构建时使用了 `library.type: 'var'` 和嵌套名称数组（例如 `['mockDB', 'data', 'orders']`），导出的对象会按对应路径挂载到 `window.mockDB` 上。

### 在 HTML 中加载脚本

只需在 HTML 页面中包含所需的 `<script>` 标签。请确保在依赖数据库初始化的其他模块之前加载 `init.js`。

```html
<!-- 加载所需 bundle -->
<script src="https://liuzane.github.io/mock-database/browser/init.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/mapper.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/store-names.js"></script>
<!-- 如果需要初始模拟数据，也可以加载它们 -->
<script src="https://liuzane.github.io/mock-database/browser/data/orders.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/data/products.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/data/users.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/data/roles.js"></script>
<!-- ... -->

<script>
  // 现在所有模块都可以通过 window.mockDB 访问
  const { initIndexedDB } = window.mockDB.init;
  const { DatabaseMapper } = window.mockDB.mapper;
  const { ORDER_STORE_NAME } = window.mockDB.storeNames;
  const orders = window.mockDB.data.orders;

  const DATABASE_NAME = 'MyAppDB';

  // 初始化数据库
  initIndexedDB(DATABASE_NAME).then(() => {
    console.log('IndexedDB 已就绪');

    // 创建订单映射器
    const orderMapper = new DatabaseMapper(DATABASE_NAME, ORDER_STORE_NAME);

    // 插入订单数据
    orderMapper.insertBatch(orders);

    // 查询所有订单
    const allOrders = await orderMapper.getAll();
    console.log('所有订单：', allOrders);
  }).catch(err => {
    console.error('错误：', err);
  });
</script>
```

### 浏览器用法的重要说明

- **加载顺序**：务必先加载 `init.js`，然后再使用任何调用 `initIndexedDB` 或创建 `DatabaseMapper` 的其他模块。
- **数据库名称一致性**：在页面中定义统一的 `DATABASE_NAME` 常量，确保所有映射器指向同一个数据库。
- **多存储**：你可以加载 `store-names.js` 来获取存储名称常量，也可以直接硬编码存储名称（例如 `'orders'`、`'products'`）。
- **模拟数据**：数据脚本（如 `data/orders.js`）导出初始模拟数据数组。你可以使用它们来填充数据库，但请注意 `initIndexedDB` 在首次创建时已自动填充了数据。


## 暴露的模块

| 模块路径 | 描述 |
|----------|------|
| `mockDB/init` | 导出 `initIndexedDB(dbName: string): Promise<void>` – 创建数据库及所有对象存储。 |
| `mockDB/mapper` | 导出泛型 `DatabaseMapper<T>` 类，提供通用的数据访问方法。 |
| `mockDB/store-names` | 导出常量 `ORDER_STORE_NAME`、`PRODUCT_STORE_NAME`、`USER_STORE_NAME`、`ROLE_STORE_NAME`，用于指定存储名称。 |
| `mockDB/data/orders` | 导出 `orders` 数组，包含初始订单数据。 |
| `mockDB/data/products` | 导出 `products` 数组，包含初始产品数据。 |
| `mockDB/data/users` | 导出 `users` 数组，包含初始用户数据。 |
| `mockDB/data/roles` | 导出 `roles` 数组，包含初始角色数据。 |


## API 参考

### `initIndexedDB(dbName)`

- **参数**：`dbName: string` – 数据库名称
- **返回值**：`Promise<void>`
- **描述**：创建数据库，并为 `orders`、`products`、`users` 和 `roles` 建立对象存储（以 `id` 作为主键索引）。

### `DatabaseMapper<T>`

#### 构造函数

```typescript
new DatabaseMapper<T>(dbName: string, storeName: string)
```

#### 实例方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `count()` | 无 | `Promise<number>` | 返回存储中的总记录数。 |
| `insert(item)` | `item: T` | `Promise<void>` | 插入单条记录（必须包含 `id` 字段）。 |
| `insertBatch(items)` | `items: T[]` | `Promise<void>` | 批量插入多条记录。 |
| `update(item)` | `item: T` | `Promise<void>` | 按 `id` 更新整条记录。 |
| `deleteByKey(key)` | `key: number` | `Promise<void>` | 按 `id` 删除记录。 |
| `getByKey(key)` | `key: number` | `Promise<T \| undefined>` | 按 `id` 查询单条记录。 |
| `getAll()` | 无 | `Promise<T[]>` | 查询所有记录。 |
| `query(page, pageSize, filter?)` | `page: number`（从1开始）, `pageSize: number`, `filter?: (item: T) => boolean` | `Promise<PageResponse<T>>` | 分页查询，支持自定义过滤函数。 |
| `clear()` | 无 | `Promise<void>` | 清空存储中的所有记录。 |

#### `PageResponse<T>` 类型

```typescript
interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```


## 手动类型声明（备用方案）

如果项目无法自动生成类型文件（例如未使用 `@module-federation/enhanced` 的自动类型功能），可以手动声明模块类型。在项目的类型声明文件（如 `src/typings.d.ts`）中添加以下内容：

```typescript
declare module 'mockDB/init' {
  export function initIndexedDB(dbName: string): Promise<void>;
}

declare module 'mockDB/mapper' {
  export class DatabaseMapper<T> {
    constructor(dbName: string, storeName: string);
    count(): Promise<number>;
    insert(item: T): Promise<void>;
    insertBatch(items: T[]): Promise<void>;
    update(item: T): Promise<void>;
    deleteByKey(key: number): Promise<void>;
    getByKey(key: number): Promise<T | undefined>;
    getAll(): Promise<T[]>;
    query(page: number, pageSize: number, filter?: (item: T) => boolean): Promise<PageResponse<T>>;
    clear(): Promise<void>;
  }
}

declare module 'mockDB/store-names' {
  export const ORDER_STORE_NAME: string;
  export const PRODUCT_STORE_NAME: string;
  export const USER_STORE_NAME: string;
  export const ROLE_STORE_NAME: string;
}

declare module 'mockDB/data/orders' {
  export const orders: any[];
}
// 其他数据模块类似
```


## 重要说明

1. **统一的数据库名称**：在应用中定义 `DATABASE_NAME` 常量，确保所有应用使用同一数据库。
2. **初始化时机**：`initIndexedDB` 应只调用一次（通常在宿主启动时）。子应用可以通过 `mapper.count()` 判断是否需要填充种子数据。
3. **并发控制**：如示例所示，可使用 `initPromise` 锁防止多个并发初始化请求。
4. **类型安全**：确保传递给 Mapper 的泛型 `T` 与实际数据结构匹配，否则可能引发运行时错误。
5. **浏览器兼容性**：IndexedDB 在主流浏览器（Chrome、Firefox、Safari、Edge）中均受支持，但在某些隐私模式下可能受限。
6. **Module Federation 版本**：本模块基于 `@module-federation/enhanced` 构建，建议消费方使用相同的主版本（`^2.0.0` 或更高）。如果使用 Rspack，请确保其内置的 Module Federation 也支持 2.0 特性。


## 贡献

欢迎提交 Issue 和 Pull Request。请确保代码通过 ESLint 和类型检查。


## 许可证

MIT License
Copyright (c) 2026-present, liuzane