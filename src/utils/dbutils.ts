// indexedDB 数据库操作

// 1. 定义接口与类型
interface User {
  id?: number;
  name: string;
  email: string;
}

type DBRequestSuccessHandler<T> = (event: Event) => T;
type DBRequestErrorHandler = (event: Event) => DOMException;

// 2. 创建 IndexedDB 连接
const dbName = "myDatabase";
const dbVersion = 1;
let db: IDBDatabase | null = null;

// 3. 定义对象存储（Object Store）
const objectStoreName = "users";

const openRequest = indexedDB.open(dbName, dbVersion);

openRequest.onerror = (event) => {
  console.error(
    "IndexedDB connection failed:",
    (event.target as IDBOpenDBRequest).error,
  );
};

openRequest.onsuccess = (event) => {
  db = (event.target as IDBOpenDBRequest).result;
};

openRequest.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;
  if (!db.objectStoreNames.contains(objectStoreName)) {
    const store = db.createObjectStore(objectStoreName, {
      keyPath: "id",
      autoIncrement: true,
    });
    store.createIndex("name", "name", { unique: false });
  }
};

// 4. CRUD 操作

// Create (添加新记录)
async function addUser(user: User): Promise<number | undefined> {
  if (!db) {
    throw new Error("IndexedDB not initialized");
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readwrite");
    const store = transaction.objectStore(objectStoreName);
    const request = store.add(user);

    request.onsuccess = (event) =>
      resolve((event.target as IDBRequest<number>).result);
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}

// Read (读取记录)
async function getUsers(): Promise<User[]> {
  if (!db) {
    throw new Error("IndexedDB not initialized");
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readonly");
    const store = transaction.objectStore(objectStoreName);
    const request = store.getAll();

    request.onsuccess = (event) =>
      resolve((event.target as IDBRequest<User[]>).result);
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}

// Update (更新记录)
async function updateUser(id: number, updatedUser: User): Promise<void> {
  if (!db) {
    throw new Error("IndexedDB not initialized");
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readwrite");
    const store = transaction.objectStore(objectStoreName);
    const request = store.put(updatedUser, id);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}

// Delete (删除记录)
async function deleteUser(id: number): Promise<void> {
  if (!db) {
    throw new Error("IndexedDB not initialized");
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readwrite");
    const store = transaction.objectStore(objectStoreName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}
