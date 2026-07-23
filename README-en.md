# mock-database

A mock database module based on IndexedDB, providing remote data services via **Module Federation 2.0** (`@module-federation/enhanced`), and also usable directly in the browser as plain script tags. Designed for micro-frontend architectures, it allows multiple applications to share the same data source and provides a type-safe Mapper interface.


## Features

- **Module Federation 2.0**: Uses the modern Module Federation implementation (`@module-federation/enhanced`), supporting more flexible loading strategies and better performance.
- **Native Browser Usage**: Can also be loaded as a pure JavaScript package, exposing the global object `window.mockDB`, ideal for legacy projects or non-bundled projects.
- **IndexedDB Storage**: Browser-side persistent storage, enabling data operations without a real backend.
- **Type Safety**: Written in TypeScript, providing the generic `DatabaseMapper<T>` to ensure correct data structures.
- **Ready to Use**: Comes with four built-in mock datasets: `orders`, `products`, `users`, and `roles`, available immediately.
- **Lightweight Initialization**: Creates the database and object stores only on first use, automatically populating initial data.
- **CRUD + Pagination**: Supports create, read, update, delete, batch insert, conditional filtering, and paginated queries.


## Installation

### 1. Install Dependencies (Consumer Side)

The consumer side needs to install the [Module Federation 2.0](https://module-federation.io) plugin:

- Node.js >= 20

```bash
# Using npm
npm install @module-federation/enhanced --save-dev

# Using yarn
yarn add @module-federation/enhanced --dev

# Using pnpm
pnpm add @module-federation/enhanced -D
```

### 2. Configure Build Tool (Webpack Example)

In the consumer's `webpack.config.js`, use the `ModuleFederationPlugin` provided by `@module-federation/enhanced`:

```javascript
const { ModuleFederationPlugin } = require('@module-federation/enhanced');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app', // Name of the current application
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
        // Dependencies to share (optional)
      },
    }),
  ],
};
```

> **Note**: If you are using Rspack or another build tool that supports Module Federation 2.0, the configuration is similar. Please refer to the respective tool's documentation.

### 3. Type Declarations

Module Federation 2.0 automatically generates type definition files for remote modules after the project starts, located in the `@mf-types` folder at the project root. Simply include this directory in your `tsconfig.json` and optionally set up path aliases to simplify imports.

#### Configure `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      // Set alias for mockDB module types, pointing to the auto-generated types
      "mockDB/*": ["./@mf-types/mockDB/*"]
    }
    // Other options...
  },
  // Ensure the auto-generated types directory is included
  "include": ["src", "@mf-types"]
}
```

After configuration, you can directly use type-safe imports in your code, for example:

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
```

Your editor will provide autocompletion and type checking.


## Usage

### Step 1: Initialize the Database

Call `initIndexedDB` before starting the host application to create the database and object stores (**only needs to be called once**).

```typescript
import { initIndexedDB } from 'mockDB/init';

// Database name (recommended to import from a shared constant)
const DATABASE_NAME = 'MyAppDB';

await initIndexedDB(DATABASE_NAME);
console.log('IndexedDB initialized');
```

### Step 2: Get a Data Mapper

In any sub-application or module, use `DatabaseMapper` to operate on a specific data table.

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
import type { IOrder } from '@/models/order';

const mapper = new DatabaseMapper<IOrder>(DATABASE_NAME, ORDER_STORE_NAME);
```

### Step 3: Perform Data Operations

```typescript
// Get all orders
const allOrders = await mapper.getAll();

// Paginated query (page 1, 10 items per page, with filter)
const pageResult = await mapper.query(1, 10, (item) => item.status === 'pending');

// Insert a single record
await mapper.insert({ id: 1, orderNo: 'ORD-001', ... });

// Batch insert
await mapper.insertBatch([order1, order2]);

// Update
await mapper.update({ ...updatedOrder });

// Delete by id
await mapper.deleteByKey(1);

// Count total records
const count = await mapper.count();

// Clear the entire table
await mapper.clear();
```


## Browser Usage (Without Module Federation)

If you are not using Module Federation, you can also use this library directly in the browser by loading pre-built var-style bundles. Each module is a separate script and is mounted onto the global object `window.mockDB`.

### Available Scripts

Each module corresponds to an independent JavaScript file. The available scripts are:

| Script URL | Global Access Path |
|------------|---------------------|
| `/browser/init.js` | `window.mockDB.init` |
| `/browser/mapper.js` | `window.mockDB.mapper` |
| `/browser/store-names.js` | `window.mockDB.storeNames` |
| `/browser/data/orders.js` | `window.mockDB.data.orders` |
| `/browser/data/products.js` | `window.mockDB.data.products` |
| `/browser/data/users.js` | `window.mockDB.data.users` |
| `/browser/data/roles.js` | `window.mockDB.data.roles` |

> **Note**: Because the build uses `library.type: 'var'` and nested name arrays (e.g., `['mockDB', 'data', 'orders']`), exported objects are mounted under the corresponding paths on `window.mockDB`.

### Loading Scripts in HTML

Simply include the required `<script>` tags in your HTML page. Make sure to load `init.js` before any other modules that depend on database initialization.

```html
<!-- Load required bundles -->
<script src="https://liuzane.github.io/mock-database/browser/init.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/mapper.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/store-names.js"></script>
<!-- Load initial mock data if needed -->
<script src="https://liuzane.github.io/mock-database/browser/data/orders.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/data/products.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/data/users.js"></script>
<script src="https://liuzane.github.io/mock-database/browser/data/roles.js"></script>
<!-- ... -->

<script>
  // All modules are now accessible via window.mockDB
  const { initIndexedDB } = window.mockDB.init;
  const { DatabaseMapper } = window.mockDB.mapper;
  const { ORDER_STORE_NAME } = window.mockDB.storeNames;
  const orders = window.mockDB.data.orders;

  const DATABASE_NAME = 'MyAppDB';

  // Initialize the database
  initIndexedDB(DATABASE_NAME).then(() => {
    console.log('IndexedDB is ready');

    // Create an order mapper
    const orderMapper = new DatabaseMapper(DATABASE_NAME, ORDER_STORE_NAME);

    // Insert order data
    orderMapper.insertBatch(orders);

    // Get all orders
    const allOrders = await orderMapper.getAll();
    console.log('All orders:', allOrders);
  }).catch(err => {
    console.error('Error:', err);
  });
</script>
```

### Important Notes for Browser Usage

- **Loading Order**: Always load `init.js` first, before any other modules that call `initIndexedDB` or create `DatabaseMapper` instances.
- **Consistent Database Name**: Define a single `DATABASE_NAME` constant on the page to ensure all mappers point to the same database.
- **Multiple Stores**: You can load `store-names.js` to get store name constants, or hardcode store names (e.g., `'orders'`, `'products'`).
- **Mock Data**: Data scripts (e.g., `data/orders.js`) export initial mock data arrays. You can use them to populate the database, but note that `initIndexedDB` already auto-fills data on first creation.


## Exposed Modules

| Module Path | Description |
|-------------|-------------|
| `mockDB/init` | Exports `initIndexedDB(dbName: string): Promise<void>` – creates the database and all object stores. |
| `mockDB/mapper` | Exports the generic `DatabaseMapper<T>` class, providing common data access methods. |
| `mockDB/store-names` | Exports constants `ORDER_STORE_NAME`, `PRODUCT_STORE_NAME`, `USER_STORE_NAME`, `ROLE_STORE_NAME` for specifying store names. |
| `mockDB/data/orders` | Exports the `orders` array containing initial order data. |
| `mockDB/data/products` | Exports the `products` array containing initial product data. |
| `mockDB/data/users` | Exports the `users` array containing initial user data. |
| `mockDB/data/roles` | Exports the `roles` array containing initial role data. |


## API Reference

### `initIndexedDB(dbName)`

- **Parameters**: `dbName: string` – the database name
- **Returns**: `Promise<void>`
- **Description**: Creates the database and sets up object stores for `orders`, `products`, `users`, and `roles` (using `id` as the primary key).

### `DatabaseMapper<T>`

#### Constructor

```typescript
new DatabaseMapper<T>(dbName: string, storeName: string)
```

#### Instance Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `count()` | None | `Promise<number>` | Returns the total number of records in the store. |
| `insert(item)` | `item: T` | `Promise<void>` | Inserts a single record (must include an `id` field). |
| `insertBatch(items)` | `items: T[]` | `Promise<void>` | Batch inserts multiple records. |
| `update(item)` | `item: T` | `Promise<void>` | Updates an entire record by `id`. |
| `deleteByKey(key)` | `key: number` | `Promise<void>` | Deletes a record by `id`. |
| `getByKey(key)` | `key: number` | `Promise<T \| undefined>` | Retrieves a single record by `id`. |
| `getAll()` | None | `Promise<T[]>` | Retrieves all records. |
| `query(page, pageSize, filter?)` | `page: number` (1-indexed), `pageSize: number`, `filter?: (item: T) => boolean` | `Promise<PageResponse<T>>` | Paginated query with optional custom filter function. |
| `clear()` | None | `Promise<void>` | Clears all records from the store. |

#### `PageResponse<T>` Type

```typescript
interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```


## Manual Type Declarations (Fallback)

If your project cannot auto-generate type files (e.g., not using `@module-federation/enhanced`'s auto-type feature), you can manually declare module types. Add the following to your project's type declaration file (e.g., `src/typings.d.ts`):

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
// Similar declarations for other data modules
```


## Important Notes

1. **Unified Database Name**: Define a `DATABASE_NAME` constant in your application to ensure all apps use the same database.
2. **Initialization Timing**: `initIndexedDB` should be called only once (usually at host startup). Child apps can check `mapper.count()` to decide whether to populate seed data.
3. **Concurrency Control**: Use an `initPromise` lock as shown in the examples to prevent multiple concurrent initialization requests.
4. **Type Safety**: Ensure that the generic type `T` passed to the Mapper matches the actual data structure, or runtime errors may occur.
5. **Browser Compatibility**: IndexedDB is supported in all major browsers (Chrome, Firefox, Safari, Edge), but may be restricted in some private browsing modes.
6. **Module Federation Version**: This module is built with `@module-federation/enhanced`. It is recommended that consumers use the same major version (`^2.0.0` or higher). If using Rspack, ensure its built-in Module Federation also supports 2.0 features.


## Contributing

Issues and Pull Requests are welcome. Please ensure code passes ESLint and type checks.


## License

MIT License
Copyright (c) 2026-present, liuzane