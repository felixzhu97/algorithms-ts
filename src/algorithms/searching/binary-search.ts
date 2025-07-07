/**
 * 二分搜索算法实现
 * 《算法导论》第2章 算法基础
 */

/**
 * 二分搜索 - 迭代版本
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 */
export function binarySearch<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1; // 未找到
}

/**
 * 二分搜索 - 递归版本
 * 时间复杂度: O(log n)
 * 空间复杂度: O(log n)
 */
export function binarySearchRecursive<T>(
  arr: T[],
  target: T,
  left: number = 0,
  right: number = arr.length - 1
): number {
  if (left > right) {
    return -1;
  }

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}

/**
 * 查找第一个大于等于目标值的元素位置
 * 时间复杂度: O(log n)
 */
export function lowerBound<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

/**
 * 查找第一个大于目标值的元素位置
 * 时间复杂度: O(log n)
 */
export function upperBound<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

/**
 * 在旋转数组中搜索
 * 时间复杂度: O(log n)
 */
export function searchInRotatedArray<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    // 判断左半部分是否有序
    if (arr[left] <= arr[mid]) {
      if (target >= arr[left] && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // 右半部分有序
      if (target > arr[mid] && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
