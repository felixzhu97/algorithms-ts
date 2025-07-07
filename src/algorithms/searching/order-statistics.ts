/**
 * 中位数和顺序统计量算法
 * 《算法导论》第9章 中位数和顺序统计量
 *
 * 包含以下算法：
 * 1. 快速选择算法 (Quickselect)
 * 2. 线性时间选择算法 (SELECT)
 * 3. 中位数查找算法
 */

import { CompareFn, defaultCompare } from "../../types";

/**
 * 选择算法结果接口
 */
export interface SelectResult<T> {
  element: T;
  index: number;
  comparisons: number;
  recursionDepth: number;
}

/**
 * 快速选择算法 (Quickselect)
 * 期望时间复杂度: O(n)
 * 最坏时间复杂度: O(n²)
 * 空间复杂度: O(log n)
 *
 * 找到数组中第k小的元素（k从1开始计数）
 */
export function quickSelect<T>(
  arr: T[],
  k: number,
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SelectResult<T> {
  if (k < 1 || k > arr.length) {
    throw new Error(`k=${k} 超出范围 [1, ${arr.length}]`);
  }

  const workArray = [...arr];
  let comparisons = 0;
  let recursionDepth = 0;

  function quickSelectImpl(
    arr: T[],
    left: number,
    right: number,
    k: number,
    depth: number
  ): { element: T; index: number } {
    recursionDepth = Math.max(recursionDepth, depth);

    if (left === right) {
      return { element: arr[left], index: left };
    }

    // 随机化分区点以获得更好的期望性能
    const randomIndex = Math.floor(Math.random() * (right - left + 1)) + left;
    swap(arr, randomIndex, right);

    const pivotIndex = partition(arr, left, right);

    if (k === pivotIndex + 1) {
      return { element: arr[pivotIndex], index: pivotIndex };
    } else if (k < pivotIndex + 1) {
      return quickSelectImpl(arr, left, pivotIndex - 1, k, depth + 1);
    } else {
      return quickSelectImpl(arr, pivotIndex + 1, right, k, depth + 1);
    }
  }

  function partition(arr: T[], left: number, right: number): number {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      comparisons++;
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, right);
    return i + 1;
  }

  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  const result = quickSelectImpl(workArray, 0, workArray.length - 1, k, 0);

  return {
    element: result.element,
    index: result.index,
    comparisons,
    recursionDepth,
  };
}

/**
 * 线性时间选择算法 (SELECT)
 * 最坏时间复杂度: O(n)
 * 空间复杂度: O(log n)
 *
 * 保证在线性时间内找到第k小的元素
 */
export function linearSelect<T>(
  arr: T[],
  k: number,
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SelectResult<T> {
  if (k < 1 || k > arr.length) {
    throw new Error(`k=${k} 超出范围 [1, ${arr.length}]`);
  }

  const workArray = [...arr];
  let comparisons = 0;
  let recursionDepth = 0;

  function selectImpl(
    arr: T[],
    left: number,
    right: number,
    k: number,
    depth: number
  ): { element: T; index: number } {
    recursionDepth = Math.max(recursionDepth, depth);

    const n = right - left + 1;

    // 基础情况：小数组直接排序
    if (n <= 5) {
      insertionSort(arr, left, right);
      return { element: arr[left + k - 1], index: left + k - 1 };
    }

    // 第1步：将数组分成n/5组，每组5个元素
    const medians: T[] = [];
    for (let i = left; i <= right; i += 5) {
      const groupRight = Math.min(i + 4, right);
      insertionSort(arr, i, groupRight);
      const medianIndex = i + Math.floor((groupRight - i) / 2);
      medians.push(arr[medianIndex]);
    }

    // 第2步：递归找到中位数的中位数
    const medianOfMedians = selectImpl(
      medians,
      0,
      medians.length - 1,
      Math.ceil(medians.length / 2),
      depth + 1
    ).element;

    // 第3步：使用中位数的中位数作为分区点
    const pivotIndex = findPivotIndex(arr, left, right, medianOfMedians);
    swap(arr, pivotIndex, right);
    const partitionIndex = partition(arr, left, right);

    // 第4步：递归查找
    const rank = partitionIndex - left + 1;
    if (k === rank) {
      return { element: arr[partitionIndex], index: partitionIndex };
    } else if (k < rank) {
      return selectImpl(arr, left, partitionIndex - 1, k, depth + 1);
    } else {
      return selectImpl(arr, partitionIndex + 1, right, k - rank, depth + 1);
    }
  }

  function insertionSort(arr: T[], left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= left) {
        comparisons++;
        if (compareFn(arr[j], key) > 0) {
          arr[j + 1] = arr[j];
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
    }
  }

  function partition(arr: T[], left: number, right: number): number {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      comparisons++;
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, right);
    return i + 1;
  }

  function findPivotIndex(
    arr: T[],
    left: number,
    right: number,
    pivot: T
  ): number {
    for (let i = left; i <= right; i++) {
      comparisons++;
      if (compareFn(arr[i], pivot) === 0) {
        return i;
      }
    }
    return left; // 回退情况
  }

  function swap(arr: T[], i: number, j: number): void {
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  const result = selectImpl(workArray, 0, workArray.length - 1, k, 0);

  return {
    element: result.element,
    index: result.index,
    comparisons,
    recursionDepth,
  };
}

/**
 * 中位数查找算法
 * 时间复杂度: O(n)
 *
 * 找到数组的中位数
 */
export function findMedian<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): { median: T; lowerMedian?: T; isEven: boolean; result: SelectResult<T> } {
  if (arr.length === 0) {
    throw new Error("数组不能为空");
  }

  const n = arr.length;
  const isEven = n % 2 === 0;

  if (isEven) {
    // 偶数个元素，返回两个中位数
    const lowerMedianResult = linearSelect(arr, n / 2, compareFn);
    const upperMedianResult = linearSelect(arr, n / 2 + 1, compareFn);

    return {
      median: upperMedianResult.element,
      lowerMedian: lowerMedianResult.element,
      isEven: true,
      result: upperMedianResult,
    };
  } else {
    // 奇数个元素，返回中间元素
    const medianResult = linearSelect(arr, Math.ceil(n / 2), compareFn);

    return {
      median: medianResult.element,
      isEven: false,
      result: medianResult,
    };
  }
}

/**
 * 最小值和最大值同时查找
 * 时间复杂度: O(n)，比较次数最多3n/2
 *
 * 同时找到数组的最小值和最大值
 */
export function findMinMax<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): { min: T; max: T; comparisons: number; minIndex: number; maxIndex: number } {
  if (arr.length === 0) {
    throw new Error("数组不能为空");
  }

  let comparisons = 0;
  let min = arr[0];
  let max = arr[0];
  let minIndex = 0;
  let maxIndex = 0;

  let startIndex = 1;

  // 如果数组长度为偶数，先比较前两个元素
  if (arr.length % 2 === 0) {
    comparisons++;
    if (compareFn(arr[0], arr[1]) > 0) {
      min = arr[1];
      max = arr[0];
      minIndex = 1;
      maxIndex = 0;
    } else {
      min = arr[0];
      max = arr[1];
      minIndex = 0;
      maxIndex = 1;
    }
    startIndex = 2;
  }

  // 成对处理剩余元素
  for (let i = startIndex; i < arr.length - 1; i += 2) {
    let localMin: T, localMax: T;
    let localMinIndex: number, localMaxIndex: number;

    comparisons++;
    if (compareFn(arr[i], arr[i + 1]) > 0) {
      localMin = arr[i + 1];
      localMax = arr[i];
      localMinIndex = i + 1;
      localMaxIndex = i;
    } else {
      localMin = arr[i];
      localMax = arr[i + 1];
      localMinIndex = i;
      localMaxIndex = i + 1;
    }

    // 与全局最小值比较
    comparisons++;
    if (compareFn(localMin, min) < 0) {
      min = localMin;
      minIndex = localMinIndex;
    }

    // 与全局最大值比较
    comparisons++;
    if (compareFn(localMax, max) > 0) {
      max = localMax;
      maxIndex = localMaxIndex;
    }
  }

  return { min, max, comparisons, minIndex, maxIndex };
}

/**
 * 第i小和第j小元素同时查找
 * 时间复杂度: O(n)
 *
 * 同时找到第i小和第j小的元素（i < j）
 */
export function findIthAndJthSmallest<T>(
  arr: T[],
  i: number,
  j: number,
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): {
  ithElement: T;
  jthElement: T;
  ithResult: SelectResult<T>;
  jthResult: SelectResult<T>;
} {
  if (i < 1 || j < 1 || i > arr.length || j > arr.length) {
    throw new Error(`i=${i}, j=${j} 超出范围 [1, ${arr.length}]`);
  }

  if (i >= j) {
    throw new Error("i 必须小于 j");
  }

  // 先找到第i小的元素
  const ithResult = linearSelect(arr, i, compareFn);

  // 创建只包含大于等于第i小元素的子数组来查找第j小元素
  const workArray = [...arr];

  // 使用线性分区将数组分为三部分：< ith, = ith, > ith
  let equalCount = 0;
  let lessThanCount = 0;

  for (const element of workArray) {
    const cmp = compareFn(element, ithResult.element);
    if (cmp < 0) {
      lessThanCount++;
    } else if (cmp === 0) {
      equalCount++;
    }
  }

  // 如果j落在等于第i小元素的范围内
  if (j <= lessThanCount + equalCount) {
    return {
      ithElement: ithResult.element,
      jthElement: ithResult.element,
      ithResult,
      jthResult: { ...ithResult, comparisons: 0, recursionDepth: 0 },
    };
  }

  // 否则在大于第i小元素的部分查找第(j - lessThanCount - equalCount)小元素
  const greaterElements = workArray.filter(
    (element) => compareFn(element, ithResult.element) > 0
  );

  const jthResult = linearSelect(
    greaterElements,
    j - lessThanCount - equalCount,
    compareFn
  );

  return {
    ithElement: ithResult.element,
    jthElement: jthResult.element,
    ithResult,
    jthResult,
  };
}

/**
 * 加权中位数
 * 时间复杂度: O(n log n)
 *
 * 找到加权中位数，即累积权重达到总权重一半的元素
 */
export function findWeightedMedian<T>(
  elements: T[],
  weights: number[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): {
  element: T;
  index: number;
  cumulativeWeight: number;
  totalWeight: number;
} {
  if (elements.length !== weights.length) {
    throw new Error("元素数组和权重数组长度必须相等");
  }

  if (elements.length === 0) {
    throw new Error("数组不能为空");
  }

  // 检查权重是否都为正数
  for (const weight of weights) {
    if (weight <= 0) {
      throw new Error("所有权重必须为正数");
    }
  }

  // 创建带权重的元素数组
  const weightedElements = elements.map((element, index) => ({
    element,
    weight: weights[index],
    originalIndex: index,
  }));

  // 按元素值排序
  weightedElements.sort((a, b) => compareFn(a.element, b.element));

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const halfWeight = totalWeight / 2;

  let cumulativeWeight = 0;

  for (let i = 0; i < weightedElements.length; i++) {
    cumulativeWeight += weightedElements[i].weight;

    if (cumulativeWeight >= halfWeight) {
      return {
        element: weightedElements[i].element,
        index: weightedElements[i].originalIndex,
        cumulativeWeight,
        totalWeight,
      };
    }
  }

  // 理论上不应该到达这里
  const lastElement = weightedElements[weightedElements.length - 1];
  return {
    element: lastElement.element,
    index: lastElement.originalIndex,
    cumulativeWeight: totalWeight,
    totalWeight,
  };
}

/**
 * 顺序统计量工具类
 */
export class OrderStatistics {
  /**
   * 演示所有顺序统计量算法
   */
  static demonstrateAll<T>(
    arr: T[],
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): void {
    console.log("=== 顺序统计量算法演示 ===\n");
    console.log(`输入数组: [${arr.join(", ")}]`);
    console.log(`数组长度: ${arr.length}\n`);

    try {
      // 中位数查找
      console.log("--- 中位数查找 ---");
      const medianResult = findMedian(arr, compareFn);
      if (medianResult.isEven) {
        console.log(
          `中位数（偶数长度）: ${medianResult.lowerMedian}, ${medianResult.median}`
        );
      } else {
        console.log(`中位数（奇数长度）: ${medianResult.median}`);
      }
      console.log(`比较次数: ${medianResult.result.comparisons}`);

      // 最小值和最大值
      console.log("\n--- 最小值和最大值同时查找 ---");
      const minMaxResult = findMinMax(arr, compareFn);
      console.log(
        `最小值: ${minMaxResult.min} (索引: ${minMaxResult.minIndex})`
      );
      console.log(
        `最大值: ${minMaxResult.max} (索引: ${minMaxResult.maxIndex})`
      );
      console.log(`比较次数: ${minMaxResult.comparisons}`);

      // 快速选择 vs 线性选择性能比较
      if (arr.length >= 3) {
        const k = Math.ceil(arr.length / 3);
        console.log(`\n--- 第${k}小元素查找算法比较 ---`);

        const quickSelectResult = quickSelect(arr, k, compareFn);
        console.log(`快速选择结果: ${quickSelectResult.element}`);
        console.log(`  比较次数: ${quickSelectResult.comparisons}`);
        console.log(`  递归深度: ${quickSelectResult.recursionDepth}`);

        const linearSelectResult = linearSelect(arr, k, compareFn);
        console.log(`线性选择结果: ${linearSelectResult.element}`);
        console.log(`  比较次数: ${linearSelectResult.comparisons}`);
        console.log(`  递归深度: ${linearSelectResult.recursionDepth}`);
      }
    } catch (error) {
      console.error(`演示过程中发生错误: ${error}`);
    }
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("=== 顺序统计量算法性能测试 ===\n");

    const sizes = [1000, 5000, 10000];

    for (const size of sizes) {
      console.log(`--- 数组大小: ${size} ---`);

      // 生成随机数组
      const arr = Array.from({ length: size }, () =>
        Math.floor(Math.random() * size)
      );

      const k = Math.floor(size / 2); // 找中位数

      // 快速选择性能测试
      const quickSelectStart = performance.now();
      const quickSelectResult = quickSelect(arr, k);
      const quickSelectTime = performance.now() - quickSelectStart;

      // 线性选择性能测试
      const linearSelectStart = performance.now();
      const linearSelectResult = linearSelect(arr, k);
      const linearSelectTime = performance.now() - linearSelectStart;

      console.log(
        `快速选择: ${quickSelectTime.toFixed(2)}ms, 比较: ${
          quickSelectResult.comparisons
        }`
      );
      console.log(
        `线性选择: ${linearSelectTime.toFixed(2)}ms, 比较: ${
          linearSelectResult.comparisons
        }`
      );
      console.log(
        `结果一致: ${
          quickSelectResult.element === linearSelectResult.element ? "✅" : "❌"
        }\n`
      );
    }
  }
}
