/**
 * 活动选择和调度相关的贪心算法
 * 《算法导论》第16章 贪心算法
 */

import { Activity, ActivitySelectionResult } from "../../types";

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
