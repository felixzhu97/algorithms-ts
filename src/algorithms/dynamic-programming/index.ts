/**
 * 动态规划算法统一导出
 * 《算法导论》第15章 动态规划
 */

// 经典动态规划问题
export { matrixChainMultiplication } from "./classic/matrix-chain";
export {
  knapsack01,
  unboundedKnapsack,
  canPartition,
} from "./classic/knapsack";

// 序列相关问题
export {
  longestCommonSubsequence,
  longestIncreasingSubsequence,
  longestIncreasingSubsequenceOptimized,
  editDistance,
} from "./sequence/lcs";

// 优化问题
export {
  maxSubarraySum,
  coinChange,
  climbStairs,
} from "./optimization/subarray-problems";

// 演示类
export { DynamicProgrammingAlgorithms } from "./demo";

// 类型导出
export type {
  MatrixChainResult,
  LCSResult,
  KnapsackResult,
  KnapsackItem,
} from "../../types";
