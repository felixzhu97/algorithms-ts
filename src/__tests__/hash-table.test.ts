/**
 * 哈希表测试
 * 《算法导论》第11章 散列表
 */

import {
  ChainingHashTable,
  OpenAddressingHashTable,
  PerfectHashTable,
  ProbingStrategy,
  HashTableUtils,
  defaultStringHash,
  defaultNumberHash,
  defaultObjectHash,
} from "../data-structures/basic/hash-table";

describe("哈希函数测试", () => {
  test("默认字符串哈希函数应该工作正常", () => {
    const tableSize = 16;
    const keys = ["apple", "banana", "cherry", "date"];

    keys.forEach((key) => {
      const hash = defaultStringHash(key, tableSize);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThan(tableSize);
    });

    // 相同的键应该产生相同的哈希值
    expect(defaultStringHash("test", tableSize)).toBe(
      defaultStringHash("test", tableSize)
    );
  });

  test("默认数字哈希函数应该工作正常", () => {
    const tableSize = 16;
    const keys = [1, 2, 100, 1000, -5];

    keys.forEach((key) => {
      const hash = defaultNumberHash(key, tableSize);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThan(tableSize);
    });

    // 负数也应该产生有效的哈希值
    expect(defaultNumberHash(-10, tableSize)).toBeGreaterThanOrEqual(0);
  });

  test("默认对象哈希函数应该工作正常", () => {
    const tableSize = 16;
    const objects = [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
      "string",
      42,
      [1, 2, 3],
    ];

    objects.forEach((obj) => {
      const hash = defaultObjectHash(obj, tableSize);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThan(tableSize);
    });
  });
});

describe("链地址法哈希表 (ChainingHashTable)", () => {
  let hashTable: ChainingHashTable<string, number>;

  beforeEach(() => {
    hashTable = new ChainingHashTable<string, number>();
  });

  describe("基本操作", () => {
    test("应该正确初始化空哈希表", () => {
      expect(hashTable.getSize()).toBe(0);
      expect(hashTable.isEmpty()).toBe(true);
      expect(hashTable.getCapacity()).toBe(16); // 默认容量
    });

    test("应该正确插入和获取单个元素", () => {
      hashTable.set("key1", 100);
      expect(hashTable.get("key1")).toBe(100);
      expect(hashTable.has("key1")).toBe(true);
      expect(hashTable.getSize()).toBe(1);
      expect(hashTable.isEmpty()).toBe(false);
    });

    test("应该正确处理键的更新", () => {
      hashTable.set("key1", 100);
      hashTable.set("key1", 200); // 更新相同的键
      expect(hashTable.get("key1")).toBe(200);
      expect(hashTable.getSize()).toBe(1); // 大小不应该增加
    });

    test("应该正确插入多个元素", () => {
      const pairs = [
        ["apple", 1],
        ["banana", 2],
        ["cherry", 3],
        ["date", 4],
      ] as Array<[string, number]>;

      pairs.forEach(([key, value]) => hashTable.set(key, value));

      expect(hashTable.getSize()).toBe(4);
      pairs.forEach(([key, value]) => {
        expect(hashTable.get(key)).toBe(value);
        expect(hashTable.has(key)).toBe(true);
      });
    });

    test("应该正确删除元素", () => {
      hashTable.set("key1", 100);
      hashTable.set("key2", 200);

      expect(hashTable.delete("key1")).toBe(true);
      expect(hashTable.get("key1")).toBeUndefined();
      expect(hashTable.has("key1")).toBe(false);
      expect(hashTable.getSize()).toBe(1);

      expect(hashTable.delete("nonexistent")).toBe(false);
      expect(hashTable.getSize()).toBe(1);
    });

    test("应该正确清空哈希表", () => {
      hashTable.set("key1", 100);
      hashTable.set("key2", 200);

      hashTable.clear();
      expect(hashTable.getSize()).toBe(0);
      expect(hashTable.isEmpty()).toBe(true);
      expect(hashTable.get("key1")).toBeUndefined();
      expect(hashTable.get("key2")).toBeUndefined();
    });
  });

  describe("集合操作", () => {
    beforeEach(() => {
      hashTable.set("apple", 1);
      hashTable.set("banana", 2);
      hashTable.set("cherry", 3);
    });

    test("应该正确返回所有键", () => {
      const keys = hashTable.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toEqual(
        expect.arrayContaining(["apple", "banana", "cherry"])
      );
    });

    test("应该正确返回所有值", () => {
      const values = hashTable.values();
      expect(values).toHaveLength(3);
      expect(values).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    test("应该正确返回所有条目", () => {
      const entries = hashTable.entries();
      expect(entries).toHaveLength(3);
      expect(entries).toEqual(
        expect.arrayContaining([
          ["apple", 1],
          ["banana", 2],
          ["cherry", 3],
        ])
      );
    });
  });

  describe("扩容和负载因子", () => {
    test("应该在负载因子超过阈值时自动扩容", () => {
      const initialCapacity = hashTable.getCapacity();

      // 插入足够多的元素以触发扩容
      for (let i = 0; i < 20; i++) {
        hashTable.set(`key${i}`, i);
      }

      expect(hashTable.getCapacity()).toBeGreaterThan(initialCapacity);
      expect(hashTable.getLoadFactor()).toBeLessThanOrEqual(0.75);
      expect(hashTable.getSize()).toBe(20);

      // 验证所有元素仍然存在
      for (let i = 0; i < 20; i++) {
        expect(hashTable.get(`key${i}`)).toBe(i);
      }
    });

    test("应该正确计算负载因子", () => {
      expect(hashTable.getLoadFactor()).toBe(0);

      hashTable.set("key1", 1);
      expect(hashTable.getLoadFactor()).toBe(1 / 16);

      hashTable.set("key2", 2);
      expect(hashTable.getLoadFactor()).toBe(2 / 16);
    });
  });

  describe("统计信息", () => {
    test("应该提供正确的统计信息", () => {
      for (let i = 0; i < 10; i++) {
        hashTable.set(`key${i}`, i);
      }

      const stats = hashTable.getStats();
      expect(stats.size).toBe(10);
      expect(stats.capacity).toBe(hashTable.getCapacity());
      expect(stats.loadFactor).toBe(hashTable.getLoadFactor());
      expect(stats.bucketDistribution).toHaveLength(stats.capacity);
      expect(stats.maxBucketSize).toBeGreaterThanOrEqual(0);
      expect(stats.averageBucketSize).toBeCloseTo(10 / stats.capacity);
    });
  });

  describe("字符串表示", () => {
    test("空哈希表的字符串表示", () => {
      expect(hashTable.toString()).toBe("ChainingHashTable(empty)");
    });

    test("非空哈希表的字符串表示", () => {
      hashTable.set("key1", 100);
      const str = hashTable.toString();
      expect(str).toContain("ChainingHashTable");
      expect(str).toContain("key1: 100");
    });
  });

  describe("自定义哈希函数", () => {
    test("应该支持自定义哈希函数", () => {
      // 创建一个总是返回0的哈希函数（用于测试冲突处理）
      const constantHash = (key: string, tableSize: number) => 0;
      const constantHashTable = new ChainingHashTable<string, number>(
        16,
        constantHash
      );

      constantHashTable.set("key1", 1);
      constantHashTable.set("key2", 2);
      constantHashTable.set("key3", 3);

      expect(constantHashTable.get("key1")).toBe(1);
      expect(constantHashTable.get("key2")).toBe(2);
      expect(constantHashTable.get("key3")).toBe(3);
      expect(constantHashTable.getSize()).toBe(3);

      // 所有元素都应该在同一个桶中
      const stats = constantHashTable.getStats();
      expect(stats.maxBucketSize).toBe(3);
    });
  });
});

describe("开放地址法哈希表 (OpenAddressingHashTable)", () => {
  let hashTable: OpenAddressingHashTable<string, number>;

  beforeEach(() => {
    hashTable = new OpenAddressingHashTable<string, number>();
  });

  describe("基本操作", () => {
    test("应该正确初始化空哈希表", () => {
      expect(hashTable.getSize()).toBe(0);
      expect(hashTable.isEmpty()).toBe(true);
      expect(hashTable.getCapacity()).toBeGreaterThanOrEqual(16);
    });

    test("应该正确插入和获取单个元素", () => {
      hashTable.set("key1", 100);
      expect(hashTable.get("key1")).toBe(100);
      expect(hashTable.has("key1")).toBe(true);
      expect(hashTable.getSize()).toBe(1);
    });

    test("应该正确处理键的更新", () => {
      hashTable.set("key1", 100);
      hashTable.set("key1", 200);
      expect(hashTable.get("key1")).toBe(200);
      expect(hashTable.getSize()).toBe(1);
    });

    test("应该正确删除元素", () => {
      hashTable.set("key1", 100);
      hashTable.set("key2", 200);

      expect(hashTable.delete("key1")).toBe(true);
      expect(hashTable.get("key1")).toBeUndefined();
      expect(hashTable.has("key1")).toBe(false);
      expect(hashTable.getSize()).toBe(1);

      expect(hashTable.delete("nonexistent")).toBe(false);
    });

    test("应该正确清空哈希表", () => {
      hashTable.set("key1", 100);
      hashTable.set("key2", 200);

      hashTable.clear();
      expect(hashTable.getSize()).toBe(0);
      expect(hashTable.isEmpty()).toBe(true);
    });
  });

  describe("探测策略", () => {
    test("线性探测应该正确处理冲突", () => {
      const linearHT = new OpenAddressingHashTable<string, number>(
        17,
        ProbingStrategy.LINEAR
      );

      linearHT.set("key1", 1);
      linearHT.set("key2", 2);
      linearHT.set("key3", 3);

      expect(linearHT.get("key1")).toBe(1);
      expect(linearHT.get("key2")).toBe(2);
      expect(linearHT.get("key3")).toBe(3);
    });

    test("二次探测应该正确处理冲突", () => {
      const quadraticHT = new OpenAddressingHashTable<string, number>(
        17,
        ProbingStrategy.QUADRATIC
      );

      quadraticHT.set("key1", 1);
      quadraticHT.set("key2", 2);
      quadraticHT.set("key3", 3);

      expect(quadraticHT.get("key1")).toBe(1);
      expect(quadraticHT.get("key2")).toBe(2);
      expect(quadraticHT.get("key3")).toBe(3);
    });

    test("双重哈希应该正确处理冲突", () => {
      const doubleHashHT = new OpenAddressingHashTable<string, number>(
        17,
        ProbingStrategy.DOUBLE_HASH
      );

      doubleHashHT.set("key1", 1);
      doubleHashHT.set("key2", 2);
      doubleHashHT.set("key3", 3);

      expect(doubleHashHT.get("key1")).toBe(1);
      expect(doubleHashHT.get("key2")).toBe(2);
      expect(doubleHashHT.get("key3")).toBe(3);
    });
  });

  describe("扩容", () => {
    test("应该在负载因子超过阈值时自动扩容", () => {
      const initialCapacity = hashTable.getCapacity();

      // 插入足够多的元素以触发扩容
      for (let i = 0; i < initialCapacity; i++) {
        hashTable.set(`key${i}`, i);
      }

      expect(hashTable.getCapacity()).toBeGreaterThan(initialCapacity);
      expect(hashTable.getLoadFactor()).toBeLessThanOrEqual(0.5);

      // 验证所有元素仍然存在
      for (let i = 0; i < initialCapacity; i++) {
        expect(hashTable.get(`key${i}`)).toBe(i);
      }
    });
  });

  describe("删除和懒惰删除", () => {
    test("应该正确处理删除后的搜索", () => {
      hashTable.set("key1", 1);
      hashTable.set("key2", 2);
      hashTable.set("key3", 3);

      hashTable.delete("key2");

      expect(hashTable.get("key1")).toBe(1);
      expect(hashTable.get("key2")).toBeUndefined();
      expect(hashTable.get("key3")).toBe(3);

      // 重新插入到被删除的位置
      hashTable.set("key4", 4);
      expect(hashTable.get("key4")).toBe(4);
    });
  });

  describe("统计信息", () => {
    test("应该提供正确的统计信息", () => {
      for (let i = 0; i < 5; i++) {
        hashTable.set(`key${i}`, i);
      }

      const stats = hashTable.getStats();
      expect(stats.size).toBe(5);
      expect(stats.capacity).toBe(hashTable.getCapacity());
      expect(stats.loadFactor).toBe(hashTable.getLoadFactor());
      expect(stats.probingStrategy).toBe(ProbingStrategy.LINEAR);
      expect(stats.deletedSlots).toBe(0);
      expect(stats.clusteringInfo).toBeDefined();
    });

    test("应该正确统计删除的槽", () => {
      hashTable.set("key1", 1);
      hashTable.set("key2", 2);
      hashTable.delete("key1");

      const stats = hashTable.getStats();
      expect(stats.deletedSlots).toBe(1);
    });
  });

  describe("字符串表示", () => {
    test("空哈希表的字符串表示", () => {
      const str = hashTable.toString();
      expect(str).toContain("OpenAddressingHashTable");
      expect(str).toContain("empty");
    });

    test("非空哈希表的字符串表示", () => {
      hashTable.set("key1", 100);
      const str = hashTable.toString();
      expect(str).toContain("OpenAddressingHashTable");
      expect(str).toContain("key1: 100");
    });
  });
});

describe("完美哈希表 (PerfectHashTable)", () => {
  let perfectHashTable: PerfectHashTable<string, number>;
  const staticKeys = ["apple", "banana", "cherry", "date"];

  beforeEach(() => {
    perfectHashTable = new PerfectHashTable<string, number>(staticKeys);
  });

  test("应该正确处理预定义的键", () => {
    expect(perfectHashTable.set("apple", 1)).toBe(true);
    expect(perfectHashTable.set("banana", 2)).toBe(true);

    expect(perfectHashTable.get("apple")).toBe(1);
    expect(perfectHashTable.get("banana")).toBe(2);
    expect(perfectHashTable.has("apple")).toBe(true);
  });

  test("应该拒绝未预定义的键", () => {
    expect(perfectHashTable.set("grape", 5)).toBe(false);
    expect(perfectHashTable.get("grape")).toBeUndefined();
    expect(perfectHashTable.has("grape")).toBe(false);
  });

  test("应该返回支持的键列表", () => {
    const supportedKeys = perfectHashTable.getSupportedKeys();
    expect(supportedKeys).toEqual(staticKeys);
  });

  test("应该有正确的字符串表示", () => {
    perfectHashTable.set("apple", 1);
    perfectHashTable.set("banana", 2);

    const str = perfectHashTable.toString();
    expect(str).toContain("PerfectHashTable");
    expect(str).toContain("apple: 1");
    expect(str).toContain("banana: 2");
  });
});

describe("哈希表工具函数 (HashTableUtils)", () => {
  describe("哈希分布测试", () => {
    test("应该正确测试哈希函数的分布质量", () => {
      const keys = Array.from({ length: 1000 }, (_, i) => `key${i}`);
      const tableSize = 100;

      const result = HashTableUtils.testHashDistribution(
        keys,
        defaultStringHash,
        tableSize
      );

      expect(result.distribution).toHaveLength(tableSize);
      expect(result.chiSquare).toBeGreaterThanOrEqual(0);
      expect(result.uniformityScore).toBeGreaterThanOrEqual(0);
      expect(result.uniformityScore).toBeLessThanOrEqual(1);

      // 对于好的哈希函数，均匀性分数应该相对较高
      expect(result.uniformityScore).toBeGreaterThan(0.5);
    });
  });

  describe("性能基准测试", () => {
    test("应该正确基准测试哈希表性能", () => {
      const hashTable = new ChainingHashTable<string, number>();
      const operations = [
        { type: "set" as const, key: "key1", value: 1 },
        { type: "set" as const, key: "key2", value: 2 },
        { type: "get" as const, key: "key1" },
        { type: "delete" as const, key: "key2" },
        { type: "get" as const, key: "key2" },
      ];

      const result = HashTableUtils.benchmarkHashTable(hashTable, operations);

      expect(result.totalTime).toBeGreaterThanOrEqual(0);
      expect(result.operationTimes).toHaveLength(operations.length);
      expect(result.averageTime).toBeGreaterThanOrEqual(0);
      expect(result.averageTime).toBe(result.totalTime / operations.length);
    });
  });
});

describe("边界情况和错误处理", () => {
  test("处理空键和空值", () => {
    const hashTable = new ChainingHashTable<string, any>();

    hashTable.set("", "empty string key");
    hashTable.set("null", null);
    hashTable.set("undefined", undefined);

    expect(hashTable.get("")).toBe("empty string key");
    expect(hashTable.get("null")).toBeNull();
    expect(hashTable.get("undefined")).toBeUndefined();
    expect(hashTable.has("null")).toBe(true);
    expect(hashTable.has("undefined")).toBe(true);
  });

  test("处理大量数据", () => {
    const hashTable = new ChainingHashTable<number, number>();
    const size = 10000;

    // 插入大量数据
    for (let i = 0; i < size; i++) {
      hashTable.set(i, i * i);
    }

    expect(hashTable.getSize()).toBe(size);

    // 验证随机采样
    for (let i = 0; i < 100; i++) {
      const randomKey = Math.floor(Math.random() * size);
      expect(hashTable.get(randomKey)).toBe(randomKey * randomKey);
    }
  });

  test("开放地址法的表满情况", () => {
    const smallHashTable = new OpenAddressingHashTable<number, number>(
      3,
      ProbingStrategy.LINEAR,
      defaultNumberHash,
      0.9 // 高负载因子阈值
    );

    // 填满小表
    smallHashTable.set(1, 1);
    smallHashTable.set(2, 2);

    // 应该触发扩容
    smallHashTable.set(3, 3);
    expect(smallHashTable.getSize()).toBe(3);
    expect(smallHashTable.get(1)).toBe(1);
    expect(smallHashTable.get(2)).toBe(2);
    expect(smallHashTable.get(3)).toBe(3);
  });
});

describe("性能比较测试", () => {
  test("链地址法 vs 开放地址法性能比较", () => {
    const size = 1000;
    const chainingHT = new ChainingHashTable<number, number>();
    const openHT = new OpenAddressingHashTable<number, number>();

    console.log("\n=== 哈希表性能比较 ===");

    // 插入测试
    let start = performance.now();
    for (let i = 0; i < size; i++) {
      chainingHT.set(i, i);
    }
    let chainingInsertTime = performance.now() - start;

    start = performance.now();
    for (let i = 0; i < size; i++) {
      openHT.set(i, i);
    }
    let openInsertTime = performance.now() - start;

    // 查找测试
    start = performance.now();
    for (let i = 0; i < size; i++) {
      chainingHT.get(i);
    }
    let chainingSearchTime = performance.now() - start;

    start = performance.now();
    for (let i = 0; i < size; i++) {
      openHT.get(i);
    }
    let openSearchTime = performance.now() - start;

    console.log(
      `链地址法 - 插入: ${chainingInsertTime.toFixed(
        2
      )}ms, 查找: ${chainingSearchTime.toFixed(2)}ms`
    );
    console.log(
      `开放地址法 - 插入: ${openInsertTime.toFixed(
        2
      )}ms, 查找: ${openSearchTime.toFixed(2)}ms`
    );

    // 验证正确性
    expect(chainingHT.getSize()).toBe(size);
    expect(openHT.getSize()).toBe(size);
  });
});
