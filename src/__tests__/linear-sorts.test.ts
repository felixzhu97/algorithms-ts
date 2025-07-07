/**
 * 线性排序算法测试
 * 《算法导论》第8章 线性时间排序
 */

import {
  countingSort,
  radixSort,
  bucketSort,
  bucketSortInteger,
  radixSortString,
} from "../algorithms/sorting/linear-sorts";

describe("计数排序 (Counting Sort)", () => {
  test("应该正确排序非负整数数组", () => {
    const testCases = [
      { input: [], expected: [] },
      { input: [5], expected: [5] },
      { input: [4, 2, 2, 8, 3, 3, 1], expected: [1, 2, 2, 3, 3, 4, 8] },
      { input: [0, 1, 2, 3, 4], expected: [0, 1, 2, 3, 4] },
      { input: [4, 3, 2, 1, 0], expected: [0, 1, 2, 3, 4] },
      { input: [5, 5, 5, 5], expected: [5, 5, 5, 5] },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = countingSort([...input]);
      expect(result.sorted).toEqual(expected);
      expect(result.comparisons).toBe(0); // 计数排序不需要比较
      expect(result.timeComplexity).toBe("O(n + k)");
      expect(result.spaceComplexity).toBe("O(k)");
    });
  });

  test("应该处理大范围的数值", () => {
    const input = [100, 1, 50, 25, 75];
    const result = countingSort(input);
    expect(result.sorted).toEqual([1, 25, 50, 75, 100]);
  });

  test("应该在指定最大值时正确工作", () => {
    const input = [3, 1, 4, 1, 5];
    const result = countingSort(input, 10);
    expect(result.sorted).toEqual([1, 1, 3, 4, 5]);
  });

  test("应该拒绝负数", () => {
    expect(() => countingSort([1, -1, 2])).toThrow("计数排序只适用于非负整数");
  });

  test("应该拒绝非整数", () => {
    expect(() => countingSort([1.5, 2, 3])).toThrow("计数排序只适用于非负整数");
  });

  test("应该保持稳定性", () => {
    // 使用对象数组测试稳定性
    interface Item {
      key: number;
      value: string;
    }

    // 模拟稳定性测试：相同key的元素应该保持原始顺序
    const input = [2, 1, 2, 1, 3];
    const result = countingSort(input);
    expect(result.sorted).toEqual([1, 1, 2, 2, 3]);
  });
});

describe("基数排序 (Radix Sort)", () => {
  test("应该正确排序非负整数数组", () => {
    const testCases = [
      { input: [], expected: [] },
      { input: [170], expected: [170] },
      {
        input: [170, 45, 75, 90, 2, 802, 24, 66],
        expected: [2, 24, 45, 66, 75, 90, 170, 802],
      },
      {
        input: [329, 457, 657, 839, 436, 720, 355],
        expected: [329, 355, 436, 457, 657, 720, 839],
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = radixSort([...input]);
      expect(result.sorted).toEqual(expected);
      expect(result.comparisons).toBe(0);
      expect(result.timeComplexity).toBe("O(d(n + k))");
    });
  });

  test("应该处理单位数", () => {
    const input = [5, 2, 8, 1, 9];
    const result = radixSort(input);
    expect(result.sorted).toEqual([1, 2, 5, 8, 9]);
  });

  test("应该处理不同位数的数字", () => {
    const input = [1, 10, 100, 1000];
    const result = radixSort(input);
    expect(result.sorted).toEqual([1, 10, 100, 1000]);
  });

  test("应该支持不同的基数", () => {
    // 二进制基数排序
    const input = [4, 2, 8, 1]; // 二进制：100, 10, 1000, 1
    const result = radixSort(input, 2);
    expect(result.sorted).toEqual([1, 2, 4, 8]);
  });

  test("应该拒绝负数", () => {
    expect(() => radixSort([1, -1, 2])).toThrow("基数排序只适用于非负整数");
  });

  test("应该拒绝非整数", () => {
    expect(() => radixSort([1.5, 2, 3])).toThrow("基数排序只适用于非负整数");
  });
});

describe("桶排序 (Bucket Sort)", () => {
  test("应该正确排序[0,1)区间的浮点数", () => {
    const input = [0.897, 0.565, 0.656, 0.1234, 0.665, 0.3434];
    const result = bucketSort([...input]);

    const expected = [...input].sort((a, b) => a - b);
    expect(result.sorted).toEqual(expected);
    expect(result.timeComplexity).toBe("O(n + k)");
  });

  test("应该处理标准化数据", () => {
    const input = [29, 25, 3, 49, 9, 37, 21, 43];
    const result = bucketSort([...input], undefined, true);

    const expected = [3, 9, 21, 25, 29, 37, 43, 49];
    expect(result.sorted).toEqual(expected);
  });

  test("应该处理空数组和单元素", () => {
    expect(bucketSort([]).sorted).toEqual([]);
    expect(bucketSort([0.5]).sorted).toEqual([0.5]);
  });

  test("应该处理所有相同元素", () => {
    const input = [0.5, 0.5, 0.5, 0.5];
    const result = bucketSort(input, undefined, true);
    expect(result.sorted).toEqual([0.5, 0.5, 0.5, 0.5]);
  });

  test("应该允许自定义桶数量", () => {
    const input = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = bucketSort(input, 3);
    expect(result.sorted).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
  });
});

describe("整数桶排序 (Bucket Sort Integer)", () => {
  test("应该正确排序整数数组", () => {
    const testCases = [
      {
        input: [42, 32, 33, 52, 37, 47, 51],
        expected: [32, 33, 37, 42, 47, 51, 52],
      },
      { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
      { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
      { input: [10, 1, 20, 5, 15], expected: [1, 5, 10, 15, 20] },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = bucketSortInteger([...input]);
      expect(result.sorted).toEqual(expected);
      expect(result.timeComplexity).toBe("O(n + k)");
    });
  });

  test("应该处理负数", () => {
    const input = [-5, 3, -2, 8, 0, -1];
    const result = bucketSortInteger(input);
    expect(result.sorted).toEqual([-5, -2, -1, 0, 3, 8]);
  });

  test("应该支持自定义桶大小", () => {
    const input = [1, 5, 10, 15, 20];
    const result = bucketSortInteger(input, 3);
    expect(result.sorted).toEqual([1, 5, 10, 15, 20]);
  });

  test("应该拒绝非整数", () => {
    expect(() => bucketSortInteger([1.5, 2, 3])).toThrow("此函数只适用于整数");
  });
});

describe("字符串基数排序 (Radix Sort String)", () => {
  test("应该正确排序等长字符串", () => {
    const input = [
      "COW",
      "DOG",
      "SEA",
      "RUG",
      "ROW",
      "MOB",
      "BOX",
      "TAB",
      "BAR",
      "EAR",
      "TAR",
      "DIG",
      "BIG",
      "TEA",
      "NOW",
      "FOX",
    ];
    const result = radixSortString([...input]);

    const expected = [...input].sort();
    expect(result.sorted).toEqual(expected);
  });

  test("应该处理数字字符串", () => {
    const input = ["123", "456", "789", "012", "345"];
    const result = radixSortString(input);
    expect(result.sorted).toEqual(["012", "123", "345", "456", "789"]);
  });

  test("应该处理单字符字符串", () => {
    const input = ["z", "a", "m", "b", "y"];
    const result = radixSortString(input);
    expect(result.sorted).toEqual(["a", "b", "m", "y", "z"]);
  });

  test("应该拒绝长度不一致的字符串", () => {
    expect(() => radixSortString(["abc", "de", "fgh"])).toThrow(
      "基数排序要求所有字符串长度相同"
    );
  });

  test("应该处理空数组和单元素", () => {
    expect(radixSortString([]).sorted).toEqual([]);
    expect(radixSortString(["abc"]).sorted).toEqual(["abc"]);
  });
});

describe("线性排序算法性能测试", () => {
  test("计数排序大数组性能", () => {
    // 生成范围在0-999的随机整数
    const largeArray = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 1000)
    );

    const start = Date.now();
    const result = countingSort(largeArray);
    const duration = Date.now() - start;

    // 验证排序正确性
    for (let i = 1; i < result.sorted.length; i++) {
      expect(result.sorted[i]).toBeGreaterThanOrEqual(result.sorted[i - 1]);
    }

    console.log(
      `计数排序 ${largeArray.length} 个元素(范围0-999)耗时: ${duration}ms`
    );
  });

  test("基数排序大数组性能", () => {
    // 生成随机整数
    const largeArray = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 100000)
    );

    const start = Date.now();
    const result = radixSort(largeArray);
    const duration = Date.now() - start;

    // 验证排序正确性
    for (let i = 1; i < result.sorted.length; i++) {
      expect(result.sorted[i]).toBeGreaterThanOrEqual(result.sorted[i - 1]);
    }

    console.log(
      `基数排序 ${largeArray.length} 个元素(范围0-99999)耗时: ${duration}ms`
    );
  });

  test("桶排序大数组性能", () => {
    // 生成均匀分布的随机数
    const largeArray = Array.from({ length: 10000 }, () => Math.random());

    const start = Date.now();
    const result = bucketSort(largeArray);
    const duration = Date.now() - start;

    // 验证排序正确性
    for (let i = 1; i < result.sorted.length; i++) {
      expect(result.sorted[i]).toBeGreaterThanOrEqual(result.sorted[i - 1]);
    }

    console.log(
      `桶排序 ${largeArray.length} 个均匀分布的随机数耗时: ${duration}ms`
    );
  });

  test("线性排序算法比较", () => {
    // 对于特定类型的数据，线性排序应该比比较排序更快
    const smallRangeIntegers = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 100)
    );

    // 计数排序
    const start1 = Date.now();
    const result1 = countingSort([...smallRangeIntegers]);
    const duration1 = Date.now() - start1;

    // 基数排序
    const start2 = Date.now();
    const result2 = radixSort([...smallRangeIntegers]);
    const duration2 = Date.now() - start2;

    // 验证结果一致
    expect(result1.sorted).toEqual(result2.sorted);

    console.log(`小范围整数排序比较：`);
    console.log(`计数排序耗时: ${duration1}ms`);
    console.log(`基数排序耗时: ${duration2}ms`);
  });
});
