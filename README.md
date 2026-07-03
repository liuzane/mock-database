# mock-database

A mock database module based on IndexedDB, providing remote data services via **Module Federation 2.0** (`@module-federation/enhanced`). Designed for micro‑frontend architectures, it allows multiple applications to share the same data source and offers a type‑safe Mapper interface.

## Features

- **Module Federation 2.0**: Built with the modern Module Federation implementation (`@module-federation/enhanced`), supporting more flexible loading strategies and better performance.
- **IndexedDB Storage**: Browser‑side persistent storage, enabling data operations without a real backend.
- **Type Safety**: Written in TypeScript, providing a generic `DatabaseMapper<T>` to guarantee correct data structures.
- **Out‑of‑the‑box**: Comes with four sets of mock data: `orders`, `products`, `users`, and `roles` – ready to use immediately.
- **Lightweight Initialization**: Creates the database and object stores only on first use, automatically seeding initial data.
- **CRUD + Pagination**: Supports create, read, update, delete, batch insert, conditional filtering, and paginated queries.

## Installation

### 1. Install Dependencies (on the consumer side)

The consumer needs to install the [Module Federation 2.0](https://module-federation.io) plugin:

```bash
# Using npm
npm install @module-federation/enhanced --save-dev

# Using yarn
yarn add @module-federation/enhanced --dev

# Using pnpm
pnpm add @module-federation/enhanced -D
```

### 2. Configure the Build Tool (using Webpack as an example)

In the consumer’s `webpack.config.js`, use the `ModuleFederationPlugin` provided by `@module-federation/enhanced`:

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
          entry: 'https://liuzane.github.io/mock-database/remoteEntry.js',
          entryGlobalName: 'mockDB',
          shareScope: 'default',
        }
      },
      shared: {
        // Shared dependencies (if needed)
      },
    }),
  ],
};
```

> **Note**: If you are using Rspack or another build tool that supports Module Federation 2.0, the configuration is similar. Please refer to the respective tool’s documentation for details.

### 3. Type Declarations

Module Federation 2.0 automatically generates type definition files for remote modules after the project starts. These are placed in the `@mf-types` folder at the project root. Simply include this directory in your `tsconfig.json`, and optionally set up path aliases for simpler imports.

#### Configure `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      // Alias for mockDB module types, pointing to the auto‑generated types
      "mockDB/*": ["./@mf-types/mockDB/*"]
    }
    // Other options...
  },
  // Ensure the auto‑generated types directory is included
  "include": ["src", "@mf-types"]
}
```

After this configuration, you can use type‑safe imports directly in your code, for example:

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
```

Your editor will provide auto‑completion and type checking.

## Usage

### Step 1: Initialize the Database

Call `initIndexedDB` before bootstrapping the host application to create the database and object stores (**do this only once**).

```typescript
import { initIndexedDB } from 'mockDB/init';

// Database name (recommended to import from a shared constant)
const DATABASE_NAME = 'MyAppDB';

await initIndexedDB(DATABASE_NAME);
console.log('IndexedDB initialized');
```

### Step 2: Obtain a Data Mapper

In any child application or module, use `DatabaseMapper` to operate on a specific data table.

```typescript
import { DatabaseMapper } from 'mockDB/mapper';
import { ORDER_STORE_NAME } from 'mockDB/store-names';
import type { IOrder } from '@/models/order';

const mapper = new DatabaseMapper<IOrder>(DATABASE_NAME, ORDER_STORE_NAME);
```

### Step 3: Perform Data Operations

```typescript
// Query all orders
const allOrders = await mapper.getAll();

// Paginated query (page 1, 10 items per page, with filter)
const pageResult = await mapper.query(1, 10, (item) => item.status === 'pending');

// Insert single record
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

## Exposed Modules

| Module Path | Description |
|-------------|-------------|
| `mockDB/init` | Exports `initIndexedDB(dbName: string): Promise<void>` – creates the database and all object stores. |
| `mockDB/mapper` | Exports the `DatabaseMapper<T>` class with generic data access methods. |
| `mockDB/store-names` | Exports constants `ORDER_STORE_NAME`, `PRODUCT_STORE_NAME`, `USER_STORE_NAME`, `ROLE_STORE_NAME` for specifying store names. |
| `mockDB/data/orders` | Exports the `orders` array containing initial order data. |
| `mockDB/data/products` | Exports the `products` array containing initial product data. |
| `mockDB/data/users` | Exports the `users` array containing initial user data. |
| `mockDB/data/roles` | Exports the `roles` array containing initial role data. |

## API Reference

### `initIndexedDB(dbName)`

- **Parameters**: `dbName: string` – the database name
- **Returns**: `Promise<void>`
- **Description**: Creates the database and sets up object stores for `orders`, `products`, `users`, and `roles` (with `id` as the primary key index).

### `DatabaseMapper<T>`

#### Constructor

```typescript
new DatabaseMapper<T>(dbName: string, storeName: string)
```

#### Instance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `count()` | None | `Promise<number>` | Returns the total number of records in the store. |
| `insert(item)` | `item: T` | `Promise<void>` | Inserts a single record (must include an `id` field). |
| `insertBatch(items)` | `items: T[]` | `Promise<void>` | Inserts multiple records in batch. |
| `update(item)` | `item: T` | `Promise<void>` | Updates an entire record by its `id`. |
| `deleteByKey(key)` | `key: number` | `Promise<void>` | Deletes a record by its `id`. |
| `getByKey(key)` | `key: number` | `Promise<T \| undefined>` | Retrieves a single record by its `id`. |
| `getAll()` | None | `Promise<T[]>` | Retrieves all records. |
| `query(page, pageSize, filter?)` | `page: number` (1‑based), `pageSize: number`, `filter?: (item: T) => boolean` | `Promise<PageResponse<T>>` | Paginated query with an optional custom filter function. |
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

If your project cannot automatically generate type files (e.g., you are not using the auto‑type feature of `@module-federation/enhanced`), you can manually declare module types. Add the following to your project’s type declaration file (e.g., `src/typings.d.ts`):

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
// Similar for other data modules
```

## Important Notes

1. **Consistent Database Name**: Define a `DATABASE_NAME` constant across your application to ensure all apps use the same database.
2. **Initialization Timing**: `initIndexedDB` should be called only once (typically during host startup). Child applications can use `mapper.count()` to determine if seed data needs to be inserted.
3. **Concurrency Control**: As shown in the examples, use an `initPromise` lock to prevent multiple concurrent initialisation requests.
4. **Type Safety**: Ensure the generic type `T` passed to the Mapper matches the actual data structure, otherwise runtime errors may occur.
5. **Browser Compatibility**: IndexedDB is supported in all major browsers (Chrome, Firefox, Safari, Edge), but may be restricted in some private browsing modes.
6. **Module Federation Version**: This module is built with `@module-federation/enhanced`. Consumers are recommended to use the same major version (`^2.0.0` or higher). If using Rspack, ensure its built‑in Module Federation also supports 2.0 features.

## Contributing

Issues and pull requests are welcome. Please ensure the code passes ESLint and type checks.

## License

MIT