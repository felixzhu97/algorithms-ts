/**
 * 最大子数组问题 - 分治算法实现
 * 《算法导论》第4章 分治策略
 */

export interface MaxSubarrayResult {
  left: number;
  right: number;
  sum: number;
}

/**
 * 查找跨越中点的最大子数组
 * @param arr 数组
 * @param low 左边界
 * @param mid 中点
 * @param high 右边界
 * @returns 最大子数组结果
 */
function findMaxCrossingSubarray(
  arr: number[],
  low: number,
  mid: number,
  high: number
): MaxSubarrayResult {
  let leftSum = -Infinity;
  let sum = 0;
  let maxLeft = mid;

  // 向左扩展
  for (let i = mid; i >= low; i--) {
    sum += arr[i];
    if (sum > leftSum) {
      leftSum = sum;
      maxLeft = i;
    }
  }

  let rightSum = -Infinity;
  sum = 0;
  let maxRight = mid + 1;

  // 向右扩展
  for (let j = mid + 1; j <= high; j++) {
    sum += arr[j];
    if (sum > rightSum) {
      rightSum = sum;
      maxRight = j;
    }
  }

  return {
    left: maxLeft,
    right: maxRight,
    sum: leftSum + rightSum,
  };
}

/**
 * 最大子数组问题 - 分治算法
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(log n)
 * @param arr 数组
 * @param low 左边界
 * @param high 右边界
 * @returns 最大子数组结果
 */
export function findMaximumSubarray(
  arr: number[],
  low: number = 0,
  high: number = arr.length - 1
): MaxSubarrayResult {
  if (high === low) {
    // 基础情况：只有一个元素
    return { left: low, right: high, sum: arr[low] };
  } else {
    const mid = Math.floor((low + high) / 2);

    // 递归求解左半部分
    const leftResult = findMaximumSubarray(arr, low, mid);

    // 递归求解右半部分
    const rightResult = findMaximumSubarray(arr, mid + 1, high);

    // 求解跨越中点的子数组
    const crossResult = findMaxCrossingSubarray(arr, low, mid, high);

    // 返回三者中的最大值
    if (
      leftResult.sum >= rightResult.sum &&
      leftResult.sum >= crossResult.sum
    ) {
      return leftResult;
    } else if (
      rightResult.sum >= leftResult.sum &&
      rightResult.sum >= crossResult.sum
    ) {
      return rightResult;
    } else {
      return crossResult;
    }
  }
}

/**
 * 最大子数组问题 - Kadane算法（动态规划）
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 * @param arr 数组
 * @returns 最大子数组结果
 */
export function findMaximumSubarrayKadane(arr: number[]): MaxSubarrayResult {
  if (arr.length === 0) {
    throw new Error("数组不能为空");
  }

  let maxSum = arr[0];
  let currentSum = arr[0];
  let left = 0;
  let right = 0;
  let tempLeft = 0;

  for (let i = 1; i < arr.length; i++) {
    if (currentSum < 0) {
      currentSum = arr[i];
      tempLeft = i;
    } else {
      currentSum += arr[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      left = tempLeft;
      right = i;
    }
  }

  return { left, right, sum: maxSum };
}
