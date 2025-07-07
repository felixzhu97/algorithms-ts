/**
 * LRU 缓存 (Least Recently Used Cache) 实现
 * 支持 O(1) 时间复杂度的 get 和 put 操作
 */

/**
 * 双向链表节点
 */
class LRUNode<K, V> {
  constructor(
    public key: K,
    public value: V,
    public prev: LRUNode<K, V> | null = null,
    public next: LRUNode<K, V> | null = null
  ) {}
}

/**
 * LRU 缓存类
 * 使用哈希表 + 双向链表实现
 */
export class LRUCache<K = any, V = any> {
  private capacity: number;
  private size: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V>; // 虚拟头节点
  private tail: LRUNode<K, V>; // 虚拟尾节点

  /**
   * 构造函数
   * @param capacity 缓存容量
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error("Capacity must be positive");
    }

    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map();

    // 创建虚拟头尾节点，简化边界处理
    this.head = new LRUNode<K, V>(null as any, null as any);
    this.tail = new LRUNode<K, V>(null as any, null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 获取缓存值
   * 时间复杂度: O(1)
   * @param key 键
   * @returns 值，如果不存在返回 undefined
   */
  public get(key: K): V | undefined {
    const node = this.cache.get(key);

    if (!node) {
      return undefined;
    }

    // 将访问的节点移到链表头部（最近使用）
    this.moveToHead(node);
    return node.value;
  }

  /**
   * 设置缓存值
   * 时间复杂度: O(1)
   * @param key 键
   * @param value 值
   */
  public put(key: K, value: V): void {
    const existingNode = this.cache.get(key);

    if (existingNode) {
      // 更新现有键的值
      existingNode.value = value;
      this.moveToHead(existingNode);
      return;
    }

    // 创建新节点
    const newNode = new LRUNode(key, value);

    if (this.size >= this.capacity) {
      // 缓存已满，删除最少使用的元素（尾部）
      const lru = this.removeTail();
      if (lru) {
        this.cache.delete(lru.key);
        this.size--;
      }
    }

    // 添加新节点到头部
    this.addToHead(newNode);
    this.cache.set(key, newNode);
    this.size++;
  }

  /**
   * 删除缓存项
   * 时间复杂度: O(1)
   * @param key 键
   * @returns 是否成功删除
   */
  public delete(key: K): boolean {
    const node = this.cache.get(key);

    if (!node) {
      return false;
    }

    this.removeNode(node);
    this.cache.delete(key);
    this.size--;
    return true;
  }

  /**
   * 检查键是否存在
   * @param key 键
   * @returns 是否存在
   */
  public has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * 清空缓存
   */
  public clear(): void {
    this.cache.clear();
    this.size = 0;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 获取缓存大小
   * @returns 当前缓存大小
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * 获取缓存容量
   * @returns 缓存容量
   */
  public getCapacity(): number {
    return this.capacity;
  }

  /**
   * 检查缓存是否为空
   * @returns 是否为空
   */
  public isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 检查缓存是否已满
   * @returns 是否已满
   */
  public isFull(): boolean {
    return this.size >= this.capacity;
  }

  /**
   * 获取所有键（按访问顺序，最近访问的在前）
   * @returns 键的数组
   */
  public keys(): K[] {
    const result: K[] = [];
    let current = this.head.next;

    while (current && current !== this.tail) {
      result.push(current.key);
      current = current.next;
    }

    return result;
  }

  /**
   * 获取所有值（按访问顺序，最近访问的在前）
   * @returns 值的数组
   */
  public values(): V[] {
    const result: V[] = [];
    let current = this.head.next;

    while (current && current !== this.tail) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * 获取所有键值对（按访问顺序，最近访问的在前）
   * @returns 键值对的数组
   */
  public entries(): Array<[K, V]> {
    const result: Array<[K, V]> = [];
    let current = this.head.next;

    while (current && current !== this.tail) {
      result.push([current.key, current.value]);
      current = current.next;
    }

    return result;
  }

  /**
   * 获取最近访问的键
   * @returns 最近访问的键，如果缓存为空返回 undefined
   */
  public getMostRecent(): K | undefined {
    return this.head.next && this.head.next !== this.tail
      ? this.head.next.key
      : undefined;
  }

  /**
   * 获取最久未访问的键
   * @returns 最久未访问的键，如果缓存为空返回 undefined
   */
  public getLeastRecent(): K | undefined {
    return this.tail.prev && this.tail.prev !== this.head
      ? this.tail.prev.key
      : undefined;
  }

  /**
   * 将节点添加到链表头部
   * @param node 要添加的节点
   */
  private addToHead(node: LRUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;

    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }

  /**
   * 移除指定节点
   * @param node 要移除的节点
   */
  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  /**
   * 将节点移动到链表头部
   * @param node 要移动的节点
   */
  private moveToHead(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  /**
   * 移除尾部节点
   * @returns 被移除的节点
   */
  private removeTail(): LRUNode<K, V> | null {
    const lastNode = this.tail.prev;

    if (!lastNode || lastNode === this.head) {
      return null;
    }

    this.removeNode(lastNode);
    return lastNode;
  }

  /**
   * 调整缓存容量
   * @param newCapacity 新容量
   */
  public resize(newCapacity: number): void {
    if (newCapacity <= 0) {
      throw new Error("Capacity must be positive");
    }

    this.capacity = newCapacity;

    // 如果新容量小于当前大小，移除最久未使用的元素
    while (this.size > this.capacity) {
      const lru = this.removeTail();
      if (lru) {
        this.cache.delete(lru.key);
        this.size--;
      }
    }
  }

  /**
   * 获取缓存的命中率统计（需要启用统计）
   */
  public getStats(): { hits: number; misses: number; hitRate: number } {
    // 这是一个简单的实现示例，实际使用时可能需要更复杂的统计机制
    return {
      hits: 0,
      misses: 0,
      hitRate: 0,
    };
  }

  /**
   * 转换为字符串表示（用于调试）
   * @returns 字符串表示
   */
  public toString(): string {
    const entries = this.entries();
    return `LRUCache(${this.size}/${this.capacity}): [${entries
      .map(([k, v]) => `${k}:${v}`)
      .join(", ")}]`;
  }

  /**
   * 实现迭代器接口
   */
  public *[Symbol.iterator](): Iterator<[K, V]> {
    let current = this.head.next;

    while (current && current !== this.tail) {
      yield [current.key, current.value];
      current = current.next;
    }
  }
}

/**
 * 带统计功能的 LRU 缓存
 */
export class LRUCacheWithStats<K = any, V = any> extends LRUCache<K, V> {
  private hits: number = 0;
  private misses: number = 0;

  /**
   * 重写 get 方法以记录统计
   */
  public get(key: K): V | undefined {
    const result = super.get(key);

    if (result !== undefined) {
      this.hits++;
    } else {
      this.misses++;
    }

    return result;
  }

  /**
   * 获取命中率统计
   */
  public getStats(): { hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  /**
   * 重置统计
   */
  public resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * LRU 缓存工具类
 * 提供演示、测试和性能评估功能
 */
export class LRUCacheUtils {
  /**
   * 演示基本操作
   */
  static demonstrateBasicOperations(): void {
    console.log("=== LRU 缓存基本操作演示 ===");

    const cache = new LRUCache<string, number>(3);

    console.log("缓存容量:", cache.getCapacity());
    console.log("当前大小:", cache.getSize());
    console.log("是否为空:", cache.isEmpty());

    // 添加元素
    console.log("\n添加元素:");
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    console.log("当前缓存:", cache.toString());
    console.log("键列表:", cache.keys());

    // 访问元素
    console.log("\n访问元素:");
    console.log("get('a'):", cache.get("a"));
    console.log("访问后缓存:", cache.toString());

    // 添加导致淘汰
    console.log("\n添加新元素 (容量已满):");
    cache.put("d", 4);
    console.log("添加 d:4 后:", cache.toString());
    console.log("最近访问:", cache.getMostRecent());
    console.log("最久未访问:", cache.getLeastRecent());

    // 更新现有元素
    console.log("\n更新现有元素:");
    cache.put("a", 10);
    console.log("更新 a:10 后:", cache.toString());
  }

  /**
   * 演示高级功能
   */
  static demonstrateAdvancedFeatures(): void {
    console.log("\n=== LRU 缓存高级功能演示 ===");

    const cache = new LRUCacheWithStats<string, string>(4);

    // 添加一些数据
    cache.put("user1", "Alice");
    cache.put("user2", "Bob");
    cache.put("user3", "Charlie");
    cache.put("user4", "David");

    console.log("初始缓存:", cache.toString());

    // 模拟访问模式
    console.log("\n模拟访问模式:");
    cache.get("user1"); // 命中
    cache.get("user2"); // 命中
    cache.get("user5"); // 未命中
    cache.get("user1"); // 命中
    cache.get("user6"); // 未命中

    const stats = cache.getStats();
    console.log("访问统计:", stats);
    console.log(`命中率: ${(stats.hitRate * 100).toFixed(2)}%`);

    // 删除操作
    console.log("\n删除操作:");
    console.log("删除 user2:", cache.delete("user2"));
    console.log("删除后缓存:", cache.toString());

    // 迭代器
    console.log("\n使用迭代器:");
    for (const [key, value] of cache) {
      console.log(`${key}: ${value}`);
    }

    // 调整容量
    console.log("\n调整容量:");
    console.log("调整前:", cache.toString());
    cache.resize(2);
    console.log("调整为2后:", cache.toString());
  }

  /**
   * 演示不同数据类型
   */
  static demonstrateDifferentTypes(): void {
    console.log("\n=== 不同数据类型演示 ===");

    // 数字键，对象值
    const objCache = new LRUCache<number, { name: string; age: number }>(3);
    objCache.put(1, { name: "Alice", age: 25 });
    objCache.put(2, { name: "Bob", age: 30 });
    objCache.put(3, { name: "Charlie", age: 35 });

    console.log("对象缓存:");
    objCache.entries().forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value)}`);
    });

    // 字符串键，函数值
    const funcCache = new LRUCache<string, Function>(2);
    funcCache.put("add", (a: number, b: number) => a + b);
    funcCache.put("multiply", (a: number, b: number) => a * b);

    console.log("\n函数缓存:");
    const addFunc = funcCache.get("add");
    if (addFunc) {
      console.log("add(2, 3) =", addFunc(2, 3));
    }
  }

  /**
   * 性能测试
   * @param capacity 缓存容量
   * @param operations 操作次数
   */
  static performanceTest(
    capacity: number = 1000,
    operations: number = 100000
  ): void {
    console.log(
      `\n=== LRU 缓存性能测试 (容量=${capacity}, 操作=${operations}) ===`
    );

    const cache = new LRUCache<number, string>(capacity);

    // 预填充缓存
    console.time("预填充缓存");
    for (let i = 0; i < capacity; i++) {
      cache.put(i, `value${i}`);
    }
    console.timeEnd("预填充缓存");

    // Put 操作性能测试
    console.time(`${operations} 次 put 操作`);
    for (let i = 0; i < operations; i++) {
      const key = Math.floor(Math.random() * (capacity * 2));
      cache.put(key, `value${key}`);
    }
    console.timeEnd(`${operations} 次 put 操作`);

    // Get 操作性能测试
    console.time(`${operations} 次 get 操作`);
    for (let i = 0; i < operations; i++) {
      const key = Math.floor(Math.random() * (capacity * 2));
      cache.get(key);
    }
    console.timeEnd(`${operations} 次 get 操作`);

    // 混合操作性能测试
    console.time(`${operations} 次混合操作`);
    for (let i = 0; i < operations; i++) {
      const key = Math.floor(Math.random() * (capacity * 2));
      if (Math.random() < 0.7) {
        cache.get(key); // 70% get
      } else {
        cache.put(key, `value${key}`); // 30% put
      }
    }
    console.timeEnd(`${operations} 次混合操作`);

    console.log("最终缓存大小:", cache.getSize());
  }

  /**
   * 正确性验证
   */
  static verifyCorrectness(): void {
    console.log("\n=== LRU 缓存正确性验证 ===");

    let testsPassed = 0;
    let totalTests = 0;

    const cache = new LRUCache<string, number>(3);

    // 测试基本 put/get
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);

    totalTests++;
    if (cache.get("a") === 1) testsPassed++;
    else console.log("基本 get 测试失败");

    totalTests++;
    if (cache.getSize() === 3) testsPassed++;
    else console.log("大小测试失败");

    // 测试 LRU 淘汰
    cache.put("d", 4); // 应该淘汰 b

    totalTests++;
    if (cache.get("b") === undefined) testsPassed++;
    else console.log("LRU 淘汰测试失败");

    totalTests++;
    if (cache.has("a") && cache.has("c") && cache.has("d")) testsPassed++;
    else console.log("淘汰后存在性测试失败");

    // 测试访问顺序更新
    cache.get("a"); // a 变为最近访问
    cache.put("e", 5); // 应该淘汰 c

    totalTests++;
    if (cache.get("c") === undefined) testsPassed++;
    else console.log("访问顺序更新测试失败");

    // 测试更新现有键
    cache.put("a", 10);

    totalTests++;
    if (cache.get("a") === 10 && cache.getSize() === 3) testsPassed++;
    else console.log("更新现有键测试失败");

    // 测试删除
    const deleted = cache.delete("d");

    totalTests++;
    if (deleted && !cache.has("d") && cache.getSize() === 2) testsPassed++;
    else console.log("删除测试失败");

    // 测试清空
    cache.clear();

    totalTests++;
    if (cache.isEmpty() && cache.getSize() === 0) testsPassed++;
    else console.log("清空测试失败");

    console.log(
      `正确性验证完成: ${testsPassed}/${totalTests} 通过 (${(
        (testsPassed / totalTests) *
        100
      ).toFixed(2)}%)`
    );
  }

  /**
   * 内存使用分析
   */
  static memoryAnalysis(): void {
    console.log("\n=== LRU 缓存内存使用分析 ===");

    const sizes = [100, 1000, 10000];

    sizes.forEach((size) => {
      const cache = new LRUCache<number, string>(size);

      // 填充缓存
      for (let i = 0; i < size; i++) {
        cache.put(i, `value_${i}_${"x".repeat(50)}`); // 模拟较大的值
      }

      console.log(`容量 ${size}:`);
      console.log(`  实际存储: ${cache.getSize()} 项`);
      console.log(`  哈希表键数: ${cache.keys().length}`);

      // 测试内存效率（简单估算）
      const estimatedMemory = size * (8 + 8 + 64); // 假设每项约80字节
      console.log(`  估算内存: ~${(estimatedMemory / 1024).toFixed(1)} KB`);
    });
  }
}
