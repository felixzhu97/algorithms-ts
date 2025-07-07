/**
 * 图算法演示脚本
 * 展示《算法导论》第22章图的基本算法
 */

import { DemoManager } from "./demo-manager";

function main() {
  console.log("🚀 《算法导论》图算法演示\n");

  // 演示图算法
  DemoManager.runSpecificDemo("greedy");

  console.log("\n✅ 图算法演示完成！");
}

// 运行演示
main();
