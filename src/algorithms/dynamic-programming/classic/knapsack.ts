/**
 * 背包问题算法实现
 * 《算法导论》第15章 动态规划
 */

import { KnapsackResult, KnapsackItem } from "../../../types";

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
