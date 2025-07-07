#!/usr/bin/env ts-node

/**
 * 《算法导论》TypeScript实现演示脚本
 */

import { AlgorithmDemo } from "./index";

function main() {
  console.log("🚀 《算法导论》TypeScript实现演示\n");

  // 演示数据结构
  AlgorithmDemo.demonstrateDataStructures();

  // 演示排序算法性能比较
  console.log("\n📊 开始排序算法性能测试...");

  // 小规模测试
  AlgorithmDemo.runSortingComparison(100);

  // 中规模测试
  AlgorithmDemo.runSortingComparison(1000);

  console.log("\n✅ 演示完成！");
}

// 运行演示
if (require.main === module) {
  main();
}
