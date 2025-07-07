/**
 * 优化相关的贪心算法
 * 《算法导论》第16章 贪心算法
 */

import { KnapsackItem } from "../../types";

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
  // 按价值密度降序排序
  const sortedItems = [...items]
    .map((item, index) => ({
      ...item,
      originalIndex: index,
      valuePerWeight: item.value / item.weight,
    }))
    .sort((a, b) => b.valuePerWeight - a.valuePerWeight);

  const selectedItems: Array<{ item: KnapsackItem; fraction: number }> = [];
  let remainingCapacity = capacity;
  let maxValue = 0;

  for (const item of sortedItems) {
    if (remainingCapacity <= 0) break;

    if (item.weight <= remainingCapacity) {
      // 可以完全装入
      selectedItems.push({ item, fraction: 1 });
      maxValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      // 只能装入一部分
      const fraction = remainingCapacity / item.weight;
      selectedItems.push({ item, fraction });
      maxValue += item.value * fraction;
      remainingCapacity = 0;
    }
  }

  return { maxValue, selectedItems };
}

/**
 * 跳跃游戏
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function canJump(nums: number[]): {
  canReach: boolean;
  path: number[];
} {
  const n = nums.length;
  if (n <= 1) return { canReach: true, path: [0] };

  let maxReach = 0;
  const path: number[] = [0];

  for (let i = 0; i < n - 1; i++) {
    if (i > maxReach) {
      // 无法到达当前位置
      return { canReach: false, path: [] };
    }

    const newReach = i + nums[i];
    if (newReach > maxReach) {
      maxReach = newReach;
      if (maxReach >= n - 1) {
        // 可以到达最后一个位置
        path.push(n - 1);
        return { canReach: true, path };
      }
    }
  }

  return {
    canReach: maxReach >= n - 1,
    path: maxReach >= n - 1 ? [...path, n - 1] : [],
  };
}

/**
 * 跳跃游戏 II（最少跳跃次数）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function jump(nums: number[]): {
  minJumps: number;
  path: number[];
} {
  const n = nums.length;
  if (n <= 1) return { minJumps: 0, path: [0] };

  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;
  const path: number[] = [0];

  for (let i = 0; i < n - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;

      // 找到能到达 currentEnd 的位置
      for (let j = path[path.length - 1] + 1; j <= i; j++) {
        if (j + nums[j] >= currentEnd) {
          path.push(j);
          break;
        }
      }
    }
  }

  // 确保最后一个位置被包含
  if (path[path.length - 1] !== n - 1) {
    path.push(n - 1);
  }

  return { minJumps: jumps, path };
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
  startStation: number;
  isValid: boolean;
  totalGas: number;
  totalCost: number;
} {
  const n = gas.length;
  let totalGas = 0;
  let totalCost = 0;
  let tank = 0;
  let startStation = 0;

  for (let i = 0; i < n; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    tank += gas[i] - cost[i];

    // 如果油箱为负，说明无法从之前的起点到达当前点
    // 将起点设为下一个点
    if (tank < 0) {
      startStation = i + 1;
      tank = 0;
    }
  }

  const isValid = totalGas >= totalCost;

  return {
    startStation: isValid ? startStation : -1,
    isValid,
    totalGas,
    totalCost,
  };
}

/**
 * 会议室问题
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export interface Meeting {
  start: number;
  end: number;
  id?: number;
  name?: string;
}

export function canAttendMeetings(meetings: Meeting[]): {
  canAttend: boolean;
  conflicts: Meeting[][];
} {
  if (meetings.length <= 1) {
    return { canAttend: true, conflicts: [] };
  }

  // 按开始时间排序
  const sortedMeetings = [...meetings].sort((a, b) => a.start - b.start);
  const conflicts: Meeting[][] = [];

  for (let i = 0; i < sortedMeetings.length - 1; i++) {
    if (sortedMeetings[i].end > sortedMeetings[i + 1].start) {
      conflicts.push([sortedMeetings[i], sortedMeetings[i + 1]]);
    }
  }

  return {
    canAttend: conflicts.length === 0,
    conflicts,
  };
}

/**
 * 会议室 II（需要的最少会议室数量）
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export function minMeetingRooms(meetings: Meeting[]): {
  minRooms: number;
  roomSchedule: Meeting[][];
} {
  if (meetings.length === 0) {
    return { minRooms: 0, roomSchedule: [] };
  }

  // 创建开始和结束事件
  interface Event {
    time: number;
    type: "start" | "end";
    meeting: Meeting;
  }

  const events: Event[] = [];

  for (const meeting of meetings) {
    events.push({ time: meeting.start, type: "start", meeting });
    events.push({ time: meeting.end, type: "end", meeting });
  }

  // 按时间排序，相同时间时结束事件优先
  events.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.type === "end" ? -1 : 1;
  });

  let currentRooms = 0;
  let maxRooms = 0;
  const roomSchedule: Meeting[][] = [];
  const availableRooms: number[] = [];

  for (const event of events) {
    if (event.type === "start") {
      let roomIndex: number;

      if (availableRooms.length > 0) {
        roomIndex = availableRooms.pop()!;
      } else {
        roomIndex = roomSchedule.length;
        roomSchedule.push([]);
        currentRooms++;
        maxRooms = Math.max(maxRooms, currentRooms);
      }

      roomSchedule[roomIndex].push(event.meeting);
    } else {
      // 结束事件：释放会议室
      for (let i = 0; i < roomSchedule.length; i++) {
        const room = roomSchedule[i];
        if (room.length > 0 && room[room.length - 1] === event.meeting) {
          availableRooms.push(i);
          break;
        }
      }
      currentRooms--;
    }
  }

  return { minRooms: maxRooms, roomSchedule };
}
