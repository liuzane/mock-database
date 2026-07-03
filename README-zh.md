# mock-database

一个基于 IndexedDB 的模拟数据库模块，通过 **Module Federation 2.0**（`@module-federation/enhanced`）提供远程数据服务。适用于微前端架构，支持多应用共享同一份数据源，并提供类型安全的 Mapper 接口。

## 特性

- **模块联邦 2.0**：使用现代化的 Module Federation 实现（`@module-federation/enhanced`），支持更灵活的加载策略和更好的性能。
- **IndexedDB 存储**：浏览器端持久化存储，无需后端即可模拟数据操作。
- **类型安全**：使用 TypeScript 编写，提供泛型 `DatabaseMapper<T>`，保障数据结构正确性。
- **开箱即用**：内置 `orders`、`products`、`users`、`roles` 四套模拟数据，可快速启动。
- **轻量初始化**：仅在首次使用时创建数据库和对象存储，自动填充初始数据。
- **CRUD + 分页**：支持增删改查、批量插入、条件过滤、分页查询。

## 安装

### 1. 安装依赖（构建工具侧）

消费方需安装 [Module Federation 2.0](https://module-federation.io) 插件：

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
          entry: 'https://liuzane.github.io/mock-database/remoteEntry.js',
          entryGlobalName: 'mockDB',
          shareScope: 'default',
        }
      },
      shared: {
        // 共享依赖（如需）
      },
    }),
  ],
};
```

> **注意**：如果使用 Rspack 或其他支持 Module Federation 2.0 的构建工具，配置方式类似，具体请参考对应工具的文档。

### 3. 类型声明

Module Federation 2.0 会在项目启动后自动生成远程模块的类型定义文件，存放在项目根目录的 `@mf-types` 文件夹中。你只需在 `tsconfig.json` 中引入该目录，并可配置路径别名以简化导入。

#### 配置 `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      // 为 mockDB 模块配置类型别名，指向自动生成的类型
      "mockDB/*": ["./@mf-types/mockDB/*"]
    }
    // 其他配置...
  },
  // 确保包含自动生成的类型目录
  "include": ["src", "@mf-types"]
}
```

配置完成后，你就可以在代码中直接使用类型安全的导入，例如：

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
```

编辑器会自动提供智能提示和类型校验。

## 使用方法

### 第一步：初始化数据库

在宿主应用启动前，调用 `initIndexedDB` 完成数据库创建和表结构初始化（**只需执行一次**）。

```typescript
import { initIndexedDB } from 'mockDB/init';

// 数据库名称（建议从共享常量导入）
const DATABASE_NAME = 'MyAppDB';

await initIndexedDB(DATABASE_NAME);
console.log('IndexedDB 初始化完成');
```

### 第二步：获取数据 Mapper

在任何子应用或模块中，通过 `DatabaseMapper` 操作具体的数据表。

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

// 插入单条
await mapper.insert({ id: 1, orderNo: 'ORD-001', ... });

// 批量插入
await mapper.insertBatch([order1, order2]);

// 更新
await mapper.update({ ...updatedOrder });

// 删除
await mapper.deleteByKey(1);

// 统计数量
const count = await mapper.count();

// 清空表
await mapper.clear();
```

## 暴露模块说明

| 模块路径 | 描述 |
|---------|------|
| `mockDB/init` | 导出 `initIndexedDB(dbName: string): Promise<void>`，用于创建数据库和所有对象存储。 |
| `mockDB/mapper` | 导出 `DatabaseMapper<T>` 类，提供泛型数据访问方法。 |
| `mockDB/store-names` | 导出常量 `ORDER_STORE_NAME`、`PRODUCT_STORE_NAME`、`USER_STORE_NAME`、`ROLE_STORE_NAME`，用于指定表名。 |
| `mockDB/data/orders` | 导出 `orders` 数组，包含初始订单数据。 |
| `mockDB/data/products` | 导出 `products` 数组，包含初始产品数据。 |
| `mockDB/data/users` | 导出 `users` 数组，包含初始用户数据。 |
| `mockDB/data/roles` | 导出 `roles` 数组，包含初始角色数据。 |

## API 参考

### `initIndexedDB(dbName)`

- **参数**：`dbName: string` – 数据库名称
- **返回值**：`Promise<void>`
- **作用**：创建数据库，并建立 `orders`、`products`、`users`、`roles` 四个对象存储（索引 `id` 作为主键）。

### `DatabaseMapper<T>`

#### 构造器

```typescript
new DatabaseMapper<T>(dbName: string, storeName: string)
```

#### 实例方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `count()` | 无 | `Promise<number>` | 获取表中记录总数。 |
| `insert(item)` | `item: T` | `Promise<void>` | 插入单条记录（需包含 `id` 字段）。 |
| `insertBatch(items)` | `items: T[]` | `Promise<void>` | 批量插入记录。 |
| `update(item)` | `item: T` | `Promise<void>` | 根据 `id` 更新整条记录。 |
| `deleteByKey(key)` | `key: number` | `Promise<void>` | 根据 `id` 删除记录。 |
| `getByKey(key)` | `key: number` | `Promise<T \| undefined>` | 根据 `id` 查询单条记录。 |
| `getAll()` | 无 | `Promise<T[]>` | 获取所有记录。 |
| `query(page, pageSize, filter?)` | `page: number` (从1开始), `pageSize: number`, `filter?: (item: T) => boolean` | `Promise<PageResponse<T>>` | 分页查询，支持自定义过滤函数。 |
| `clear()` | 无 | `Promise<void>` | 清空表中所有数据。 |

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

## 手动类型声明（备选）

如果您的项目无法自动生成类型文件（例如未使用 `@module-federation/enhanced` 的自动类型生成功能），您可以手动声明模块类型。在项目的类型声明文件（如 `src/typings.d.ts`）中添加以下内容：

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
// 其他数据类似
```

## 注意事项

1. **数据库名称统一**：建议在应用中定义 `DATABASE_NAME` 常量，确保所有应用使用相同的数据库名。
2. **数据初始化时机**：`initIndexedDB` 只需调用一次（通常在宿主启动时），子应用通过 Mapper 的 `count()` 判断是否需要填充初始数据。
3. **并发控制**：如示例所示，在 `init()` 方法中使用 `initPromise` 锁，避免多个并发请求重复初始化。
4. **类型安全**：请确保传入 Mapper 的泛型 `T` 与实际数据接口一致，否则可能导致运行时错误。
5. **浏览器兼容性**：IndexedDB 在主流浏览器（Chrome、Firefox、Safari、Edge）中均受支持，但在某些私有模式下可能受限。
6. **Module Federation 版本**：本模块基于 `@module-federation/enhanced` 构建，建议消费方使用相同版本（^2.0.0 或更高）。如果使用 Rspack，请确保其内置的 Module Federation 也支持 2.0 特性。

## 贡献

欢迎提交 Issue 和 Pull Request。请确保代码通过 ESLint 和类型检查。

## License

MIT