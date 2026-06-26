export type Resolve<T> = (value: T) => void;
export type Reject<T> = (error: T) => void;

export interface IndexedDBSchema {
  storeName: string;
  keyPath: string;
  autoIncrement: boolean;
  indexes: IndexedDBIndex[];
}

export interface IndexedDBIndex {
  name: string;
  keyPath: string;
  unique: boolean;
}

export interface PageResponse<T> {
  data: T[];
  total: number;
}
