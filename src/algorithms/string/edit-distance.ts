/**
 * 编辑距离算法实现
 * 《算法导论》第15章 动态规划
 */

export interface EditDistanceResult {
  distance: number;
  operations: string[];
  matrix: number[][];
}

/**
 * 计算两个字符串的编辑距离（Levenshtein距离）
 * 允许的操作：插入、删除、替换
 * 时间复杂度: O(mn)
 * 空间复杂度: O(mn)
 */
export function editDistance(str1: string, str2: string): EditDistanceResult {
  const m = str1.length;
  const n = str2.length;

  // 创建DP表
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // 初始化边界条件
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // 删除所有字符
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // 插入所有字符
  }

  // 填充DP表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // 字符相同，不需要操作
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // 删除
            dp[i][j - 1], // 插入
            dp[i - 1][j - 1] // 替换
          );
      }
    }
  }

  // 回溯构造操作序列
  const operations: string[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
      // 字符相同，不需要操作
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      // 替换操作
      operations.unshift(
        `替换 '${str1[i - 1]}' 为 '${str2[j - 1]}' 在位置 ${i - 1}`
      );
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      // 删除操作
      operations.unshift(`删除 '${str1[i - 1]}' 在位置 ${i - 1}`);
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      // 插入操作
      operations.unshift(`插入 '${str2[j - 1]}' 在位置 ${i}`);
      j--;
    }
  }

  return {
    distance: dp[m][n],
    operations,
    matrix: dp,
  };
}

/**
 * 计算编辑距离 - 空间优化版本
 * 只返回距离值，不保存操作序列
 * 时间复杂度: O(mn)
 * 空间复杂度: O(min(m, n))
 */
export function editDistanceOptimized(str1: string, str2: string): number {
  let m = str1.length;
  let n = str2.length;

  // 确保 str1 是较短的字符串
  if (m > n) {
    [str1, str2] = [str2, str1];
    [m, n] = [n, m];
  }

  let prev = Array.from({ length: m + 1 }, (_, i) => i);
  let curr = new Array(m + 1);

  for (let j = 1; j <= n; j++) {
    curr[0] = j;

    for (let i = 1; i <= m; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        curr[i] = prev[i - 1];
      } else {
        curr[i] =
          1 +
          Math.min(
            prev[i], // 删除
            curr[i - 1], // 插入
            prev[i - 1] // 替换
          );
      }
    }

    [prev, curr] = [curr, prev];
  }

  return prev[m];
}

/**
 * 计算仅允许插入和删除操作的编辑距离
 * 时间复杂度: O(mn)
 * 空间复杂度: O(mn)
 */
export function editDistanceInsertDelete(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // 初始化边界条件
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // 填充DP表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // 删除
            dp[i][j - 1] // 插入
          );
      }
    }
  }

  return dp[m][n];
}

/**
 * 计算最长公共子序列长度
 * 与编辑距离相关：editDistance = m + n - 2 * LCS
 */
export function longestCommonSubsequenceLength(
  str1: string,
  str2: string
): number {
  const m = str1.length;
  const n = str2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * 使用LCS计算编辑距离（仅插入删除）
 */
export function editDistanceUsingLCS(str1: string, str2: string): number {
  const lcsLength = longestCommonSubsequenceLength(str1, str2);
  return str1.length + str2.length - 2 * lcsLength;
}
