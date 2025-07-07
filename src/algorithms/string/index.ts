/**
 * 字符串算法模块
 * 统一导出所有字符串算法
 */

// 字符串匹配算法
export {
  naiveStringMatching,
  rabinKarpMatching,
  kmpMatching,
  boyerMooreMatching,
} from "./string-matching";

// 编辑距离算法
export {
  EditDistanceResult,
  editDistance,
  editDistanceOptimized,
  editDistanceInsertDelete,
  longestCommonSubsequenceLength,
  editDistanceUsingLCS,
} from "./edit-distance";
