import { CompareFn, defaultCompare, SortResult } from "../../types";

/**
 * 快速排序
 * 《算法导论》第7章 快速排序
 *
 * 快速排序采用分治的策略，通过一趟排序将要排序的数据分割成独立的两部分，
 * 其中一部分的所有数据都比另外一部分的所有数据都要小，
 * 然后再按此方法对这两部分数据分别进行快速排序。
 *
 * 时间复杂度：
 * - 最佳情况：O(n log n) - 每次划分都能平分数组
 * - 平均情况：O(n log n)
 * - 最坏情况：O(n²) - 数组已排序或逆序
 * 空间复杂度：O(log n) - 递归调用栈
 *
 * 稳定性：不稳定排序
 * 适用场景：大多数情况下性能优异，是很多语言标准库的默认排序算法
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数，默认为数字比较
 * @returns 排序结果包含统计信息
 */
export function quickSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  /**
   * 交换数组中两个元素的位置
   */
  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
    }
  }

  /**
   * 分区操作 - Lomuto分区方案
   * 选择最后一个元素作为基准元素，将小于基准的元素放在左边，大于等于基准的放在右边
   *
   * @param arr 数组
   * @param low 起始索引
   * @param high 结束索引
   * @returns 基准元素的最终位置
   */
  function partition(arr: T[], low: number, high: number): number {
    const pivot = arr[high]; // 选择最后一个元素作为基准
    let i = low - 1; // 小于基准的元素的索引

    for (let j = low; j < high; j++) {
      comparisons++;
      if (compareFn(arr[j], pivot) < 0) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, high);
    return i + 1;
  }

  /**
   * 快速排序递归函数
   * @param arr 数组
   * @param low 起始索引
   * @param high 结束索引
   */
  function quickSortRecursive(arr: T[], low: number, high: number): void {
    if (low < high) {
      // 分区操作，获取基准元素的正确位置
      const pivotIndex = partition(arr, low, high);

      // 递归排序基准元素左边的子数组
      quickSortRecursive(arr, low, pivotIndex - 1);

      // 递归排序基准元素右边的子数组
      quickSortRecursive(arr, pivotIndex + 1, high);
    }
  }

  quickSortRecursive(result, 0, result.length - 1);

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n) avg, O(n²) worst",
    spaceComplexity: "O(log n)",
  };
}

/**
 * 快速排序 - Hoare分区方案
 * 使用双指针从两端向中间扫描的分区方法
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function quickSortHoare<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
    }
  }

  /**
   * Hoare分区方案
   * 使用首元素作为基准，双指针从两端向中间移动
   *
   * @param arr 数组
   * @param low 起始索引
   * @param high 结束索引
   * @returns 分区点
   */
  function hoarePartition(arr: T[], low: number, high: number): number {
    const pivot = arr[low]; // 选择第一个元素作为基准
    let i = low - 1;
    let j = high + 1;

    while (true) {
      // 从左边找到第一个大于等于基准的元素
      do {
        i++;
        comparisons++;
      } while (i <= high && compareFn(arr[i], pivot) < 0);

      // 从右边找到第一个小于等于基准的元素
      do {
        j--;
        comparisons++;
      } while (j >= low && compareFn(arr[j], pivot) > 0);

      if (i >= j) {
        return j;
      }

      swap(arr, i, j);
    }
  }

  function quickSortRecursive(arr: T[], low: number, high: number): void {
    if (low < high) {
      const pivotIndex = hoarePartition(arr, low, high);
      quickSortRecursive(arr, low, pivotIndex);
      quickSortRecursive(arr, pivotIndex + 1, high);
    }
  }

  quickSortRecursive(result, 0, result.length - 1);

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n) avg, O(n²) worst",
    spaceComplexity: "O(log n)",
  };
}

/**
 * 随机化快速排序
 * 通过随机选择基准元素来避免最坏情况的发生
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function randomizedQuickSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
    }
  }

  /**
   * 随机化分区
   * 随机选择一个元素与最后一个元素交换，然后进行标准分区
   */
  function randomizedPartition(arr: T[], low: number, high: number): number {
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    swap(arr, randomIndex, high);
    return partition(arr, low, high);
  }

  function partition(arr: T[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      if (compareFn(arr[j], pivot) < 0) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, high);
    return i + 1;
  }

  function quickSortRecursive(arr: T[], low: number, high: number): void {
    if (low < high) {
      const pivotIndex = randomizedPartition(arr, low, high);
      quickSortRecursive(arr, low, pivotIndex - 1);
      quickSortRecursive(arr, pivotIndex + 1, high);
    }
  }

  quickSortRecursive(result, 0, result.length - 1);

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n) expected",
    spaceComplexity: "O(log n)",
  };
}

/**
 * 三路快速排序
 * 针对包含大量重复元素的数组优化，将数组分为三部分：小于、等于、大于基准
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function threeWayQuickSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
    }
  }

  /**
   * 三路分区
   * 返回等于基准值的区间 [lt+1, gt-1]
   */
  function threeWayPartition(
    arr: T[],
    low: number,
    high: number
  ): [number, number] {
    const pivot = arr[low];
    let lt = low; // arr[low+1...lt] < pivot
    let i = low + 1; // arr[lt+1...i-1] = pivot
    let gt = high + 1; // arr[gt...high] > pivot

    while (i < gt) {
      comparisons++;
      const cmp = compareFn(arr[i], pivot);

      if (cmp < 0) {
        swap(arr, ++lt, i++);
      } else if (cmp > 0) {
        swap(arr, i, --gt);
      } else {
        i++;
      }
    }

    swap(arr, low, lt);
    return [lt - 1, gt];
  }

  function quickSort3Way(arr: T[], low: number, high: number): void {
    if (low >= high) return;

    const [lt, gt] = threeWayPartition(arr, low, high);
    quickSort3Way(arr, low, lt);
    quickSort3Way(arr, gt, high);
  }

  quickSort3Way(result, 0, result.length - 1);

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n), O(n) for many duplicates",
    spaceComplexity: "O(log n)",
  };
}

/**
 * 迭代版快速排序
 * 使用栈模拟递归过程，避免递归调用栈溢出
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function iterativeQuickSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  if (result.length <= 1) {
    return {
      sorted: result,
      comparisons,
      swaps,
      timeComplexity: "O(n log n) avg, O(n²) worst",
      spaceComplexity: "O(log n)",
    };
  }

  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
    }
  }

  function partition(arr: T[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      if (compareFn(arr[j], pivot) < 0) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, high);
    return i + 1;
  }

  const stack: Array<[number, number]> = [];
  stack.push([0, result.length - 1]);

  while (stack.length > 0) {
    const [low, high] = stack.pop()!;

    if (low < high) {
      const pivotIndex = partition(result, low, high);

      // 将子问题压入栈中
      stack.push([low, pivotIndex - 1]);
      stack.push([pivotIndex + 1, high]);
    }
  }

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n) avg, O(n²) worst",
    spaceComplexity: "O(log n)",
  };
}
