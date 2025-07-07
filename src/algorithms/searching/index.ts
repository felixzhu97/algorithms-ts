/**
 * 搜索算法模块
 * 统一导出所有搜索算法
 */

// 二分搜索
export {
  binarySearch,
  binarySearchRecursive,
  lowerBound,
  upperBound,
  searchInRotatedArray,
} from "./binary-search";

// 线性搜索
export {
  linearSearch,
  linearSearchSentinel,
  findAllOccurrences,
  findMaximum,
  findMinimum,
  linearSearchWithComparator,
} from "./linear-search";

// 顺序统计量算法
export {
  quickSelect,
  linearSelect,
  findMedian,
  findMinMax,
  findIthAndJthSmallest,
  findWeightedMedian,
  OrderStatistics,
  type SelectResult,
} from "./order-statistics";
