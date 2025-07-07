import { CompareFn, defaultCompare, SortResult } from "../../types";

/**
 * 归并排序
 * 《算法导论》第2章 算法基础
 *
 * 归并排序是一种基于分治思想的排序算法。它将数组分成两半，
 * 递归地对每一半进行排序，然后将两个已排序的子数组合并成一个有序数组。
 *
 * 时间复杂度：
 * - 最佳情况：O(n log n)
 * - 平均情况：O(n log n)
 * - 最坏情况：O(n log n)
 * 空间复杂度：O(n) - 需要额外空间存储临时数组
 *
 * 稳定性：稳定排序
 * 适用场景：大规模数据排序，对稳定性有要求的场景
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数，默认为数字比较
 * @returns 排序结果包含统计信息
 */
export function mergeSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  /**
   * 合并两个已排序的子数组
   * @param arr 原数组
   * @param left 左子数组起始位置
   * @param mid 左子数组结束位置
   * @param right 右子数组结束位置
   */
  function merge(arr: T[], left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0; // 左子数组索引
    let j = 0; // 右子数组索引
    let k = left; // 合并后数组索引

    // 比较并合并两个子数组
    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      if (compareFn(leftArr[i], rightArr[j]) <= 0) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
      swaps++;
    }

    // 复制左子数组剩余元素
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      swaps++;
    }

    // 复制右子数组剩余元素
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      swaps++;
    }
  }

  /**
   * 递归排序函数
   * @param arr 要排序的数组
   * @param left 起始位置
   * @param right 结束位置
   */
  function mergeSortRecursive(arr: T[], left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      // 递归排序左半部分
      mergeSortRecursive(arr, left, mid);

      // 递归排序右半部分
      mergeSortRecursive(arr, mid + 1, right);

      // 合并两个已排序的部分
      merge(arr, left, mid, right);
    }
  }

  mergeSortRecursive(result, 0, result.length - 1);

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  };
}

/**
 * 自底向上归并排序
 * 非递归实现，使用迭代方式从小到大合并子数组
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function mergeSortBottomUp<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  const n = result.length;
  let comparisons = 0;
  let swaps = 0;

  /**
   * 合并函数（复用上面的逻辑）
   */
  function merge(arr: T[], left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      if (compareFn(leftArr[i], rightArr[j]) <= 0) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
      swaps++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      swaps++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      swaps++;
    }
  }

  // 从大小为1的子数组开始，逐步合并更大的子数组
  for (let size = 1; size < n; size *= 2) {
    for (let left = 0; left < n - size; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);

      merge(result, left, mid, right);
    }
  }

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  };
}

/**
 * K路归并排序
 * 将数组分成k个部分进行归并，可以减少递归深度
 *
 * @param arr 要排序的数组
 * @param k 分路数量
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function kWayMergeSort<T>(
  arr: T[],
  k: number = 2,
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  if (k < 2) k = 2;

  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  /**
   * K路合并函数
   * @param arrays 要合并的数组
   * @returns 合并后的数组
   */
  function kMerge(arrays: T[][]): T[] {
    const merged: T[] = [];
    const indices = new Array(arrays.length).fill(0);

    while (true) {
      let minIndex = -1;
      let minValue: T | undefined;

      // 找到当前最小值及其所在数组
      for (let i = 0; i < arrays.length; i++) {
        if (indices[i] < arrays[i].length) {
          comparisons++;
          if (
            minIndex === -1 ||
            compareFn(arrays[i][indices[i]], minValue!) < 0
          ) {
            minIndex = i;
            minValue = arrays[i][indices[i]];
          }
        }
      }

      if (minIndex === -1) break; // 所有数组都已处理完

      merged.push(minValue!);
      indices[minIndex]++;
      swaps++;
    }

    return merged;
  }

  /**
   * K路归并排序递归函数
   */
  function kWayMergeSortRecursive(arr: T[]): T[] {
    if (arr.length <= 1) return arr;

    const chunkSize = Math.ceil(arr.length / k);
    const chunks: T[][] = [];

    // 将数组分成k个部分
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }

    // 递归排序每个部分
    const sortedChunks = chunks.map((chunk) => kWayMergeSortRecursive(chunk));

    // K路合并
    return kMerge(sortedChunks);
  }

  const sorted = kWayMergeSortRecursive(result);

  return {
    sorted,
    comparisons,
    swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  };
}
