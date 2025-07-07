/**
 * 子数组和优化相关的动态规划算法
 * 《算法导论》第15章 动态规划
 */

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
