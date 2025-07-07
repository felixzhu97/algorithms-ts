/**
 * 排序算法测试
 */

import { insertionSort } from "../algorithms/sorting/insertion-sort";
import { mergeSort } from "../algorithms/sorting/merge-sort";
import {
  quickSort,
  randomizedQuickSort,
  threeWayQuickSort,
} from "../algorithms/sorting/quick-sort";

describe("排序算法测试", () => {
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

  const algorithms = [
    { name: "插入排序", fn: insertionSort },
    { name: "归并排序", fn: mergeSort },
    { name: "快速排序", fn: quickSort },
    { name: "随机快速排序", fn: randomizedQuickSort },
    { name: "三路快速排序", fn: threeWayQuickSort },
  ];

  algorithms.forEach(({ name, fn }) => {
    describe(name, () => {
      testCases.forEach(({ name: testName, input, expected }) => {
        test(`${testName}`, () => {
          const result = fn([...input]);
          expect(result.sorted).toEqual(expected);
          expect(result.comparisons).toBeGreaterThanOrEqual(0);
          expect(result.swaps).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  // 测试稳定性（对于支持稳定排序的算法）
  describe("稳定性测试", () => {
    interface TestItem {
      value: number;
      originalIndex: number;
    }

    const createStabilityTestData = (): TestItem[] => [
      { value: 3, originalIndex: 0 },
      { value: 1, originalIndex: 1 },
      { value: 3, originalIndex: 2 },
      { value: 2, originalIndex: 3 },
      { value: 1, originalIndex: 4 },
    ];

    const compareByValue = (a: TestItem, b: TestItem) => a.value - b.value;

    test("插入排序应该是稳定的", () => {
      const data = createStabilityTestData();
      const result = insertionSort(data, compareByValue);

      // 检查相同值的元素是否保持原始顺序
      const ones = result.sorted.filter((item) => item.value === 1);
      expect(ones[0].originalIndex).toBe(1);
      expect(ones[1].originalIndex).toBe(4);

      const threes = result.sorted.filter((item) => item.value === 3);
      expect(threes[0].originalIndex).toBe(0);
      expect(threes[1].originalIndex).toBe(2);
    });

    test("归并排序应该是稳定的", () => {
      const data = createStabilityTestData();
      const result = mergeSort(data, compareByValue);

      const ones = result.sorted.filter((item) => item.value === 1);
      expect(ones[0].originalIndex).toBe(1);
      expect(ones[1].originalIndex).toBe(4);

      const threes = result.sorted.filter((item) => item.value === 3);
      expect(threes[0].originalIndex).toBe(0);
      expect(threes[1].originalIndex).toBe(2);
    });
  });

  // 性能测试
  describe("性能测试", () => {
    const generateLargeArray = (size: number) =>
      Array.from({ length: size }, () => Math.floor(Math.random() * 1000));

    test("大数组排序性能", () => {
      const largeArray = generateLargeArray(10000);

      algorithms.forEach(({ name, fn }) => {
        const start = Date.now();
        const result = fn([...largeArray]);
        const duration = Date.now() - start;

        // 验证结果正确性
        expect(result.sorted).toHaveLength(largeArray.length);

        // 验证排序正确性
        for (let i = 1; i < result.sorted.length; i++) {
          expect(result.sorted[i]).toBeGreaterThanOrEqual(result.sorted[i - 1]);
        }

        console.log(
          `${name} 排序 ${largeArray.length} 个元素耗时: ${duration}ms`
        );
      });
    });
  });
});
