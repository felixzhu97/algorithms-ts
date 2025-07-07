import { CompareFn, defaultCompare, SortResult } from "../../types";

/**
 * 插入排序
 * 《算法导论》第2章 算法基础
 *
 * 插入排序是一种简单直观的排序算法。它的工作原理是通过构建有序序列，
 * 对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
 *
 * 时间复杂度：
 * - 最佳情况：O(n) - 数组已排序
 * - 平均情况：O(n²)
 * - 最坏情况：O(n²) - 数组逆序排列
 * 空间复杂度：O(1) - 原地排序
 *
 * 稳定性：稳定排序
 * 适用场景：小规模数据排序，部分有序的数据
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数，默认为数字比较
 * @returns 排序结果包含统计信息
 */
export function insertionSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  // 从第二个元素开始，假设第一个元素已排序
  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;

    // 将key与已排序部分从右到左比较，找到合适位置
    while (j >= 0) {
      comparisons++;
      if (compareFn(result[j], key) > 0) {
        result[j + 1] = result[j];
        swaps++;
        j--;
      } else {
        break;
      }
    }

    // 将key插入到正确位置
    result[j + 1] = key;
  }

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  };
}

/**
 * 二分插入排序
 * 使用二分查找来寻找插入位置，减少比较次数但不减少移动次数
 *
 * 时间复杂度：O(n²) - 移动操作仍然是O(n²)
 * 比较次数：O(n log n)
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function binaryInsertionSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < result.length; i++) {
    const key = result[i];

    // 使用二分查找找到插入位置
    let left = 0;
    let right = i;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;

      if (compareFn(result[mid], key) > 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    // 移动元素为key腾出位置
    for (let j = i; j > left; j--) {
      result[j] = result[j - 1];
      swaps++;
    }

    result[left] = key;
  }

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  };
}

/**
 * 原地插入排序（修改原数组）
 *
 * @param arr 要排序的数组（会被修改）
 * @param compareFn 比较函数
 */
export function insertionSortInPlace<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): void {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && compareFn(arr[j], key) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }
}
