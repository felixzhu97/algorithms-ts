/**
 * 《算法导论》完整算法演示脚本
 * 展示所有已实现的算法和数据结构
 */

import { AlgorithmDemo } from "./index";

function main() {
  console.log("🎓 《算法导论》TypeScript实现 - 完整演示");
  console.log("=".repeat(60));
  console.log("📚 包含内容：");
  console.log(
    "  • 基础数据结构：栈、队列、链表、二叉搜索树、红黑树、哈希表、堆"
  );
  console.log("  • 排序算法：插入、归并、快速、堆排序、线性排序");
  console.log("  • 图算法：BFS、DFS、拓扑排序、强连通分量");
  console.log("  • 最短路径：Dijkstra、Bellman-Ford、Floyd-Warshall");
  console.log("  • 最小生成树：Kruskal、Prim");
  console.log("  • 动态规划：矩阵链乘法、LCS、背包、LIS、编辑距离等");
  console.log("  • 贪心算法：活动选择、霍夫曼编码、分数背包等");
  console.log("=".repeat(60));
  console.log();

  // 运行完整演示
  AlgorithmDemo.demonstrateAll();
}

// 运行演示
main();
