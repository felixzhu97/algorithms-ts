/**
 * 矩阵链乘法算法实现
 * 《算法导论》第15章 动态规划
 */

import { MatrixChainResult } from "../../types";

/**
 * 矩阵链乘法
 * 时间复杂度：O(n³)
 * 空间复杂度：O(n²)
 *
 * 给定矩阵链A1, A2, ..., An，找到最优的加括号方式
 * 使得标量乘法次数最少
 */
export function matrixChainMultiplication(
  dimensions: number[]
): MatrixChainResult {
  const n = dimensions.length - 1; // 矩阵数量

  if (n < 1) {
    throw new Error("至少需要一个矩阵");
  }

  // dp[i][j] 表示从矩阵i到矩阵j的最优乘法次数
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // split[i][j] 表示最优分割点
  const split: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(0)
  );

  // l 是链长度
  for (let l = 2; l <= n; l++) {
    for (let i = 0; i < n - l + 1; i++) {
      const j = i + l - 1;
      dp[i][j] = Infinity;

      // 尝试所有可能的分割点
      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] +
          dp[k + 1][j] +
          dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
    }
  }

  // 构建最优加括号方案
  function buildParentheses(i: number, j: number): string {
    if (i === j) {
      return `A${i + 1}`;
    } else {
      const k = split[i][j];
      return `(${buildParentheses(i, k)} × ${buildParentheses(k + 1, j)})`;
    }
  }

  return {
    minOperations: dp[0][n - 1],
    optimalParenthesization: buildParentheses(0, n - 1),
    splitTable: split,
  };
}
