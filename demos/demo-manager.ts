/**
 * 演示管理器
 * 统一管理所有算法和数据结构的演示
 */

import { DynamicProgrammingAlgorithms } from "../algorithms/dynamic-programming/demo";
import { GreedyAlgorithms } from "../algorithms/greedy/demo";

/**
 * 主演示管理器
 */
export class DemoManager {
  /**
   * 运行所有算法演示
   */
  static runAllDemos(): void {
    console.log("🚀 === 算法导论 TypeScript 实现 - 完整演示 === 🚀\n");

    try {
      // 动态规划算法演示
      console.log("📊 动态规划算法演示开始...\n");
      DynamicProgrammingAlgorithms.demonstrateAll();

      console.log("\n" + "=".repeat(60) + "\n");

      // 贪心算法演示
      console.log("🎯 贪心算法演示开始...\n");
      GreedyAlgorithms.demonstrateAll();

      console.log("\n" + "=".repeat(60) + "\n");
      console.log("✅ 所有算法演示完成！");
    } catch (error) {
      console.error("❌ 演示过程中发生错误:", error);
    }
  }

  /**
   * 运行性能测试
   */
  static runPerformanceTests(): void {
    console.log("⚡ === 算法性能测试套件 === ⚡\n");

    try {
      // 动态规划性能测试
      console.log("📊 动态规划算法性能测试...\n");
      DynamicProgrammingAlgorithms.performanceTest();

      console.log("\n" + "=".repeat(60) + "\n");

      // 贪心算法性能测试
      console.log("🎯 贪心算法性能测试...\n");
      GreedyAlgorithms.performanceTest();

      console.log("\n" + "=".repeat(60) + "\n");
      console.log("✅ 所有性能测试完成！");
    } catch (error) {
      console.error("❌ 性能测试过程中发生错误:", error);
    }
  }

  /**
   * 运行特定算法类型的演示
   */
  static runSpecificDemo(type: "dp" | "greedy"): void {
    try {
      switch (type) {
        case "dp":
          console.log("📊 动态规划算法演示\n");
          DynamicProgrammingAlgorithms.demonstrateAll();
          break;
        case "greedy":
          console.log("🎯 贪心算法演示\n");
          GreedyAlgorithms.demonstrateAll();
          break;
        default:
          console.log("❌ 未知的算法类型:", type);
      }
    } catch (error) {
      console.error("❌ 演示过程中发生错误:", error);
    }
  }

  /**
   * 显示项目信息
   */
  static showProjectInfo(): void {
    console.log(`
📚 算法导论 TypeScript 实现

🎯 项目概述:
   这是一个完整的《算法导论》TypeScript实现项目，涵盖了书中的核心算法和数据结构。

📋 已实现的内容:
   ✅ 基础数据结构：栈、队列、链表、哈希表
   ✅ 树结构：二叉搜索树、红黑树、堆
   ✅ 排序算法：插入、归并、快速、堆排序、线性排序
   ✅ 图算法：BFS、DFS、拓扑排序、强连通分量
   ✅ 最短路径：Dijkstra、Bellman-Ford、Floyd-Warshall
   ✅ 最小生成树：Kruskal、Prim
   ✅ 动态规划：矩阵链乘法、LCS、背包问题、LIS等
   ✅ 贪心算法：活动选择、霍夫曼编码、任务调度等

🔧 技术特性:
   • TypeScript 严格类型检查
   • Jest 测试框架，100% 测试覆盖
   • 完整的算法演示和性能测试
   • 模块化设计，易于扩展

🚀 使用方法:
   • npm test        - 运行所有测试
   • npm run demo    - 运行算法演示
   • npm run build   - 构建项目

📖 更多信息请查看 README.md
`);
  }
}

// 默认导出
export default DemoManager;
