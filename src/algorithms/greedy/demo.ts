/**
 * 贪心算法演示类
 */

import {
  activitySelection,
  taskScheduling,
  intervalCover,
  Task,
  Interval,
} from "./activity-selection";
import { huffmanCoding, huffmanDecoding } from "./huffman";
import {
  fractionalKnapsack,
  canJump,
  jump,
  canCompleteCircuit,
  canAttendMeetings,
  minMeetingRooms,
  Meeting,
} from "./optimization-problems";
import { Activity, KnapsackItem } from "../../types";

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
      { id: 5, start: 8, finish: 9, name: "活动5" },
      { id: 6, start: 5, finish: 9, name: "活动6" },
    ];

    const activityResult = activitySelection(activities);
    console.log(`总活动数: ${activities.length}`);
    console.log(`最多可选择: ${activityResult.maxCount} 个活动`);
    console.log(
      `选择的活动: ${activityResult.selectedActivities
        .map((a) => a.name)
        .join(", ")}`
    );

    // 霍夫曼编码演示
    console.log("\n--- 霍夫曼编码 ---");
    const text = "hello world this is a test message";
    const huffmanResult = huffmanCoding(text);
    const decodedText = huffmanDecoding(
      huffmanResult.encodedText,
      huffmanResult.tree
    );

    console.log(`原文: ${text}`);
    console.log(`编码长度: ${huffmanResult.encodedText.length} 位`);
    console.log(`压缩比: ${huffmanResult.compressionRatio.toFixed(2)}:1`);
    console.log(`解码正确: ${decodedText === text ? "✅" : "❌"}`);

    console.log("字符编码表:");
    for (const [char, code] of huffmanResult.codes) {
      console.log(`  '${char}': ${code}`);
    }

    // 分数背包演示
    console.log("\n--- 分数背包问题 ---");
    const items: KnapsackItem[] = [
      { weight: 10, value: 60, name: "物品1" },
      { weight: 20, value: 100, name: "物品2" },
      { weight: 30, value: 120, name: "物品3" },
    ];
    const capacity = 50;
    const fracKnapsackResult = fractionalKnapsack(items, capacity);

    console.log(`背包容量: ${capacity}`);
    console.log(`最大价值: ${fracKnapsackResult.maxValue.toFixed(2)}`);
    console.log("选择的物品:");
    for (const { item, fraction } of fracKnapsackResult.selectedItems) {
      console.log(`  ${item.name}: ${(fraction * 100).toFixed(1)}%`);
    }

    // 任务调度演示
    console.log("\n--- 任务调度问题 ---");
    const tasks: Task[] = [
      { id: 1, duration: 3, name: "任务1" },
      { id: 2, duration: 7, name: "任务2" },
      { id: 3, duration: 2, name: "任务3" },
      { id: 4, duration: 5, name: "任务4" },
      { id: 5, duration: 1, name: "任务5" },
    ];
    const numMachines = 2;
    const scheduleResult = taskScheduling(tasks, numMachines);

    console.log(`任务数: ${tasks.length}, 机器数: ${numMachines}`);
    console.log(`最大完成时间: ${scheduleResult.makespan}`);
    for (let i = 0; i < scheduleResult.schedule.length; i++) {
      const machineTasks = scheduleResult.schedule[i];
      const totalTime = machineTasks.reduce(
        (sum, task) => sum + task.duration,
        0
      );
      console.log(
        `机器${i + 1}: [${machineTasks
          .map((t) => t.name)
          .join(", ")}] (总时间: ${totalTime})`
      );
    }

    // 跳跃游戏演示
    console.log("\n--- 跳跃游戏 ---");
    const jumpArray = [2, 3, 1, 1, 4];
    const jumpResult = canJump(jumpArray);
    const jumpMinResult = jump(jumpArray);

    console.log(`数组: [${jumpArray.join(", ")}]`);
    console.log(`能否到达最后: ${jumpResult.canReach ? "是" : "否"}`);
    if (jumpResult.canReach) {
      console.log(`最少跳跃次数: ${jumpMinResult.minJumps}`);
      console.log(`跳跃路径: ${jumpMinResult.path.join(" → ")}`);
    }

    // 加油站问题演示
    console.log("\n--- 加油站问题 ---");
    const gas = [1, 2, 3, 4, 5];
    const cost = [3, 4, 5, 1, 2];
    const gasResult = canCompleteCircuit(gas, cost);

    console.log(`加油量: [${gas.join(", ")}]`);
    console.log(`消耗量: [${cost.join(", ")}]`);
    console.log(`能否完成环路: ${gasResult.isValid ? "是" : "否"}`);
    if (gasResult.isValid) {
      console.log(`起始加油站: ${gasResult.startStation}`);
    }

    // 会议室问题演示
    console.log("\n--- 会议室问题 ---");
    const meetings: Meeting[] = [
      { start: 0, end: 30, name: "会议1" },
      { start: 5, end: 10, name: "会议2" },
      { start: 15, end: 20, name: "会议3" },
      { start: 25, end: 35, name: "会议4" },
    ];

    const attendResult = canAttendMeetings(meetings);
    const roomsResult = minMeetingRooms(meetings);

    console.log(`会议安排:`);
    for (const meeting of meetings) {
      console.log(`  ${meeting.name}: ${meeting.start} - ${meeting.end}`);
    }
    console.log(`能否参加所有会议: ${attendResult.canAttend ? "是" : "否"}`);
    console.log(`需要的会议室数量: ${roomsResult.minRooms}`);

    if (!attendResult.canAttend) {
      console.log(`冲突的会议:`);
      for (const [meeting1, meeting2] of attendResult.conflicts) {
        console.log(`  ${meeting1.name} 与 ${meeting2.name}`);
      }
    }

    // 区间覆盖演示
    console.log("\n--- 区间覆盖问题 ---");
    const intervals: Interval[] = [
      { start: 1, end: 3, id: 1 },
      { start: 2, end: 5, id: 2 },
      { start: 3, end: 6, id: 3 },
      { start: 5, end: 8, id: 4 },
      { start: 7, end: 10, id: 5 },
    ];
    const targetStart = 1;
    const targetEnd = 8;
    const coverResult = intervalCover(intervals, targetStart, targetEnd);

    console.log(`目标区间: [${targetStart}, ${targetEnd}]`);
    console.log(
      `可用区间: ${intervals.map((i) => `[${i.start}, ${i.end}]`).join(", ")}`
    );
    console.log(`能否覆盖: ${coverResult.isValid ? "是" : "否"}`);
    if (coverResult.isValid) {
      console.log(`最少区间数: ${coverResult.minIntervals}`);
      console.log(
        `选择的区间: ${coverResult.selectedIntervals
          .map((i) => `[${i.start}, ${i.end}]`)
          .join(", ")}`
      );
    }
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
        id: i,
        start: Math.floor(Math.random() * 1000),
        finish: Math.floor(Math.random() * 1000) + 1000,
        name: `活动${i}`,
      })
    );

    const activityStart = performance.now();
    const activityResult = activitySelection(largeActivities);
    const activityTime = performance.now() - activityStart;

    console.log(`活动数量: ${largeActivities.length}`);
    console.log(`选择数量: ${activityResult.maxCount}`);
    console.log(`耗时: ${activityTime.toFixed(2)}ms`);

    // 霍夫曼编码性能测试
    console.log("\n--- 霍夫曼编码性能测试 ---");
    const longText = "abcdefghijklmnopqrstuvwxyz".repeat(1000);

    const huffmanStart = performance.now();
    const huffmanResult = huffmanCoding(longText);
    const huffmanTime = performance.now() - huffmanStart;

    console.log(`文本长度: ${longText.length}`);
    console.log(`编码长度: ${huffmanResult.encodedText.length}`);
    console.log(`压缩比: ${huffmanResult.compressionRatio.toFixed(2)}:1`);
    console.log(`耗时: ${huffmanTime.toFixed(2)}ms`);

    // 任务调度性能测试
    console.log("\n--- 任务调度性能测试 ---");
    const largeTasks: Task[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      duration: Math.floor(Math.random() * 100) + 1,
      name: `任务${i}`,
    }));
    const machines = 10;

    const scheduleStart = performance.now();
    const scheduleResult = taskScheduling(largeTasks, machines);
    const scheduleTime = performance.now() - scheduleStart;

    console.log(`任务数量: ${largeTasks.length}`);
    console.log(`机器数量: ${machines}`);
    console.log(`最大完成时间: ${scheduleResult.makespan}`);
    console.log(`耗时: ${scheduleTime.toFixed(2)}ms`);

    // 跳跃游戏性能测试
    console.log("\n--- 跳跃游戏性能测试 ---");
    const largeJumpArray = Array.from(
      { length: 10000 },
      () => Math.floor(Math.random() * 10) + 1
    );

    const jumpStart = performance.now();
    const jumpResult = canJump(largeJumpArray);
    const jumpTime = performance.now() - jumpStart;

    console.log(`数组长度: ${largeJumpArray.length}`);
    console.log(`能否到达: ${jumpResult.canReach ? "是" : "否"}`);
    console.log(`耗时: ${jumpTime.toFixed(2)}ms`);
  }
}
