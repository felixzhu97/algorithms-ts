import { SortResult } from "../../types";

/**
 * 线性排序算法
 * 《算法导论》第8章 线性时间排序
 *
 * 这些算法不基于比较，在特定条件下可以达到线性时间复杂度
 */

/**
 * 计数排序
 * 适用于已知输入范围的整数排序
 *
 * 时间复杂度：O(n + k)，其中k是数值范围
 * 空间复杂度：O(k)
 * 稳定性：稳定排序
 *
 * 前提条件：
 * - 输入是非负整数
 * - 数值范围k不能太大
 *
 * @param arr 要排序的数组（非负整数）
 * @param maxValue 数组中的最大值（可选，会自动计算）
 * @returns 排序结果
 */
export function countingSort(
  arr: number[],
  maxValue?: number
): SortResult<number> {
  if (arr.length <= 1) {
    return {
      sorted: [...arr],
      comparisons: 0,
      swaps: 0,
      timeComplexity: "O(n + k)",
      spaceComplexity: "O(k)",
    };
  }

  // 检查输入是否为非负整数
  for (const num of arr) {
    if (num < 0 || !Number.isInteger(num)) {
      throw new Error("计数排序只适用于非负整数");
    }
  }

  // 找到最大值
  const k = maxValue !== undefined ? maxValue : Math.max(...arr);

  // 计数数组，索引表示数值，值表示出现次数
  const count = new Array(k + 1).fill(0);
  const result = new Array(arr.length);

  let operations = 0; // 记录操作次数

  // 第一步：统计每个元素的出现次数
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    operations++;
  }

  // 第二步：计算累积计数（每个元素在输出数组中的位置）
  for (let i = 1; i <= k; i++) {
    count[i] += count[i - 1];
    operations++;
  }

  // 第三步：从右到左遍历原数组，构建输出数组（保证稳定性）
  for (let i = arr.length - 1; i >= 0; i--) {
    result[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
    operations++;
  }

  return {
    sorted: result,
    comparisons: 0, // 计数排序不需要比较
    swaps: operations,
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
  };
}

/**
 * 基数排序
 * 适用于固定位数的整数排序
 *
 * 时间复杂度：O(d(n + k))，其中d是位数，k是基数
 * 空间复杂度：O(n + k)
 * 稳定性：稳定排序
 *
 * @param arr 要排序的数组（非负整数）
 * @param radix 基数，默认为10（十进制）
 * @returns 排序结果
 */
export function radixSort(
  arr: number[],
  radix: number = 10
): SortResult<number> {
  if (arr.length <= 1) {
    return {
      sorted: [...arr],
      comparisons: 0,
      swaps: 0,
      timeComplexity: "O(d(n + k))",
      spaceComplexity: "O(n + k)",
    };
  }

  // 检查输入
  for (const num of arr) {
    if (num < 0 || !Number.isInteger(num)) {
      throw new Error("基数排序只适用于非负整数");
    }
  }

  let result = [...arr];
  let totalOperations = 0;

  // 找到最大值，确定需要排序的位数
  const maxValue = Math.max(...arr);
  // 处理maxValue为0的情况，并修正浮点数精度问题
  const digits =
    maxValue === 0
      ? 1
      : Math.floor(Math.log(maxValue) / Math.log(radix) + 1e-10) + 1;

  /**
   * 获取数字在指定位置的数字
   * @param num 数字
   * @param digitIndex 位数索引（从0开始，0表示个位）
   * @returns 该位置的数字
   */
  function getDigit(num: number, digitIndex: number): number {
    return Math.floor(num / Math.pow(radix, digitIndex)) % radix;
  }

  /**
   * 对指定位数进行计数排序
   * @param arr 数组
   * @param digitIndex 位数索引
   * @returns 排序后的数组
   */
  function countingSortByDigit(arr: number[], digitIndex: number): number[] {
    const count = new Array(radix).fill(0);
    const output = new Array(arr.length);

    // 统计每个数字在当前位上的出现次数
    for (let i = 0; i < arr.length; i++) {
      const digit = getDigit(arr[i], digitIndex);
      count[digit]++;
      totalOperations++;
    }

    // 计算累积计数
    for (let i = 1; i < radix; i++) {
      count[i] += count[i - 1];
      totalOperations++;
    }

    // 构建输出数组（从右到左保证稳定性）
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = getDigit(arr[i], digitIndex);
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      totalOperations++;
    }

    return output;
  }

  // 从最低位开始，逐位排序
  for (let i = 0; i < digits; i++) {
    result = countingSortByDigit(result, i);
  }

  return {
    sorted: result,
    comparisons: 0,
    swaps: totalOperations,
    timeComplexity: "O(d(n + k))",
    spaceComplexity: "O(n + k)",
  };
}

/**
 * 桶排序
 * 适用于均匀分布的数据
 *
 * 时间复杂度：
 * - 平均情况：O(n + k)
 * - 最坏情况：O(n²)（当所有元素都落在同一个桶中时）
 * 空间复杂度：O(n + k)
 * 稳定性：取决于桶内排序算法的稳定性
 *
 * @param arr 要排序的数组（0到1之间的浮点数，或通过normalize转换）
 * @param bucketCount 桶的数量，默认为数组长度
 * @param normalize 是否需要将数据标准化到[0,1)区间
 * @returns 排序结果
 */
export function bucketSort(
  arr: number[],
  bucketCount?: number,
  normalize: boolean = false
): SortResult<number> {
  if (arr.length <= 1) {
    return {
      sorted: [...arr],
      comparisons: 0,
      swaps: 0,
      timeComplexity: "O(n + k)",
      spaceComplexity: "O(n + k)",
    };
  }

  const n = arr.length;
  const numBuckets = bucketCount || n;
  let totalComparisons = 0;
  let totalSwaps = 0;

  let workingArray = [...arr];
  let min = 0,
    max = 1;

  // 如果需要标准化，将数据映射到[0,1)区间
  if (normalize) {
    min = Math.min(...arr);
    max = Math.max(...arr);
    const range = max - min;

    if (range === 0) {
      return {
        sorted: [...arr],
        comparisons: 0,
        swaps: 0,
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(n + k)",
      };
    }

    workingArray = arr.map((x) => (x - min) / range);
  }

  // 创建桶
  const buckets: number[][] = Array.from({ length: numBuckets }, () => []);

  // 将元素分配到桶中
  for (let i = 0; i < workingArray.length; i++) {
    let bucketIndex = Math.floor(workingArray[i] * numBuckets);

    // 处理边界情况：值等于1的情况
    if (bucketIndex >= numBuckets) {
      bucketIndex = numBuckets - 1;
    }

    buckets[bucketIndex].push(workingArray[i]);
    totalSwaps++;
  }

  /**
   * 桶内插入排序（简化版，用于演示）
   * @param bucket 桶
   * @returns 排序统计
   */
  function insertionSortBucket(bucket: number[]): {
    comparisons: number;
    swaps: number;
  } {
    let comparisons = 0;
    let swaps = 0;

    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;

      while (j >= 0 && bucket[j] > key) {
        comparisons++;
        bucket[j + 1] = bucket[j];
        swaps++;
        j--;
      }

      if (j >= 0) comparisons++; // 最后一次比较
      bucket[j + 1] = key;
    }

    return { comparisons, swaps };
  }

  // 对每个桶进行排序
  for (const bucket of buckets) {
    if (bucket.length > 1) {
      const stats = insertionSortBucket(bucket);
      totalComparisons += stats.comparisons;
      totalSwaps += stats.swaps;
    }
  }

  // 连接所有桶
  const result: number[] = [];
  for (const bucket of buckets) {
    result.push(...bucket);
  }

  // 如果进行了标准化，需要将结果映射回原始范围
  if (normalize) {
    const range = max - min;
    for (let i = 0; i < result.length; i++) {
      result[i] = result[i] * range + min;
      // 修正浮点数精度问题
      result[i] = Math.round(result[i] * 1e10) / 1e10;
    }
  }

  return {
    sorted: result,
    comparisons: totalComparisons,
    swaps: totalSwaps,
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(n + k)",
  };
}

/**
 * 桶排序的变体：用于整数排序
 * 自动确定桶的范围和数量
 *
 * @param arr 要排序的整数数组
 * @param bucketSize 每个桶的大小（范围），默认为5
 * @returns 排序结果
 */
export function bucketSortInteger(
  arr: number[],
  bucketSize: number = 5
): SortResult<number> {
  if (arr.length <= 1) {
    return {
      sorted: [...arr],
      comparisons: 0,
      swaps: 0,
      timeComplexity: "O(n + k)",
      spaceComplexity: "O(n + k)",
    };
  }

  // 检查输入
  for (const num of arr) {
    if (!Number.isInteger(num)) {
      throw new Error("此函数只适用于整数");
    }
  }

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;

  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  let totalComparisons = 0;
  let totalSwaps = 0;

  // 分配元素到桶
  for (const num of arr) {
    const bucketIndex = Math.floor((num - min) / bucketSize);
    buckets[bucketIndex].push(num);
    totalSwaps++;
  }

  // 对每个桶排序并收集结果
  const result: number[] = [];
  for (const bucket of buckets) {
    if (bucket.length > 0) {
      // 使用简单的插入排序
      for (let i = 1; i < bucket.length; i++) {
        const key = bucket[i];
        let j = i - 1;
        while (j >= 0 && bucket[j] > key) {
          totalComparisons++;
          bucket[j + 1] = bucket[j];
          totalSwaps++;
          j--;
        }
        if (j >= 0) totalComparisons++;
        bucket[j + 1] = key;
      }
      result.push(...bucket);
    }
  }

  return {
    sorted: result,
    comparisons: totalComparisons,
    swaps: totalSwaps,
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(n + k)",
  };
}

/**
 * 基数排序的字符串版本
 * 适用于等长字符串的排序
 *
 * @param arr 要排序的字符串数组（必须等长）
 * @param charSet 字符集大小，默认为256（ASCII）
 * @returns 排序后的字符串数组
 */
export function radixSortString(
  arr: string[],
  charSet: number = 256
): { sorted: string[]; operations: number } {
  if (arr.length <= 1) {
    return { sorted: [...arr], operations: 0 };
  }

  // 检查字符串长度是否一致
  const stringLength = arr[0].length;
  for (const str of arr) {
    if (str.length !== stringLength) {
      throw new Error("基数排序要求所有字符串长度相同");
    }
  }

  let result = [...arr];
  let operations = 0;

  /**
   * 对指定位置的字符进行计数排序
   */
  function countingSortByChar(arr: string[], charIndex: number): string[] {
    const count = new Array(charSet).fill(0);
    const output = new Array(arr.length);

    // 统计字符出现次数
    for (const str of arr) {
      const charCode = str.charCodeAt(charIndex);
      count[charCode]++;
      operations++;
    }

    // 计算累积计数
    for (let i = 1; i < charSet; i++) {
      count[i] += count[i - 1];
      operations++;
    }

    // 构建输出数组
    for (let i = arr.length - 1; i >= 0; i--) {
      const charCode = arr[i].charCodeAt(charIndex);
      output[count[charCode] - 1] = arr[i];
      count[charCode]--;
      operations++;
    }

    return output;
  }

  // 从最右边的字符开始排序
  for (let i = stringLength - 1; i >= 0; i--) {
    result = countingSortByChar(result, i);
  }

  return { sorted: result, operations };
}
