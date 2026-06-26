// 常量
import {
  ORDER_STORE_NAME,
  PRODUCT_STORE_NAME,
  USER_STORE_NAME,
  ROLE_STORE_NAME,
} from './store-names';

// 类型
import type {
  Resolve,
  Reject,
  IndexedDBSchema,
  IndexedDBIndex,
} from './types';

// 数据库配置
const schemas: IndexedDBSchema[] = [
  {
    storeName: ORDER_STORE_NAME,
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'idx_id', keyPath: 'id', unique: true },
      { name: 'idx_name', keyPath: 'productName', unique: false },
      { name: 'idx_createTime', keyPath: 'createTime', unique: false },
    ],
  },
  {
    storeName: PRODUCT_STORE_NAME,
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'idx_id', keyPath: 'id', unique: true },
      { name: 'idx_name', keyPath: 'name', unique: false },
    ],
  },
  {
    storeName: USER_STORE_NAME,
    keyPath: 'id',
    autoIncrement: true,
    indexes: [],
  },
  {
    storeName: ROLE_STORE_NAME,
    keyPath: 'id',
    autoIncrement: true,
    indexes: [],
  },
];

/**
 * 初始化 IndexedDB 所有表结构
 */
export async function initIndexedDB(dataBaseName: string, version?: number) {
  if (!window.indexedDB) {
    throw new Error('当前浏览器不支持 IndexedDB');
  }

  // 创建数据库和表
  const db: IDBDatabase = await new Promise<IDBDatabase>((resolve: Resolve<IDBDatabase>, reject: Reject<DOMException | null>) => {
    const request: IDBOpenDBRequest = indexedDB.open(
      dataBaseName,
      version ?? 1,
    );
    request.onupgradeneeded = (event: Event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      schemas.forEach((storeConfig: IndexedDBSchema) => {
        const { storeName, indexes, ...options } = storeConfig;
        if (db.objectStoreNames.contains(storeName)) {
          return;
        }
        const store: IDBObjectStore = db.createObjectStore(
          storeName,
          options,
        );
        indexes.forEach((index: IndexedDBIndex) => {
          store.createIndex(
            index.name,
            index.keyPath,
            {
              unique: index.unique,
            },
          );
        });
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
}
