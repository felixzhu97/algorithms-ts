/**
 * 序列相关的动态规划算法
 * 《算法导论》第15章 动态规划
 */

import { LCSResult } from "../../types";

/**
 * 最长公共子序列（LCS）
 * 时间复杂度：O(mn)
 * 空间复杂度：O(mn)
 */
export function longestCommonSubsequence(
  text1: string,
  text2: string
): LCSResult {
  const m = text1.length;
  const n = text2.length;

  // dp[i][j] 表示text1[0...i-1]和text2[0...j-1]的LCS长度
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // 填充DP表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 重构LCS序列
  function buildLCS(): string {
    let i = m,
      j = n;
    const lcs: string[] = [];

    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        lcs.unshift(text1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs.join("");
  }

  return {
    length: dp[m][n],
    sequence: buildLCS(),
    table: dp,
  };
}

/**
 * 最长递增子序列（LIS）
 * 时间复杂度：O(n²) 标准DP版本
 * 空间复杂度：O(n)
 */
export function longestIncreasingSubsequence(nums: number[]): {
  length: number;
  sequence: number[];
  dp: number[];
} {
  const n = nums.length;
  if (n === 0) return { length: 0, sequence: [], dp: [] };

  // dp[i] 表示以nums[i]结尾的LIS长度
  const dp: number[] = new Array(n).fill(1);
  const prev: number[] = new Array(n).fill(-1);

  let maxLength = 1;
  let maxIndex = 0;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }

    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }

  // 重构LIS序列
  function buildLIS(): number[] {
    const lis: number[] = [];
    let current = maxIndex;

    while (current !== -1) {
      lis.unshift(nums[current]);
      current = prev[current];
    }

    return lis;
  }

  return {
    length: maxLength,
    sequence: buildLIS(),
    dp,
  };
}

/**
 * 最长递增子序列（优化版本）
 * 时间复杂度：O(n log n) 使用二分查找
 * 空间复杂度：O(n)
 */
export function longestIncreasingSubsequenceOptimized(nums: number[]): {
  length: number;
  sequence: number[];
} {
  const n = nums.length;
  if (n === 0) return { length: 0, sequence: [] };

  const tails: number[] = []; // tails[i]是长度为i+1的LIS的最小结尾
  const prev: number[] = new Array(n).fill(-1);
  const indices: number[] = []; // 对应tails的索引

  for (let i = 0; i < n; i++) {
    const num = nums[i];

    // 二分查找插入位置
    let left = 0,
      right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === tails.length) {
      tails.push(num);
      indices.push(i);
    } else {
      tails[left] = num;
      indices[left] = i;
    }

    if (left > 0) {
      prev[i] = indices[left - 1];
    }
  }

  // 重构序列
  function buildLIS(): number[] {
    const lis: number[] = [];
    let current = indices[indices.length - 1];

    while (current !== -1) {
      lis.unshift(nums[current]);
      current = prev[current];
    }

    return lis;
  }

  return {
    length: tails.length,
    sequence: buildLIS(),
  };
}

/**
 * 编辑距离（Levenshtein距离）
 * 时间复杂度：O(mn)
 * 空间复杂度：O(mn)
 */
export function editDistance(
  word1: string,
  word2: string
): {
  distance: number;
  operations: string[];
  table: number[][];
} {
  const m = word1.length;
  const n = word2.length;

  // dp[i][j] 表示word1[0...i-1]转换为word2[0...j-1]的最小编辑距离
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // 初始化边界
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // 填充DP表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // 删除
          dp[i][j - 1] + 1, // 插入
          dp[i - 1][j - 1] + 1 // 替换
        );
      }
    }
  }

  // 重构操作序列
  function buildOperations(): string[] {
    const operations: string[] = [];
    let i = m,
      j = n;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
        i--;
        j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        operations.unshift(`替换 '${word1[i - 1]}' 为 '${word2[j - 1]}'`);
        i--;
        j--;
      } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        operations.unshift(`删除 '${word1[i - 1]}'`);
        i--;
      } else {
        operations.unshift(`插入 '${word2[j - 1]}'`);
        j--;
      }
    }

    return operations;
  }

  return {
    distance: dp[m][n],
    operations: buildOperations(),
    table: dp,
  };
}
