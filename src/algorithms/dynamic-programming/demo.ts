/**
 * 动态规划算法演示类
 */

import { matrixChainMultiplication } from "./classic/matrix-chain";
import { knapsack01, canPartition } from "./classic/knapsack";
import {
  longestCommonSubsequence,
  longestIncreasingSubsequence,
  longestIncreasingSubsequenceOptimized,
  editDistance,
} from "./sequence/lcs";
import {
  maxSubarraySum,
  coinChange,
  climbStairs,
} from "./optimization/subarray-problems";
import { KnapsackItem } from "../../types";

/**
 * 动态规划算法工具类
 */
export class DynamicProgrammingAlgorithms {
  /**
   * 演示所有动态规划算法
   */
  static demonstrateAll(): void {
    console.log("=== 动态规划算法演示 ===\n");

    // 矩阵链乘法演示
    console.log("--- 矩阵链乘法 ---");
    const matrixDims = [40, 20, 30, 10, 30];
    const matrixResult = matrixChainMultiplication(matrixDims);
    console.log(`矩阵维度: [${matrixDims.join(", ")}]`);
    console.log(`最少标量乘法次数: ${matrixResult.minOperations}`);
    console.log(`最优括号方案: ${matrixResult.optimalParenthesization}`);

    // LCS演示
    console.log("\n--- 最长公共子序列 ---");
    const text1 = "ABCDGH";
    const text2 = "AEDFHR";
    const lcsResult = longestCommonSubsequence(text1, text2);
    console.log(`字符串1: ${text1}`);
    console.log(`字符串2: ${text2}`);
    console.log(`LCS长度: ${lcsResult.length}`);
    console.log(`LCS序列: ${lcsResult.sequence}`);

    // 0-1背包演示
    console.log("\n--- 0-1背包问题 ---");
    const items: KnapsackItem[] = [
      { weight: 10, value: 60, name: "物品1" },
      { weight: 20, value: 100, name: "物品2" },
      { weight: 30, value: 120, name: "物品3" },
    ];
    const capacity = 50;
    const knapsackResult = knapsack01(items, capacity);
    console.log(`背包容量: ${capacity}`);
    console.log(`最大价值: ${knapsackResult.maxValue}`);
    console.log(
      `选择的物品: ${knapsackResult.selectedItems
        .map((i) => items[i].name)
        .join(", ")}`
    );

    // LIS演示
    console.log("\n--- 最长递增子序列 ---");
    const nums = [10, 9, 2, 5, 3, 7, 101, 18];
    const lisResult = longestIncreasingSubsequence(nums);
    const lisOptResult = longestIncreasingSubsequenceOptimized(nums);
    console.log(`数组: [${nums.join(", ")}]`);
    console.log(`LIS长度: ${lisResult.length}`);
    console.log(`LIS序列: [${lisResult.sequence.join(", ")}]`);
    console.log(
      `优化算法验证: ${lisResult.length === lisOptResult.length ? "✅" : "❌"}`
    );

    // 编辑距离演示
    console.log("\n--- 编辑距离 ---");
    const word1 = "horse";
    const word2 = "ros";
    const editResult = editDistance(word1, word2);
    console.log(`单词1: ${word1}`);
    console.log(`单词2: ${word2}`);
    console.log(`编辑距离: ${editResult.distance}`);
    console.log(`操作序列: ${editResult.operations.join(" → ")}`);

    // 最大子数组和演示
    console.log("\n--- 最大子数组和 ---");
    const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const maxSubResult = maxSubarraySum(arr);
    console.log(`数组: [${arr.join(", ")}]`);
    console.log(`最大子数组和: ${maxSubResult.maxSum}`);
    console.log(`子数组: [${maxSubResult.subarray.join(", ")}]`);
    console.log(`位置: [${maxSubResult.startIndex}, ${maxSubResult.endIndex}]`);

    // 硬币找零演示
    console.log("\n--- 硬币找零 ---");
    const coins = [1, 3, 4];
    const amount = 6;
    const coinResult = coinChange(coins, amount);
    console.log(`硬币面额: [${coins.join(", ")}]`);
    console.log(`金额: ${amount}`);
    console.log(`最少硬币数: ${coinResult.minCoins}`);
    console.log(`硬币组合: [${coinResult.coinCombination.join(", ")}]`);

    // 爬楼梯演示
    console.log("\n--- 爬楼梯 ---");
    const n = 10;
    const stairsResult = climbStairs(n);
    console.log(`楼梯阶数: ${n}`);
    console.log(`爬法总数: ${stairsResult.ways}`);

    // 分割等和子集演示
    console.log("\n--- 分割等和子集 ---");
    const partitionNums = [1, 5, 11, 5];
    const partitionResult = canPartition(partitionNums);
    console.log(`数组: [${partitionNums.join(", ")}]`);
    console.log(`可以分割: ${partitionResult.canPartition ? "是" : "否"}`);
    if (partitionResult.canPartition) {
      console.log(`子集1: [${partitionResult.subset1.join(", ")}]`);
      console.log(`子集2: [${partitionResult.subset2.join(", ")}]`);
    }
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("\n=== 动态规划算法性能测试 ===\n");

    // LCS性能测试
    console.log("--- LCS性能测试 ---");
    const longText1 = "A".repeat(1000) + "B".repeat(500) + "C".repeat(500);
    const longText2 = "A".repeat(500) + "B".repeat(1000) + "C".repeat(500);

    const lcsStart = performance.now();
    const lcsResult = longestCommonSubsequence(longText1, longText2);
    const lcsTime = performance.now() - lcsStart;

    console.log(`文本长度: ${longText1.length} × ${longText2.length}`);
    console.log(`LCS长度: ${lcsResult.length}`);
    console.log(`耗时: ${lcsTime.toFixed(2)}ms`);

    // LIS性能测试
    console.log("\n--- LIS性能测试 ---");
    const largeArray = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 1000)
    );

    const lisStart = performance.now();
    const lisResult = longestIncreasingSubsequence(largeArray);
    const lisTime = performance.now() - lisStart;

    const lisOptStart = performance.now();
    const lisOptResult = longestIncreasingSubsequenceOptimized(largeArray);
    const lisOptTime = performance.now() - lisOptStart;

    console.log(`数组长度: ${largeArray.length}`);
    console.log(`LIS长度: ${lisResult.length}`);
    console.log(`标准算法耗时: ${lisTime.toFixed(2)}ms`);
    console.log(`优化算法耗时: ${lisOptTime.toFixed(2)}ms`);
    console.log(`性能提升: ${(lisTime / lisOptTime).toFixed(2)}x`);

    // 背包问题性能测试
    console.log("\n--- 背包问题性能测试 ---");
    const largeItems: KnapsackItem[] = Array.from({ length: 100 }, (_, i) => ({
      weight: Math.floor(Math.random() * 50) + 1,
      value: Math.floor(Math.random() * 100) + 1,
      name: `物品${i + 1}`,
    }));
    const largeCapacity = 500;

    const knapsackStart = performance.now();
    const knapsackResult = knapsack01(largeItems, largeCapacity);
    const knapsackTime = performance.now() - knapsackStart;

    console.log(`物品数量: ${largeItems.length}`);
    console.log(`背包容量: ${largeCapacity}`);
    console.log(`最大价值: ${knapsackResult.maxValue}`);
    console.log(`选择物品数: ${knapsackResult.selectedItems.length}`);
    console.log(`耗时: ${knapsackTime.toFixed(2)}ms`);
  }
}
