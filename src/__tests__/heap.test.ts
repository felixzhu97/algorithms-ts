/**
 * 堆数据结构和堆排序测试
 */

import {
  Heap,
  MaxHeap,
  MinHeap,
  PriorityQueue,
} from "../data-structures/trees/heap";
import {
  heapSort,
  heapSortWithHeapClass,
  findTopK,
  findTopKEfficient,
} from "../algorithms/sorting/heap-sort";

describe("堆数据结构测试", () => {
  describe("最大堆 (MaxHeap)", () => {
    let maxHeap: MaxHeap<number>;

    beforeEach(() => {
      maxHeap = new MaxHeap<number>();
    });

    test("应该正确插入和提取元素", () => {
      const values = [4, 2, 8, 1, 9, 3];

      values.forEach((val) => maxHeap.insert(val));

      expect(maxHeap.size()).toBe(6);
      expect(maxHeap.peek()).toBe(9); // 最大值应该在堆顶

      const extracted: number[] = [];
      while (!maxHeap.isEmpty()) {
        extracted.push(maxHeap.extract());
      }

      // 应该按降序提取
      expect(extracted).toEqual([9, 8, 4, 3, 2, 1]);
    });

    test("应该维护堆的性质", () => {
      const values = [10, 20, 15, 30, 40];
      values.forEach((val) => maxHeap.insert(val));

      expect(maxHeap.isValidHeap()).toBe(true);
    });

    test("应该正确处理重复元素", () => {
      const values = [5, 5, 5, 3, 3, 7, 7];
      values.forEach((val) => maxHeap.insert(val));

      expect(maxHeap.peek()).toBe(7);
      expect(maxHeap.isValidHeap()).toBe(true);
    });

    test("应该正确从数组构建堆", () => {
      const array = [3, 1, 6, 5, 2, 4];
      maxHeap.buildHeap(array);

      expect(maxHeap.isValidHeap()).toBe(true);
      expect(maxHeap.peek()).toBe(6);
    });
  });

  describe("最小堆 (MinHeap)", () => {
    let minHeap: MinHeap<number>;

    beforeEach(() => {
      minHeap = new MinHeap<number>();
    });

    test("应该正确插入和提取元素", () => {
      const values = [4, 2, 8, 1, 9, 3];

      values.forEach((val) => minHeap.insert(val));

      expect(minHeap.size()).toBe(6);
      expect(minHeap.peek()).toBe(1); // 最小值应该在堆顶

      const extracted: number[] = [];
      while (!minHeap.isEmpty()) {
        extracted.push(minHeap.extract());
      }

      // 应该按升序提取
      expect(extracted).toEqual([1, 2, 3, 4, 8, 9]);
    });

    test("应该维护堆的性质", () => {
      const values = [40, 30, 20, 15, 10];
      values.forEach((val) => minHeap.insert(val));

      expect(minHeap.isValidHeap()).toBe(true);
    });
  });

  describe("优先队列 (PriorityQueue)", () => {
    test("最大优先队列应该优先返回最大元素", () => {
      const maxPQ = new PriorityQueue<number>(undefined, true);

      [3, 1, 4, 1, 5, 9, 2, 6].forEach((val) => maxPQ.enqueue(val));

      expect(maxPQ.front()).toBe(9);
      expect(maxPQ.dequeue()).toBe(9);
      expect(maxPQ.dequeue()).toBe(6);
      expect(maxPQ.dequeue()).toBe(5);
    });

    test("最小优先队列应该优先返回最小元素", () => {
      const minPQ = new PriorityQueue<number>(undefined, false);

      [3, 1, 4, 1, 5, 9, 2, 6].forEach((val) => minPQ.enqueue(val));

      expect(minPQ.front()).toBe(1);
      expect(minPQ.dequeue()).toBe(1);
      expect(minPQ.dequeue()).toBe(1);
      expect(minPQ.dequeue()).toBe(2);
    });

    test("应该支持自定义比较函数", () => {
      interface Task {
        name: string;
        priority: number;
      }

      const taskCompareFn = (a: Task, b: Task) => a.priority - b.priority;
      const taskQueue = new PriorityQueue<Task>(taskCompareFn, true); // 高优先级数字优先

      const tasks: Task[] = [
        { name: "任务A", priority: 1 },
        { name: "任务B", priority: 5 },
        { name: "任务C", priority: 3 },
        { name: "任务D", priority: 8 },
      ];

      tasks.forEach((task) => taskQueue.enqueue(task));

      expect(taskQueue.dequeue().name).toBe("任务D"); // priority 8
      expect(taskQueue.dequeue().name).toBe("任务B"); // priority 5
      expect(taskQueue.dequeue().name).toBe("任务C"); // priority 3
      expect(taskQueue.dequeue().name).toBe("任务A"); // priority 1
    });
  });
});

describe("堆排序测试", () => {
  const testCases = [
    { name: "空数组", input: [], expected: [] },
    { name: "单元素", input: [42], expected: [42] },
    { name: "已排序", input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
    { name: "逆序", input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
    {
      name: "随机",
      input: [3, 1, 4, 1, 5, 9, 2, 6],
      expected: [1, 1, 2, 3, 4, 5, 6, 9],
    },
    {
      name: "重复元素",
      input: [3, 3, 3, 1, 1, 2, 2],
      expected: [1, 1, 2, 2, 3, 3, 3],
    },
  ];

  const heapSortAlgorithms = [
    { name: "标准堆排序", fn: heapSort },
    { name: "使用堆类的堆排序", fn: heapSortWithHeapClass },
  ];

  heapSortAlgorithms.forEach(({ name, fn }) => {
    describe(name, () => {
      testCases.forEach(({ name: testName, input, expected }) => {
        test(testName, () => {
          const result = fn([...input]);
          expect(result.sorted).toEqual(expected);
          expect(result.comparisons).toBeGreaterThanOrEqual(0);
          expect(result.swaps).toBeGreaterThanOrEqual(0);
          expect(result.timeComplexity).toBe("O(n log n)");
        });
      });
    });
  });

  test("堆排序应该有稳定的时间复杂度", () => {
    // 测试最坏情况（已排序数组）
    const sortedArray = Array.from({ length: 1000 }, (_, i) => i);
    const result1 = heapSort(sortedArray);

    // 测试最好情况（逆序数组）
    const reversedArray = Array.from({ length: 1000 }, (_, i) => 1000 - i - 1);
    const result2 = heapSort(reversedArray);

    // 两种情况的比较次数应该相近（堆排序时间复杂度稳定）
    const ratio = result1.comparisons / result2.comparisons;
    expect(ratio).toBeGreaterThan(0.5);
    expect(ratio).toBeLessThan(2.0);
  });
});

describe("Top-K 问题测试", () => {
  const testArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

  test("findTopK 应该正确找到最大的k个元素", () => {
    expect(findTopK(testArray, 3)).toEqual([9, 6, 5]);
    expect(findTopK(testArray, 5)).toEqual([9, 6, 5, 5, 5]);
    expect(findTopK(testArray, 0)).toEqual([]);
    expect(findTopK([], 3)).toEqual([]);
  });

  test("findTopKEfficient 应该正确找到最大的k个元素", () => {
    expect(findTopKEfficient(testArray, 3)).toEqual([9, 6, 5]);
    expect(findTopKEfficient(testArray, 5)).toEqual([9, 6, 5, 5, 5]);
    expect(findTopKEfficient(testArray, 0)).toEqual([]);
    expect(findTopKEfficient([], 3)).toEqual([]);
  });

  test("当k >= 数组长度时，应该返回完整的排序数组", () => {
    const input = [3, 1, 4];
    const expected = [4, 3, 1]; // 降序

    expect(findTopK(input, 5)).toEqual(expected);
    expect(findTopKEfficient(input, 5)).toEqual(expected);
  });

  test("Top-K算法应该处理重复元素", () => {
    const arrayWithDuplicates = [1, 1, 1, 2, 2, 3];
    expect(findTopK(arrayWithDuplicates, 3)).toEqual([3, 2, 2]);
    expect(findTopKEfficient(arrayWithDuplicates, 3)).toEqual([3, 2, 2]);
  });
});

describe("性能测试", () => {
  test("堆排序大数组性能", () => {
    const largeArray = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 10000)
    );

    const start = Date.now();
    const result = heapSort(largeArray);
    const duration = Date.now() - start;

    // 验证结果正确性
    expect(result.sorted).toHaveLength(largeArray.length);

    // 验证排序正确性
    for (let i = 1; i < result.sorted.length; i++) {
      expect(result.sorted[i]).toBeGreaterThanOrEqual(result.sorted[i - 1]);
    }

    console.log(`堆排序 ${largeArray.length} 个元素耗时: ${duration}ms`);
    console.log(`比较次数: ${result.comparisons}, 交换次数: ${result.swaps}`);
  });

  test("Top-K算法性能比较", () => {
    const largeArray = Array.from({ length: 100000 }, () =>
      Math.floor(Math.random() * 100000)
    );
    const k = 10;

    // 测试 findTopK
    const start1 = Date.now();
    const result1 = findTopK(largeArray, k);
    const duration1 = Date.now() - start1;

    // 测试 findTopKEfficient
    const start2 = Date.now();
    const result2 = findTopKEfficient(largeArray, k);
    const duration2 = Date.now() - start2;

    // 验证结果相同
    expect(result1).toEqual(result2);

    console.log(`findTopK 耗时: ${duration1}ms`);
    console.log(`findTopKEfficient 耗时: ${duration2}ms`);

    // 对于大数组和小k，高效版本应该更快
    if (largeArray.length > 10000 && k < 100) {
      expect(duration2).toBeLessThan(duration1 * 2); // 允许一些误差
    }
  });
});
