// 类型
import type { PageResponse, Resolve, Reject } from './types';

/**
 * 数据库操作工具类（类似 Java 的 Mapper）
 * 使用方式：new DatabaseMapper<T>(storeName) 后调用增删改查方法
 */
export class DatabaseMapper<T> {
  private readonly dbName: string;
  private readonly storeName: string;

  constructor(databaseName: string, storeName: string) {
    this.dbName = databaseName;
    this.storeName = storeName;
  }

  /**
   * 打开数据库连接
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve: Resolve<IDBDatabase>, reject: Reject<Error>) => {
      const request: IDBOpenDBRequest = indexedDB.open(this.dbName);
      request.onerror = () => reject(new Error(request.error?.message || '数据库打开失败'));
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * 获取数据库连接、事务和对象存储
   * @param mode 事务模式（readonly 或 readwrite）
   */
  private async getStore(mode: IDBTransactionMode): Promise<{ db: IDBDatabase; transaction: IDBTransaction; store: IDBObjectStore }> {
    const db: IDBDatabase = await this.openDB();
    const transaction: IDBTransaction = db.transaction(this.storeName, mode);
    const store: IDBObjectStore = transaction.objectStore(this.storeName);
    return { db, transaction, store };
  }

  /**
   * 分页查询（支持过滤条件）
   * @param page 当前页码（从1开始）
   * @param pageSize 每页条数
   * @param filter 过滤函数
   */
  async query(
    page: number,
    pageSize: number,
    filter?: (item: T) => boolean,
  ): Promise<PageResponse<T>> {
    const { db, store } = await this.getStore('readonly');
    const cursorRequest: IDBRequest<IDBCursorWithValue | null> = store.openCursor();

    return new Promise((resolve: Resolve<PageResponse<T>>, reject: Reject<Error>) => {
      const result: T[] = [];
      let total: number = 0;
      let skipped: number = 0;
      const skipCount: number = (page - 1) * pageSize;

      cursorRequest.onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const item: T = cursor.value as T;
          const matchFilter: boolean = filter ? filter(item) : true;
          if (matchFilter) {
            total++;
            if (skipped < skipCount) {
              skipped++;
            } else if (result.length < pageSize) {
              result.push(item);
            }
          }
          cursor.continue();
        } else {
          db.close();
          resolve({ data: result, total });
        }
      };
      cursorRequest.onerror = () => {
        db.close();
        reject(new Error(cursorRequest.error?.message || '分页查询失败'));
      };
    });
  }

  /**
   * 统计记录数（支持过滤条件）
   * @param filter 过滤函数（可选）
   */
  async count(filter?: (item: T) => boolean): Promise<number> {
    const { db, store } = await this.getStore('readonly');
    const cursorRequest: IDBRequest<IDBCursorWithValue | null> = store.openCursor();

    return new Promise((resolve: Resolve<number>, reject: Reject<Error>) => {
      let count: number = 0;

      cursorRequest.onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const item: T = cursor.value as T;
          if (!filter || filter(item)) {
            count++;
          }
          cursor.continue();
        } else {
          db.close();
          resolve(count);
        }
      };
      cursorRequest.onerror = () => {
        db.close();
        reject(new Error(cursorRequest.error?.message || '统计记录数失败'));
      };
    });
  }

  /**
   * 根据主键获取单条数据
   * @param key 主键值
   */
  async getByKey(key: string | number): Promise<T | undefined> {
    const { db, store } = await this.getStore('readonly');
    const request: IDBRequest<T | undefined> = store.get(key);

    return new Promise((resolve: Resolve<T | undefined>, reject: Reject<Error>) => {
      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };
      request.onerror = () => {
        db.close();
        reject(new Error(request.error?.message || '根据主键获取数据失败'));
      };
    });
  }

  /**
   * 获取所有数据
   */
  async getAll(): Promise<T[]> {
    const { db, store } = await this.getStore('readonly');
    const request: IDBRequest<T[]> = store.getAll();

    return new Promise((resolve: Resolve<T[]>, reject: Reject<Error>) => {
      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };
      request.onerror = () => {
        db.close();
        reject(new Error(request.error?.message || '获取所有数据失败'));
      };
    });
  }

  /**
   * 插入单条数据
   * @param item 要插入的数据
   */
  async insert(item: T): Promise<void> {
    const { db, store } = await this.getStore('readwrite');

    return new Promise((resolve: Resolve<void>, reject: Reject<Error>) => {
      const request: IDBRequest<IDBValidKey> = store.add(item);
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(new Error(request.error?.message || '插入数据失败'));
      };
    });
  }

  /**
   * 批量插入数据
   * @param items 要插入的数据数组
   */
  async insertBatch(items: T[]): Promise<void> {
    const { db, transaction, store } = await this.getStore('readwrite');

    return new Promise((resolve: Resolve<void>, reject: Reject<Error>) => {
      items.forEach((item: T) => store.add(item));
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = (event: Event) => {
        const target: IDBRequest = event.target as IDBRequest;
        const error: DOMException = target?.error as DOMException;
        db.close();
        reject(new Error(error?.message || '批量插入数据失败'));
      };
    });
  }

  /**
   * 更新数据
   * @param item 要更新的数据（必须包含主键）
   */
  async update(item: T): Promise<void> {
    const { db, store } = await this.getStore('readwrite');
    const request: IDBRequest<IDBValidKey> = store.put(item);

    return new Promise((resolve: Resolve<void>, reject: Reject<Error>) => {
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(new Error(request.error?.message || '更新数据失败'));
      };
    });
  }

  /**
   * 根据主键删除数据
   * @param key 主键值
   */
  async deleteByKey(key: string | number): Promise<void> {
    const { db, store } = await this.getStore('readwrite');
    const request: IDBRequest<undefined> = store.delete(key);

    return new Promise((resolve: Resolve<void>, reject: Reject<Error>) => {
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(new Error(request.error?.message || '删除数据失败'));
      };
    });
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    const { db, store } = await this.getStore('readwrite');
    const request: IDBRequest<undefined> = store.clear();

    return new Promise((resolve: Resolve<void>, reject: Reject<Error>) => {
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(new Error(request.error?.message || '清空数据失败'));
      };
    });
  }
}
