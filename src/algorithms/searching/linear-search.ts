/**
 * 线性搜索算法实现
 * 《算法导论》第2章 算法基础
 */

/**
 * 线性搜索 - 基础版本
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

/**
 * 线性搜索 - 哨兵版本
 * 在数组末尾添加哨兵元素，减少边界检查
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function linearSearchSentinel<T>(arr: T[], target: T): number {
  const last = arr[arr.length - 1];
  arr[arr.length - 1] = target;

  let i = 0;
  while (arr[i] !== target) {
    i++;
  }

  arr[arr.length - 1] = last;

  if (i < arr.length - 1 || last === target) {
    return i;
  }

  return -1;
}

/**
 * 查找所有匹配元素的位置
 * 时间复杂度: O(n)
 * 空间复杂度: O(k) k为匹配元素个数
 */
export function findAllOccurrences<T>(arr: T[], target: T): number[] {
  const indices: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i);
    }
  }

  return indices;
}

/**
 * 查找最大元素的位置
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function findMaximum<T>(arr: T[]): { value: T; index: number } | null {
  if (arr.length === 0) {
    return null;
  }

  let maxValue = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
      maxIndex = i;
    }
  }

  return { value: maxValue, index: maxIndex };
}

/**
 * 查找最小元素的位置
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function findMinimum<T>(arr: T[]): { value: T; index: number } | null {
  if (arr.length === 0) {
    return null;
  }

  let minValue = arr[0];
  let minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }

  return { value: minValue, index: minIndex };
}

/**
 * 使用自定义比较函数进行搜索
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function linearSearchWithComparator<T>(
  arr: T[],
  target: T,
  compareFn: (a: T, b: T) => boolean
): number {
  for (let i = 0; i < arr.length; i++) {
    if (compareFn(arr[i], target)) {
      return i;
    }
  }
  return -1;
}
