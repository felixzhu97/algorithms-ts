/**
 * 贪心算法实现
 * 《算法导论》第16章 贪心算法
 *
 * 包含以下算法：
 * 1. 活动选择问题
 * 2. 霍夫曼编码
 * 3. 分数背包问题
 * 4. 任务调度问题
 * 5. 最小硬币数
 * 6. 跳跃游戏
 * 7. 加油站问题
 * 8. 区间覆盖问题
 */

import { Heap } from "../../data-structures/trees/heap";
import {
  Activity,
  ActivitySelectionResult,
  HuffmanNode,
  HuffmanResult,
  KnapsackItem,
} from "../../types";

/**
 * 活动选择问题
 * 时间复杂度：O(n log n) 排序
 * 空间复杂度：O(1)
 *
 * 选择最多的互不重叠的活动
 */
export function activitySelection(
  activities: Activity[]
): ActivitySelectionResult {
  if (activities.length === 0) {
    return { selectedActivities: [], maxCount: 0 };
  }

  // 按结束时间排序
  const sortedActivities = [...activities].sort((a, b) => a.finish - b.finish);

  const selectedActivities: Activity[] = [sortedActivities[0]];
  let lastFinishTime = sortedActivities[0].finish;

  for (let i = 1; i < sortedActivities.length; i++) {
    const activity = sortedActivities[i];

    // 如果当前活动的开始时间 >= 上一个活动的结束时间，则可以选择
    if (activity.start >= lastFinishTime) {
      selectedActivities.push(activity);
      lastFinishTime = activity.finish;
    }
  }

  return {
    selectedActivities,
    maxCount: selectedActivities.length,
  };
}

/**
 * 递归版本的活动选择
 */
export function activitySelectionRecursive(
  activities: Activity[],
  startIndex: number = 0,
  lastFinishTime: number = 0
): Activity[] {
  if (startIndex >= activities.length) {
    return [];
  }

  // 找到第一个开始时间 >= lastFinishTime 的活动
  let currentIndex = startIndex;
  while (
    currentIndex < activities.length &&
    activities[currentIndex].start < lastFinishTime
  ) {
    currentIndex++;
  }

  if (currentIndex >= activities.length) {
    return [];
  }

  const currentActivity = activities[currentIndex];
  const restActivities = activitySelectionRecursive(
    activities,
    currentIndex + 1,
    currentActivity.finish
  );

  return [currentActivity, ...restActivities];
}

/**
 * 霍夫曼编码
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export function huffmanCoding(text: string): HuffmanResult {
  if (text.length === 0) {
    return {
      codes: new Map(),
      tree: { frequency: 0, isLeaf: true },
      encodedText: "",
      compressionRatio: 0,
    };
  }

  // 统计字符频率
  const frequencyMap = new Map<string, number>();
  for (const char of text) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }

  // 特殊情况：只有一个字符
  if (frequencyMap.size === 1) {
    const char = Array.from(frequencyMap.keys())[0];
    const codes = new Map([[char, "0"]]);

    return {
      codes,
      tree: { char, frequency: frequencyMap.get(char)!, isLeaf: true },
      encodedText: "0".repeat(text.length),
      compressionRatio: (text.length * 8) / text.length,
    };
  }

  // 创建优先队列（最小堆）
  const pq = new Heap<HuffmanNode>((a, b) => a.frequency - b.frequency);

  // 为每个字符创建叶子节点
  for (const [char, frequency] of frequencyMap) {
    pq.insert({
      char,
      frequency,
      isLeaf: true,
    });
  }

  // 构建霍夫曼树
  while (pq.size() > 1) {
    const left = pq.extract()!;
    const right = pq.extract()!;

    const mergedNode: HuffmanNode = {
      frequency: left.frequency + right.frequency,
      left,
      right,
      isLeaf: false,
    };

    pq.insert(mergedNode);
  }

  const root = pq.extract()!;

  // 生成编码表
  const codes = new Map<string, string>();

  function generateCodes(node: HuffmanNode, code: string = ""): void {
    if (node.isLeaf && node.char) {
      codes.set(node.char, code || "0"); // 单字符情况
    } else {
      if (node.left) generateCodes(node.left, code + "0");
      if (node.right) generateCodes(node.right, code + "1");
    }
  }

  generateCodes(root);

  // 编码文本
  const encodedText = text
    .split("")
    .map((char) => codes.get(char)!)
    .join("");

  // 计算压缩比
  const originalBits = text.length * 8; // 假设原始字符用8位表示
  const compressedBits = encodedText.length;
  const compressionRatio = originalBits / compressedBits;

  return {
    codes,
    tree: root,
    encodedText,
    compressionRatio,
  };
}

/**
 * 霍夫曼解码
 */
export function huffmanDecoding(
  encodedText: string,
  tree: HuffmanNode
): string {
  if (!encodedText || tree.isLeaf) {
    return tree.char ? tree.char.repeat(encodedText.length) : "";
  }

  let result = "";
  let current = tree;

  for (const bit of encodedText) {
    if (bit === "0") {
      current = current.left!;
    } else {
      current = current.right!;
    }

    if (current.isLeaf) {
      result += current.char!;
      current = tree;
    }
  }

  return result;
}

/**
 * 分数背包问题
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export function fractionalKnapsack(
  items: KnapsackItem[],
  capacity: number
): {
  maxValue: number;
  selectedItems: Array<{ item: KnapsackItem; fraction: number }>;
} {
  // 按价值密度排序
  const sortedItems = items
    .map((item, index) => ({
      ...item,
      index,
      density: item.value / item.weight,
    }))
    .sort((a, b) => b.density - a.density);

  const selectedItems: Array<{ item: KnapsackItem; fraction: number }> = [];
  let remainingCapacity = capacity;
  let maxValue = 0;

  for (const item of sortedItems) {
    if (remainingCapacity >= item.weight) {
      // 完全选择该物品
      selectedItems.push({ item, fraction: 1 });
      remainingCapacity -= item.weight;
      maxValue += item.value;
    } else if (remainingCapacity > 0) {
      // 部分选择该物品
      const fraction = remainingCapacity / item.weight;
      selectedItems.push({ item, fraction });
      maxValue += item.value * fraction;
      remainingCapacity = 0;
      break;
    }
  }

  return { maxValue, selectedItems };
}

/**
 * 任务调度问题（最小化最大完成时间）
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export interface Task {
  id: number;
  duration: number;
  name?: string;
}

export function taskScheduling(
  tasks: Task[],
  numMachines: number
): {
  schedule: Task[][];
  makespan: number;
} {
  // 按任务持续时间降序排序
  const sortedTasks = [...tasks].sort((a, b) => b.duration - a.duration);

  // 初始化机器
  const machines: Task[][] = Array.from({ length: numMachines }, () => []);
  const machineTimes: number[] = new Array(numMachines).fill(0);

  // 贪心分配：每次将任务分配给当前负载最轻的机器
  for (const task of sortedTasks) {
    // 找到负载最轻的机器
    let minIndex = 0;
    for (let i = 1; i < numMachines; i++) {
      if (machineTimes[i] < machineTimes[minIndex]) {
        minIndex = i;
      }
    }

    machines[minIndex].push(task);
    machineTimes[minIndex] += task.duration;
  }

  const makespan = Math.max(...machineTimes);

  return { schedule: machines, makespan };
}

/**
 * 最小硬币数（贪心版本，适用于标准币制）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function greedyCoinChange(
  coins: number[],
  amount: number
): {
  minCoins: number;
  coinCombination: number[];
} {
  // 按面额降序排序
  const sortedCoins = [...coins].sort((a, b) => b - a);

  const coinCombination: number[] = [];
  let remainingAmount = amount;

  for (const coin of sortedCoins) {
    const count = Math.floor(remainingAmount / coin);

    for (let i = 0; i < count; i++) {
      coinCombination.push(coin);
    }

    remainingAmount %= coin;
  }

  return {
    minCoins: remainingAmount === 0 ? coinCombination.length : -1,
    coinCombination: remainingAmount === 0 ? coinCombination : [],
  };
}

/**
 * 跳跃游戏
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function canJump(nums: number[]): {
  canReach: boolean;
  minJumps?: number;
  jumpPath?: number[];
} {
  const n = nums.length;
  if (n <= 1) return { canReach: true, minJumps: 0, jumpPath: [0] };

  let maxReach = 0;
  let jumps = 0;
  let currentEnd = 0;
  const jumpPath: number[] = [0];

  for (let i = 0; i < n - 1; i++) {
    maxReach = Math.max(maxReach, i + nums[i]);

    if (i === currentEnd) {
      jumps++;
      currentEnd = maxReach;

      if (currentEnd >= n - 1) {
        jumpPath.push(n - 1);
        break;
      }

      // 找到当前范围内能跳得最远的位置
      let bestNext = i + 1;
      for (let j = i + 1; j <= Math.min(maxReach, n - 1); j++) {
        if (j + nums[j] > bestNext + nums[bestNext]) {
          bestNext = j;
        }
      }

      if (bestNext !== jumpPath[jumpPath.length - 1]) {
        jumpPath.push(bestNext);
      }
    }

    if (maxReach <= i) {
      return { canReach: false };
    }
  }

  return {
    canReach: maxReach >= n - 1,
    minJumps: jumps,
    jumpPath,
  };
}

/**
 * 加油站问题
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function canCompleteCircuit(
  gas: number[],
  cost: number[]
): {
  startIndex: number;
  isValid: boolean;
  route?: number[];
} {
  const n = gas.length;
  let totalGas = 0;
  let totalCost = 0;

  // 检查是否有解
  for (let i = 0; i < n; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
  }

  if (totalGas < totalCost) {
    return { startIndex: -1, isValid: false };
  }

  // 找到起始点
  let tank = 0;
  let start = 0;

  for (let i = 0; i < n; i++) {
    tank += gas[i] - cost[i];

    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }

  // 构建路线
  const route: number[] = [];
  for (let i = 0; i < n; i++) {
    route.push((start + i) % n);
  }

  return {
    startIndex: start,
    isValid: true,
    route,
  };
}

/**
 * 区间覆盖问题
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export interface Interval {
  start: number;
  end: number;
  id?: number;
}

export function intervalCover(
  intervals: Interval[],
  targetStart: number,
  targetEnd: number
): {
  minIntervals: number;
  selectedIntervals: Interval[];
  isValid: boolean;
} {
  // 按起始点排序
  const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);

  const selectedIntervals: Interval[] = [];
  let currentPos = targetStart;
  let i = 0;

  while (currentPos < targetEnd && i < sortedIntervals.length) {
    // 如果当前区间不能覆盖当前位置
    if (sortedIntervals[i].start > currentPos) {
      return { minIntervals: -1, selectedIntervals: [], isValid: false };
    }

    // 找到能覆盖当前位置且结束点最远的区间
    let maxEnd = -Infinity;
    let bestInterval: Interval | null = null;

    while (
      i < sortedIntervals.length &&
      sortedIntervals[i].start <= currentPos
    ) {
      if (sortedIntervals[i].end > maxEnd) {
        maxEnd = sortedIntervals[i].end;
        bestInterval = sortedIntervals[i];
      }
      i++;
    }

    if (bestInterval) {
      selectedIntervals.push(bestInterval);
      currentPos = maxEnd;
    } else {
      return { minIntervals: -1, selectedIntervals: [], isValid: false };
    }
  }

  const isValid = currentPos >= targetEnd;

  return {
    minIntervals: isValid ? selectedIntervals.length : -1,
    selectedIntervals: isValid ? selectedIntervals : [],
    isValid,
  };
}

/**
 * 会议室问题（最少会议室数量）
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export function minMeetingRooms(intervals: Interval[]): {
  minRooms: number;
  roomSchedules: Interval[][];
} {
  if (intervals.length === 0) {
    return { minRooms: 0, roomSchedules: [] };
  }

  // 按开始时间排序
  const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);

  // 使用最小堆存储每个房间的结束时间
  const endTimes = new Heap<number>((a, b) => a - b);
  const roomSchedules: Interval[][] = [];

  for (const interval of sortedIntervals) {
    if (endTimes.isEmpty() || endTimes.peek()! > interval.start) {
      // 需要新房间
      endTimes.insert(interval.end);
      roomSchedules.push([interval]);
    } else {
      // 可以使用现有房间
      const earliestEnd = endTimes.extract()!;
      endTimes.insert(interval.end);

      // 找到对应的房间
      for (const room of roomSchedules) {
        if (room[room.length - 1].end === earliestEnd) {
          room.push(interval);
          break;
        }
      }
    }
  }

  return {
    minRooms: endTimes.size(),
    roomSchedules,
  };
}

/**
 * 贪心算法工具类
 */
export class GreedyAlgorithms {
  /**
   * 演示所有贪心算法
   */
  static demonstrateAll(): void {
    console.log("=== 贪心算法演示 ===\n");

    // 活动选择演示
    console.log("--- 活动选择问题 ---");
    const activities: Activity[] = [
      { id: 1, start: 1, finish: 4, name: "活动1" },
      { id: 2, start: 3, finish: 5, name: "活动2" },
      { id: 3, start: 0, finish: 6, name: "活动3" },
      { id: 4, start: 5, finish: 7, name: "活动4" },
      { id: 5, start: 3, finish: 9, name: "活动5" },
      { id: 6, start: 5, finish: 9, name: "活动6" },
      { id: 7, start: 6, finish: 10, name: "活动7" },
      { id: 8, start: 8, finish: 11, name: "活动8" },
      { id: 9, start: 8, finish: 12, name: "活动9" },
      { id: 10, start: 2, finish: 14, name: "活动10" },
      { id: 11, start: 12, finish: 16, name: "活动11" },
    ];

    const activityResult = activitySelection(activities);
    console.log(`总活动数: ${activities.length}`);
    console.log(`最多可选择: ${activityResult.maxCount}个活动`);
    console.log(
      `选择的活动: ${activityResult.selectedActivities
        .map((a) => a.name)
        .join(", ")}`
    );

    // 霍夫曼编码演示
    console.log("\n--- 霍夫曼编码 ---");
    const text = "hello world";
    const huffmanResult = huffmanCoding(text);
    console.log(`原文: ${text}`);
    console.log(`编码: ${huffmanResult.encodedText}`);
    console.log(`压缩比: ${huffmanResult.compressionRatio.toFixed(2)}:1`);
    console.log("字符编码表:");
    for (const [char, code] of huffmanResult.codes) {
      console.log(`  '${char}': ${code}`);
    }

    // 验证解码
    const decoded = huffmanDecoding(
      huffmanResult.encodedText,
      huffmanResult.tree
    );
    console.log(`解码验证: ${decoded === text ? "✅" : "❌"}`);

    // 分数背包演示
    console.log("\n--- 分数背包问题 ---");
    const fractionalItems: KnapsackItem[] = [
      { weight: 20, value: 100, name: "物品1" },
      { weight: 30, value: 120, name: "物品2" },
      { weight: 10, value: 60, name: "物品3" },
    ];
    const fractionalCapacity = 50;
    const fractionalResult = fractionalKnapsack(
      fractionalItems,
      fractionalCapacity
    );
    console.log(`背包容量: ${fractionalCapacity}`);
    console.log(`最大价值: ${fractionalResult.maxValue.toFixed(2)}`);
    console.log("选择的物品:");
    fractionalResult.selectedItems.forEach(({ item, fraction }) => {
      console.log(
        `  ${item.name}: ${(fraction * 100).toFixed(1)}% (价值: ${(
          item.value * fraction
        ).toFixed(2)})`
      );
    });

    // 任务调度演示
    console.log("\n--- 任务调度问题 ---");
    const tasks: Task[] = [
      { id: 1, duration: 3, name: "任务1" },
      { id: 2, duration: 2, name: "任务2" },
      { id: 3, duration: 4, name: "任务3" },
      { id: 4, duration: 1, name: "任务4" },
      { id: 5, duration: 5, name: "任务5" },
    ];
    const numMachines = 2;
    const scheduleResult = taskScheduling(tasks, numMachines);
    console.log(`任务数: ${tasks.length}, 机器数: ${numMachines}`);
    console.log(`最大完成时间: ${scheduleResult.makespan}`);
    scheduleResult.schedule.forEach((machineTasks, index) => {
      const totalTime = machineTasks.reduce(
        (sum, task) => sum + task.duration,
        0
      );
      console.log(
        `  机器${index + 1}: [${machineTasks
          .map((t) => t.name)
          .join(", ")}] (总时间: ${totalTime})`
      );
    });

    // 跳跃游戏演示
    console.log("\n--- 跳跃游戏 ---");
    const jumpArray = [2, 3, 1, 1, 4];
    const jumpResult = canJump(jumpArray);
    console.log(`数组: [${jumpArray.join(", ")}]`);
    console.log(`能否到达终点: ${jumpResult.canReach ? "是" : "否"}`);
    if (jumpResult.canReach) {
      console.log(`最少跳跃次数: ${jumpResult.minJumps}`);
      console.log(`跳跃路径: ${jumpResult.jumpPath?.join(" -> ")}`);
    }

    // 加油站演示
    console.log("\n--- 加油站问题 ---");
    const gas = [1, 2, 3, 4, 5];
    const cost = [3, 4, 5, 1, 2];
    const gasResult = canCompleteCircuit(gas, cost);
    console.log(`汽油: [${gas.join(", ")}]`);
    console.log(`消耗: [${cost.join(", ")}]`);
    console.log(`能否完成环路: ${gasResult.isValid ? "是" : "否"}`);
    if (gasResult.isValid) {
      console.log(`起始加油站: ${gasResult.startIndex}`);
      console.log(`行驶路线: ${gasResult.route?.join(" -> ")}`);
    }

    // 区间覆盖演示
    console.log("\n--- 区间覆盖问题 ---");
    const intervals: Interval[] = [
      { start: 1, end: 3, id: 1 },
      { start: 2, end: 4, id: 2 },
      { start: 3, end: 4, id: 3 },
      { start: 4, end: 6, id: 4 },
    ];
    const targetStart = 1,
      targetEnd = 6;
    const coverResult = intervalCover(intervals, targetStart, targetEnd);
    console.log(
      `区间: [${intervals.map((i) => `[${i.start},${i.end}]`).join(", ")}]`
    );
    console.log(`目标区间: [${targetStart}, ${targetEnd}]`);
    console.log(`能否完全覆盖: ${coverResult.isValid ? "是" : "否"}`);
    if (coverResult.isValid) {
      console.log(`最少区间数: ${coverResult.minIntervals}`);
      console.log(
        `选择的区间: [${coverResult.selectedIntervals
          .map((i) => `[${i.start},${i.end}]`)
          .join(", ")}]`
      );
    }

    // 会议室演示
    console.log("\n--- 会议室问题 ---");
    const meetings: Interval[] = [
      { start: 0, end: 30, id: 1 },
      { start: 5, end: 10, id: 2 },
      { start: 15, end: 20, id: 3 },
      { start: 25, end: 35, id: 4 },
    ];
    const meetingResult = minMeetingRooms(meetings);
    console.log(
      `会议: [${meetings.map((m) => `[${m.start},${m.end}]`).join(", ")}]`
    );
    console.log(`最少会议室数: ${meetingResult.minRooms}`);
    meetingResult.roomSchedules.forEach((room, index) => {
      console.log(
        `  会议室${index + 1}: [${room
          .map((m) => `[${m.start},${m.end}]`)
          .join(", ")}]`
      );
    });
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("\n=== 贪心算法性能测试 ===\n");

    // 活动选择性能测试
    console.log("--- 活动选择性能测试 ---");
    const largeActivities: Activity[] = Array.from(
      { length: 10000 },
      (_, i) => ({
        id: i + 1,
        start: Math.floor(Math.random() * 1000),
        finish: Math.floor(Math.random() * 1000) + 1000,
        name: `活动${i + 1}`,
      })
    );

    const activityStart = performance.now();
    const activityResult = activitySelection(largeActivities);
    const activityTime = performance.now() - activityStart;

    console.log(`活动总数: ${largeActivities.length}`);
    console.log(`选择活动数: ${activityResult.maxCount}`);
    console.log(`耗时: ${activityTime.toFixed(2)}ms`);

    // 霍夫曼编码性能测试
    console.log("\n--- 霍夫曼编码性能测试 ---");
    const longText = "The quick brown fox jumps over the lazy dog. ".repeat(
      1000
    );

    const huffmanStart = performance.now();
    const huffmanResult = huffmanCoding(longText);
    const huffmanTime = performance.now() - huffmanStart;

    console.log(`文本长度: ${longText.length}`);
    console.log(`压缩后长度: ${huffmanResult.encodedText.length}`);
    console.log(`压缩比: ${huffmanResult.compressionRatio.toFixed(2)}:1`);
    console.log(`耗时: ${huffmanTime.toFixed(2)}ms`);

    // 任务调度性能测试
    console.log("\n--- 任务调度性能测试 ---");
    const largeTasks: Task[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      duration: Math.floor(Math.random() * 100) + 1,
      name: `任务${i + 1}`,
    }));

    const scheduleStart = performance.now();
    const scheduleResult = taskScheduling(largeTasks, 10);
    const scheduleTime = performance.now() - scheduleStart;

    console.log(`任务数: ${largeTasks.length}`);
    console.log(`机器数: 10`);
    console.log(`最大完成时间: ${scheduleResult.makespan}`);
    console.log(`耗时: ${scheduleTime.toFixed(2)}ms`);
  }

  /**
   * 创建示例数据
   */
  static createExampleData() {
    return {
      activities: [
        { id: 1, start: 1, finish: 4, name: "会议A" },
        { id: 2, start: 3, finish: 5, name: "会议B" },
        { id: 3, start: 0, finish: 6, name: "会议C" },
        { id: 4, start: 5, finish: 7, name: "会议D" },
        { id: 5, start: 3, finish: 9, name: "会议E" },
        { id: 6, start: 5, finish: 9, name: "会议F" },
        { id: 7, start: 6, finish: 10, name: "会议G" },
        { id: 8, start: 8, finish: 11, name: "会议H" },
        { id: 9, start: 8, finish: 12, name: "会议I" },
        { id: 10, start: 2, finish: 14, name: "会议J" },
        { id: 11, start: 12, finish: 16, name: "会议K" },
      ],
      fractionalItems: [
        { weight: 20, value: 100, name: "黄金" },
        { weight: 30, value: 120, name: "白银" },
        { weight: 10, value: 60, name: "钻石" },
      ],
      tasks: [
        { id: 1, duration: 3, name: "数据处理" },
        { id: 2, duration: 2, name: "报告生成" },
        { id: 3, duration: 4, name: "系统维护" },
        { id: 4, duration: 1, name: "日志清理" },
        { id: 5, duration: 5, name: "备份操作" },
      ],
    };
  }
}
