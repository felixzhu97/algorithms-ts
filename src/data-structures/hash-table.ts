/**
 * 哈希表实现
 * 《算法导论》第11章 散列表
 *
 * 实现了两种主要的冲突解决方法：
 * 1. 链地址法 (Chaining)
 * 2. 开放地址法 (Open Addressing)
 */

/**
 * 哈希函数接口
 */
export interface HashFunction<K> {
  (key: K, tableSize: number): number;
}

/**
 * 键值对接口
 */
export interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

/**
 * 默认的字符串哈希函数（使用djb2算法）
 */
export const defaultStringHash: HashFunction<string> = (
  key: string,
  tableSize: number
): number => {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) + hash + key.charCodeAt(i);
  }
  return Math.abs(hash) % tableSize;
};

/**
 * 默认的数字哈希函数（除法散列法）
 */
export const defaultNumberHash: HashFunction<number> = (
  key: number,
  tableSize: number
): number => {
  return Math.abs(key) % tableSize;
};

/**
 * 通用对象哈希函数
 */
export const defaultObjectHash: HashFunction<any> = (
  key: any,
  tableSize: number
): number => {
  const str = typeof key === "string" ? key : JSON.stringify(key);
  return defaultStringHash(str, tableSize);
};

/**
 * 链地址法哈希表
 * 时间复杂度：
 * - 平均情况：O(1) 搜索、插入、删除
 * - 最坏情况：O(n) 搜索、插入、删除
 */
export class ChainingHashTable<K, V> {
  private table: Array<Array<KeyValuePair<K, V>>>;
  private size: number;
  private capacity: number;
  private hashFunction: HashFunction<K>;
  private loadFactorThreshold: number;

  constructor(
    initialCapacity: number = 16,
    hashFunction: HashFunction<K> = defaultObjectHash,
    loadFactorThreshold: number = 0.75
  ) {
    this.capacity = initialCapacity;
    this.table = new Array(this.capacity);
    this.size = 0;
    this.hashFunction = hashFunction;
    this.loadFactorThreshold = loadFactorThreshold;

    // 初始化每个桶为空数组
    for (let i = 0; i < this.capacity; i++) {
      this.table[i] = [];
    }
  }

  /**
   * 计算哈希值
   */
  private hash(key: K): number {
    return this.hashFunction(key, this.capacity);
  }

  /**
   * 获取负载因子
   */
  getLoadFactor(): number {
    return this.size / this.capacity;
  }

  /**
   * 插入键值对
   * 时间复杂度：平均 O(1)，最坏 O(n)
   */
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.table[index];

    // 检查是否已存在相同的键
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket[i].value = value; // 更新值
        return;
      }
    }

    // 插入新的键值对
    bucket.push({ key, value });
    this.size++;

    // 检查是否需要扩容
    if (this.getLoadFactor() > this.loadFactorThreshold) {
      this.resize();
    }
  }

  /**
   * 获取值
   * 时间复杂度：平均 O(1)，最坏 O(n)
   */
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.table[index];

    for (const pair of bucket) {
      if (pair.key === key) {
        return pair.value;
      }
    }

    return undefined;
  }

  /**
   * 检查是否包含键
   */
  has(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.table[index];

    for (const pair of bucket) {
      if (pair.key === key) {
        return true;
      }
    }

    return false;
  }

  /**
   * 删除键值对
   * 时间复杂度：平均 O(1)，最坏 O(n)
   */
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.table[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }

    return false;
  }

  /**
   * 获取所有键
   */
  keys(): K[] {
    const keys: K[] = [];
    for (const bucket of this.table) {
      for (const pair of bucket) {
        keys.push(pair.key);
      }
    }
    return keys;
  }

  /**
   * 获取所有值
   */
  values(): V[] {
    const values: V[] = [];
    for (const bucket of this.table) {
      for (const pair of bucket) {
        values.push(pair.value);
      }
    }
    return values;
  }

  /**
   * 获取所有条目
   */
  entries(): Array<[K, V]> {
    const entries: Array<[K, V]> = [];
    for (const bucket of this.table) {
      for (const pair of bucket) {
        entries.push([pair.key, pair.value]);
      }
    }
    return entries;
  }

  /**
   * 清空哈希表
   */
  clear(): void {
    for (let i = 0; i < this.capacity; i++) {
      this.table[i] = [];
    }
    this.size = 0;
  }

  /**
   * 获取元素数量
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 获取容量
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * 检查是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 扩容
   */
  private resize(): void {
    const oldTable = this.table;
    const oldCapacity = this.capacity;

    this.capacity *= 2;
    this.table = new Array(this.capacity);
    this.size = 0;

    // 初始化新表
    for (let i = 0; i < this.capacity; i++) {
      this.table[i] = [];
    }

    // 重新插入所有元素
    for (let i = 0; i < oldCapacity; i++) {
      for (const pair of oldTable[i]) {
        this.set(pair.key, pair.value);
      }
    }
  }

  /**
   * 获取哈希表统计信息
   */
  getStats(): {
    size: number;
    capacity: number;
    loadFactor: number;
    bucketDistribution: number[];
    maxBucketSize: number;
    averageBucketSize: number;
  } {
    const bucketDistribution = this.table.map((bucket) => bucket.length);
    const maxBucketSize = Math.max(...bucketDistribution);
    const averageBucketSize = this.size / this.capacity;

    return {
      size: this.size,
      capacity: this.capacity,
      loadFactor: this.getLoadFactor(),
      bucketDistribution,
      maxBucketSize,
      averageBucketSize,
    };
  }

  /**
   * 转换为字符串表示
   */
  toString(): string {
    if (this.isEmpty()) {
      return "ChainingHashTable(empty)";
    }

    const entries = this.entries();
    const entryStrings = entries.map(([key, value]) => `${key}: ${value}`);
    return `ChainingHashTable(${entryStrings.join(", ")})`;
  }
}

/**
 * 开放地址法探测策略枚举
 */
export enum ProbingStrategy {
  LINEAR = "linear", // 线性探测
  QUADRATIC = "quadratic", // 二次探测
  DOUBLE_HASH = "double_hash", // 双重哈希
}

/**
 * 开放地址法哈希表
 */
export class OpenAddressingHashTable<K, V> {
  private table: Array<KeyValuePair<K, V> | "DELETED" | null>;
  private size: number;
  private capacity: number;
  private hashFunction: HashFunction<K>;
  private secondaryHashFunction: HashFunction<K>;
  private probingStrategy: ProbingStrategy;
  private loadFactorThreshold: number;

  constructor(
    initialCapacity: number = 16,
    probingStrategy: ProbingStrategy = ProbingStrategy.LINEAR,
    hashFunction: HashFunction<K> = defaultObjectHash,
    loadFactorThreshold: number = 0.5
  ) {
    this.capacity = this.getNextPrime(initialCapacity);
    this.table = new Array(this.capacity).fill(null);
    this.size = 0;
    this.probingStrategy = probingStrategy;
    this.hashFunction = hashFunction;
    this.loadFactorThreshold = loadFactorThreshold;

    // 双重哈希的第二个哈希函数
    this.secondaryHashFunction = (key: K, tableSize: number): number => {
      const hash = this.hashFunction(key, tableSize);
      return 7 - (hash % 7); // 使用较小质数
    };
  }

  /**
   * 获取下一个质数
   */
  private getNextPrime(n: number): number {
    const isPrime = (num: number): boolean => {
      if (num < 2) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
      return true;
    };

    while (!isPrime(n)) {
      n++;
    }
    return n;
  }

  /**
   * 计算探测序列
   */
  private probe(key: K, attempt: number): number {
    const hash1 = this.hashFunction(key, this.capacity);

    switch (this.probingStrategy) {
      case ProbingStrategy.LINEAR:
        return (hash1 + attempt) % this.capacity;

      case ProbingStrategy.QUADRATIC:
        return (hash1 + attempt * attempt) % this.capacity;

      case ProbingStrategy.DOUBLE_HASH:
        const hash2 = this.secondaryHashFunction(key, this.capacity);
        return (hash1 + attempt * hash2) % this.capacity;

      default:
        return (hash1 + attempt) % this.capacity;
    }
  }

  /**
   * 获取负载因子
   */
  getLoadFactor(): number {
    return this.size / this.capacity;
  }

  /**
   * 插入键值对
   */
  set(key: K, value: V): void {
    // 检查是否需要扩容
    if (this.getLoadFactor() >= this.loadFactorThreshold) {
      this.resize();
    }

    let attempt = 0;
    let index = this.probe(key, attempt);

    while (attempt < this.capacity) {
      const current = this.table[index];

      if (current === null || current === "DELETED") {
        // 找到空位置，插入新元素
        this.table[index] = { key, value };
        this.size++;
        return;
      } else if (current.key === key) {
        // 键已存在，更新值
        current.value = value;
        return;
      }

      attempt++;
      index = this.probe(key, attempt);
    }

    throw new Error("哈希表已满，无法插入");
  }

  /**
   * 获取值
   */
  get(key: K): V | undefined {
    let attempt = 0;
    let index = this.probe(key, attempt);

    while (attempt < this.capacity) {
      const current = this.table[index];

      if (current === null) {
        // 遇到空位置，键不存在
        return undefined;
      } else if (current !== "DELETED" && current.key === key) {
        // 找到键
        return current.value;
      }

      attempt++;
      index = this.probe(key, attempt);
    }

    return undefined;
  }

  /**
   * 检查是否包含键
   */
  has(key: K): boolean {
    let attempt = 0;
    let index = this.probe(key, attempt);

    while (attempt < this.capacity) {
      const current = this.table[index];

      if (current === null) {
        // 遇到空位置，键不存在
        return false;
      } else if (current !== "DELETED" && current.key === key) {
        // 找到键
        return true;
      }

      attempt++;
      index = this.probe(key, attempt);
    }

    return false;
  }

  /**
   * 删除键值对
   */
  delete(key: K): boolean {
    let attempt = 0;
    let index = this.probe(key, attempt);

    while (attempt < this.capacity) {
      const current = this.table[index];

      if (current === null) {
        // 遇到空位置，键不存在
        return false;
      } else if (current !== "DELETED" && current.key === key) {
        // 找到键，标记为删除
        this.table[index] = "DELETED";
        this.size--;
        return true;
      }

      attempt++;
      index = this.probe(key, attempt);
    }

    return false;
  }

  /**
   * 获取所有键
   */
  keys(): K[] {
    const keys: K[] = [];
    for (const item of this.table) {
      if (item !== null && item !== "DELETED") {
        keys.push(item.key);
      }
    }
    return keys;
  }

  /**
   * 获取所有值
   */
  values(): V[] {
    const values: V[] = [];
    for (const item of this.table) {
      if (item !== null && item !== "DELETED") {
        values.push(item.value);
      }
    }
    return values;
  }

  /**
   * 获取所有条目
   */
  entries(): Array<[K, V]> {
    const entries: Array<[K, V]> = [];
    for (const item of this.table) {
      if (item !== null && item !== "DELETED") {
        entries.push([item.key, item.value]);
      }
    }
    return entries;
  }

  /**
   * 清空哈希表
   */
  clear(): void {
    this.table = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  /**
   * 获取元素数量
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 获取容量
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * 检查是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 扩容
   */
  private resize(): void {
    const oldTable = this.table;
    const oldCapacity = this.capacity;

    this.capacity = this.getNextPrime(this.capacity * 2);
    this.table = new Array(this.capacity).fill(null);
    this.size = 0;

    // 重新插入所有元素
    for (const item of oldTable) {
      if (item !== null && item !== "DELETED") {
        this.set(item.key, item.value);
      }
    }
  }

  /**
   * 获取哈希表统计信息
   */
  getStats(): {
    size: number;
    capacity: number;
    loadFactor: number;
    probingStrategy: string;
    deletedSlots: number;
    clusteringInfo: { maxClusterSize: number; totalClusters: number };
  } {
    let deletedSlots = 0;
    let inCluster = false;
    let currentClusterSize = 0;
    let maxClusterSize = 0;
    let totalClusters = 0;

    for (const item of this.table) {
      if (item === "DELETED") {
        deletedSlots++;
      }

      if (item !== null) {
        if (!inCluster) {
          inCluster = true;
          currentClusterSize = 1;
        } else {
          currentClusterSize++;
        }
      } else {
        if (inCluster) {
          maxClusterSize = Math.max(maxClusterSize, currentClusterSize);
          totalClusters++;
          inCluster = false;
          currentClusterSize = 0;
        }
      }
    }

    // 处理表末尾的簇
    if (inCluster) {
      maxClusterSize = Math.max(maxClusterSize, currentClusterSize);
      totalClusters++;
    }

    return {
      size: this.size,
      capacity: this.capacity,
      loadFactor: this.getLoadFactor(),
      probingStrategy: this.probingStrategy,
      deletedSlots,
      clusteringInfo: { maxClusterSize, totalClusters },
    };
  }

  /**
   * 转换为字符串表示
   */
  toString(): string {
    if (this.isEmpty()) {
      return `OpenAddressingHashTable(${this.probingStrategy}, empty)`;
    }

    const entries = this.entries();
    const entryStrings = entries.map(([key, value]) => `${key}: ${value}`);
    return `OpenAddressingHashTable(${
      this.probingStrategy
    }, ${entryStrings.join(", ")})`;
  }
}

/**
 * 完美哈希表（理论实现，用于演示）
 * 这是一个简化的完美哈希表实现
 */
export class PerfectHashTable<K extends string | number, V> {
  private primaryTable: Array<ChainingHashTable<K, V> | null>;
  private primaryCapacity: number;
  private size: number;
  private keys: K[];

  constructor(staticKeys: K[]) {
    this.keys = [...staticKeys];
    this.size = staticKeys.length;
    this.primaryCapacity = this.size;
    this.primaryTable = new Array(this.primaryCapacity);
    this.buildPerfectHashTable();
  }

  /**
   * 构建完美哈希表
   */
  private buildPerfectHashTable(): void {
    // 第一级：按主哈希函数分组
    const groups: Array<K[]> = new Array(this.primaryCapacity);
    for (let i = 0; i < this.primaryCapacity; i++) {
      groups[i] = [];
    }

    for (const key of this.keys) {
      const index = this.primaryHash(key);
      groups[index].push(key);
    }

    // 第二级：为每个非空组创建二级哈希表
    for (let i = 0; i < this.primaryCapacity; i++) {
      if (groups[i].length > 0) {
        const secondarySize = groups[i].length * groups[i].length;
        this.primaryTable[i] = new ChainingHashTable<K, V>(
          Math.max(secondarySize, 1)
        );
      } else {
        this.primaryTable[i] = null;
      }
    }
  }

  /**
   * 主哈希函数
   */
  private primaryHash(key: K): number {
    if (typeof key === "string") {
      return defaultStringHash(key, this.primaryCapacity);
    } else {
      return defaultNumberHash(key as number, this.primaryCapacity);
    }
  }

  /**
   * 设置值（仅对预定义的键有效）
   */
  set(key: K, value: V): boolean {
    if (!this.keys.includes(key)) {
      return false; // 完美哈希表只接受预定义的键
    }

    const primaryIndex = this.primaryHash(key);
    const secondaryTable = this.primaryTable[primaryIndex];

    if (secondaryTable) {
      secondaryTable.set(key, value);
      return true;
    }

    return false;
  }

  /**
   * 获取值
   */
  get(key: K): V | undefined {
    const primaryIndex = this.primaryHash(key);
    const secondaryTable = this.primaryTable[primaryIndex];

    if (secondaryTable) {
      return secondaryTable.get(key);
    }

    return undefined;
  }

  /**
   * 检查是否包含键
   */
  has(key: K): boolean {
    if (!this.keys.includes(key)) {
      return false; // 键不在预定义列表中
    }

    const primaryIndex = this.primaryHash(key);
    const secondaryTable = this.primaryTable[primaryIndex];

    if (secondaryTable) {
      return secondaryTable.has(key);
    }

    return false;
  }

  /**
   * 获取支持的键
   */
  getSupportedKeys(): K[] {
    return [...this.keys];
  }

  /**
   * 转换为字符串表示
   */
  toString(): string {
    const entries = this.keys
      .map((key) => `${key}: ${this.get(key)}`)
      .filter((entry) => !entry.endsWith("undefined"));

    return `PerfectHashTable(${entries.join(", ")})`;
  }
}

// 哈希表工具函数
export class HashTableUtils {
  /**
   * 测试哈希函数的分布质量
   */
  static testHashDistribution<K>(
    keys: K[],
    hashFunction: HashFunction<K>,
    tableSize: number
  ): {
    distribution: number[];
    chiSquare: number;
    uniformityScore: number;
  } {
    const distribution = new Array(tableSize).fill(0);

    for (const key of keys) {
      const index = hashFunction(key, tableSize);
      distribution[index]++;
    }

    // 计算卡方统计量
    const expected = keys.length / tableSize;
    let chiSquare = 0;
    for (const count of distribution) {
      chiSquare += Math.pow(count - expected, 2) / expected;
    }

    // 计算均匀性分数 (0-1, 1为完全均匀)
    const maxDeviation = Math.max(
      ...distribution.map((count) => Math.abs(count - expected))
    );
    const uniformityScore = 1 - maxDeviation / expected;

    return {
      distribution,
      chiSquare,
      uniformityScore: Math.max(0, uniformityScore),
    };
  }

  /**
   * 基准测试哈希表性能
   */
  static benchmarkHashTable<K, V>(
    hashTable: ChainingHashTable<K, V> | OpenAddressingHashTable<K, V>,
    operations: Array<{ type: "set" | "get" | "delete"; key: K; value?: V }>
  ): {
    totalTime: number;
    operationTimes: number[];
    averageTime: number;
  } {
    const operationTimes: number[] = [];
    const startTime = performance.now();

    for (const op of operations) {
      const opStart = performance.now();

      switch (op.type) {
        case "set":
          hashTable.set(op.key, op.value!);
          break;
        case "get":
          hashTable.get(op.key);
          break;
        case "delete":
          hashTable.delete(op.key);
          break;
      }

      const opEnd = performance.now();
      operationTimes.push(opEnd - opStart);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / operations.length;

    return {
      totalTime,
      operationTimes,
      averageTime,
    };
  }
}
