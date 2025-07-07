/**
 * 算法导论 TypeScript 实现 - 主入口文件
 * 《算法导论》第四版 - 完整实现
 */

// ==================== 数据结构导出 ====================

// 基础数据结构
export { Stack } from "./data-structures/basic/stack";
export { Queue } from "./data-structures/basic/queue";
export { LinkedList, ListNode } from "./data-structures/basic/linked-list";
export {
  ChainingHashTable as HashTable,
  OpenAddressingHashTable as LinearProbingHashTable,
} from "./data-structures/basic/hash-table";

// 树结构
export { Heap } from "./data-structures/trees/heap";
export { BinarySearchTree } from "./data-structures/trees/binary-search-tree";
export {
  RedBlackTree,
  RBTreeNode,
} from "./data-structures/trees/red-black-tree";

// ==================== 算法导出 ====================

// 排序算法
export {
  insertionSort,
  mergeSort,
  quickSort,
  randomizedQuickSort,
  heapSort,
  countingSort,
  radixSort,
  bucketSort,
} from "./algorithms/sorting";

// 搜索算法
export {
  binarySearch,
  binarySearchRecursive,
  lowerBound,
  upperBound,
  searchInRotatedArray,
  linearSearch,
  linearSearchSentinel,
  findAllOccurrences,
  findMaximum,
  findMinimum,
  linearSearchWithComparator,
} from "./algorithms/searching";

// 分治算法
export {
  MaxSubarrayResult,
  findMaximumSubarray,
  findMaximumSubarrayKadane,
  fastPowerRecursive,
  fastPowerIterative,
  fastPowerBinary,
  Matrix,
  matrixFastPower,
  fibonacciFastPower,
} from "./algorithms/divide-conquer";

// 字符串算法
export {
  naiveStringMatching,
  rabinKarpMatching,
  kmpMatching,
  boyerMooreMatching,
  EditDistanceResult,
  editDistance,
  editDistanceOptimized,
  editDistanceInsertDelete,
  longestCommonSubsequenceLength,
  editDistanceUsingLCS,
} from "./algorithms/string";

// 数论算法
export {
  gcd,
  gcdRecursive,
  ExtendedGCDResult,
  extendedGCD,
  lcm,
  modularInverse,
  modularExponentiation,
  isPrimeTrial,
  sieveOfEratosthenes,
  millerRabinTest,
  eulerTotient,
  chineseRemainderTheorem,
} from "./algorithms/number-theory";

// 图结构
export { Graph } from "./data-structures/graphs";

// 图算法
export {
  breadthFirstSearch,
  depthFirstSearch,
  topologicalSort,
  stronglyConnectedComponents,
  GraphAlgorithms,
} from "./algorithms/graph/graph-algorithms";

// 最短路径算法
export {
  dijkstra,
  bellmanFord,
  floydWarshall,
  spfa,
} from "./algorithms/graph/shortest-path";

// 最小生成树算法
export {
  UnionFindSet,
  kruskal,
  prim,
  primSimple,
} from "./algorithms/graph/minimum-spanning-tree";

// 动态规划算法
export {
  // 经典问题
  matrixChainMultiplication,
  knapsack01,
  unboundedKnapsack,
  canPartition,

  // 序列问题
  longestCommonSubsequence,
  longestIncreasingSubsequence,
  longestIncreasingSubsequenceOptimized,

  // 优化问题
  maxSubarraySum,
  coinChange,
  climbStairs,

  // 演示类
  DynamicProgrammingAlgorithms,
} from "./algorithms/dynamic-programming";

// 贪心算法
export {
  // 调度问题
  activitySelection,
  activitySelectionRecursive,
  taskScheduling,
  intervalCover,

  // 压缩算法
  huffmanCoding,
  huffmanDecoding,

  // 优化问题
  fractionalKnapsack,
  canJump,
  jump,
  canCompleteCircuit,
  canAttendMeetings,
  minMeetingRooms,

  // 演示类
  GreedyAlgorithms,
} from "./algorithms/greedy";

// ==================== 类型导出 ====================

export type {
  // 基础类型
  Comparator,
  Edge,
  WeightedEdge,

  // 图相关类型
  ShortestPathResult,
  AllPairsShortestPathResult,
  MSTEdge,
  MSTResult,
  UnionFind,

  // 动态规划类型
  MatrixChainResult,
  LCSResult,
  KnapsackResult,
  KnapsackItem,

  // 贪心算法类型
  Activity,
  ActivitySelectionResult,
  HuffmanNode,
  HuffmanResult,
} from "./types";

// ==================== 演示管理器 ====================

export { DemoManager } from "./demos/demo-manager";
