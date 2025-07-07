/**
 * 《算法导论》性能测试演示脚本
 * 展示所有算法的性能表现
 */

import { AlgorithmDemo } from "./index";

function main() {
  console.log("⚡ 《算法导论》TypeScript实现 - 性能测试套件");
  console.log("=".repeat(60));
  console.log("🔥 测试包括：");
  console.log("  • 排序算法性能对比 (10,000个元素)");
  console.log("  • 图算法性能测试 (1,000顶点图)");
  console.log("  • 最短路径算法比较 (1,000顶点加权图)");
  console.log("  • 最小生成树算法比较 (1,000顶点无向加权图)");
  console.log("  • 动态规划算法性能分析");
  console.log("  • 贪心算法性能测试");
  console.log("=".repeat(60));
  console.log();

  // 运行性能测试套件
  AlgorithmDemo.performanceTestSuite();
}

// 运行性能测试
main();
