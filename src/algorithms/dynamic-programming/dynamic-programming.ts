/**
 * 动态规划算法实现
 * 《算法导论》第15章 动态规划
 *
 * 包含以下算法：
 * 1. 矩阵链乘法
 * 2. 最长公共子序列（LCS）
 * 3. 0-1背包问题
 * 4. 无界背包问题
 * 5. 最长递增子序列（LIS）
 * 6. 编辑距离
 * 7. 最大子数组和
 * 8. 硬币找零
 * 9. 爬楼梯
 * 10. 分割等和子集
 */

import {
  MatrixChainResult,
  LCSResult,
  KnapsackResult,
  KnapsackItem,
} from "../../types";

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
 * 0-1背包问题
 * 时间复杂度：O(nW)
 * 空间复杂度：O(nW)
 */
export function knapsack01(
  items: KnapsackItem[],
  capacity: number
): KnapsackResult {
  const n = items.length;

  // dp[i][w] 表示前i个物品在容量w下的最大价值
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  // 填充DP表
  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w], // 不选择物品i
          dp[i - 1][w - weight] + value // 选择物品i
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // 重构选择的物品
  function buildSelectedItems(): number[] {
    const selected: number[] = [];
    let i = n,
      w = capacity;

    while (i > 0 && w > 0) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.unshift(i - 1); // 物品索引
        w -= items[i - 1].weight;
      }
      i--;
    }

    return selected;
  }

  return {
    maxValue: dp[n][capacity],
    selectedItems: buildSelectedItems(),
    table: dp,
  };
}

/**
 * 无界背包问题（完全背包）
 * 时间复杂度：O(nW)
 * 空间复杂度：O(W)
 */
export function unboundedKnapsack(
  items: KnapsackItem[],
  capacity: number
): KnapsackResult {
  const n = items.length;

  // dp[w] 表示容量w下的最大价值
  const dp: number[] = new Array(capacity + 1).fill(0);
  const itemCount: number[] = new Array(capacity + 1).fill(0);

  for (let w = 1; w <= capacity; w++) {
    for (let i = 0; i < n; i++) {
      const { weight, value } = items[i];

      if (weight <= w && dp[w - weight] + value > dp[w]) {
        dp[w] = dp[w - weight] + value;
        itemCount[w] = i;
      }
    }
  }

  // 重构选择的物品
  function buildSelectedItems(): number[] {
    const selected: number[] = [];
    let w = capacity;

    while (w > 0 && dp[w] > 0) {
      const itemIndex = itemCount[w];
      selected.push(itemIndex);
      w -= items[itemIndex].weight;
    }

    return selected;
  }

  // 创建2D表用于显示
  const table: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let w = 0; w <= capacity; w++) {
    table[n][w] = dp[w];
  }

  return {
    maxValue: dp[capacity],
    selectedItems: buildSelectedItems(),
    table,
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

/**
 * 最大子数组和（Kadane算法）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function maxSubarraySum(nums: number[]): {
  maxSum: number;
  startIndex: number;
  endIndex: number;
  subarray: number[];
} {
  if (nums.length === 0) {
    return { maxSum: 0, startIndex: -1, endIndex: -1, subarray: [] };
  }

  let maxSum = nums[0];
  let currentSum = nums[0];
  let start = 0,
    end = 0,
    tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (currentSum < 0) {
      currentSum = nums[i];
      tempStart = i;
    } else {
      currentSum += nums[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return {
    maxSum,
    startIndex: start,
    endIndex: end,
    subarray: nums.slice(start, end + 1),
  };
}

/**
 * 硬币找零
 * 时间复杂度：O(n * amount)
 * 空间复杂度：O(amount)
 */
export function coinChange(
  coins: number[],
  amount: number
): {
  minCoins: number;
  coinCombination: number[];
  dp: number[];
} {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  const coinUsed: number[] = new Array(amount + 1).fill(-1);

  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        coinUsed[i] = coin;
      }
    }
  }

  // 重构硬币组合
  function buildCoinCombination(): number[] {
    if (dp[amount] === Infinity) return [];

    const combination: number[] = [];
    let remaining = amount;

    while (remaining > 0) {
      const coin = coinUsed[remaining];
      combination.push(coin);
      remaining -= coin;
    }

    return combination.sort((a, b) => b - a);
  }

  return {
    minCoins: dp[amount] === Infinity ? -1 : dp[amount],
    coinCombination: buildCoinCombination(),
    dp,
  };
}

/**
 * 爬楼梯
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function climbStairs(n: number): {
  ways: number;
  dp: number[];
} {
  if (n <= 1) return { ways: 1, dp: [1] };

  const dp: number[] = new Array(n + 1);
  dp[0] = 1;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return {
    ways: dp[n],
    dp,
  };
}

/**
 * 分割等和子集
 * 时间复杂度：O(n * sum)
 * 空间复杂度：O(sum)
 */
export function canPartition(nums: number[]): {
  canPartition: boolean;
  subset1: number[];
  subset2: number[];
} {
  const sum = nums.reduce((acc, num) => acc + num, 0);

  if (sum % 2 !== 0) {
    return { canPartition: false, subset1: [], subset2: [] };
  }

  const target = sum / 2;
  const dp: boolean[] = new Array(target + 1).fill(false);
  const parent: number[][] = Array.from({ length: nums.length }, () =>
    new Array(target + 1).fill(-1)
  );

  dp[0] = true;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    for (let j = target; j >= num; j--) {
      if (dp[j - num]) {
        if (!dp[j]) {
          dp[j] = true;
          parent[i][j] = j - num;
        }
      }
    }
  }

  if (!dp[target]) {
    return { canPartition: false, subset1: [], subset2: [] };
  }

  // 重构子集
  function buildSubsets(): { subset1: number[]; subset2: number[] } {
    const subset1: number[] = [];
    const subset2: number[] = [];
    let currentTarget = target;

    for (let i = nums.length - 1; i >= 0; i--) {
      if (parent[i][currentTarget] !== -1) {
        subset1.push(nums[i]);
        currentTarget = parent[i][currentTarget];
      } else {
        subset2.push(nums[i]);
      }
    }

    return { subset1, subset2 };
  }

  const { subset1, subset2 } = buildSubsets();

  return {
    canPartition: true,
    subset1,
    subset2,
  };
}

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
