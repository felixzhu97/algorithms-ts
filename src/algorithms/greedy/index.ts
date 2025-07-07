/**
 * 贪心算法统一导出
 * 《算法导论》第16章 贪心算法
 */

// 调度相关算法
export {
  activitySelection,
  activitySelectionRecursive,
  taskScheduling,
  intervalCover,
  type Task,
  type Interval,
} from "./scheduling/activity-selection";

// 压缩算法
export { huffmanCoding, huffmanDecoding } from "./compression/huffman";

// 优化问题
export {
  fractionalKnapsack,
  canJump,
  jump,
  canCompleteCircuit,
  canAttendMeetings,
  minMeetingRooms,
  type Meeting,
} from "./optimization/optimization-problems";

// 演示类
export { GreedyAlgorithms } from "./demo";

// 类型导出
export type {
  Activity,
  ActivitySelectionResult,
  HuffmanNode,
  HuffmanResult,
} from "../../types";
