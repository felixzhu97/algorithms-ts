/**
 * 算法性能测试演示
 * 测试各种算法在大数据集上的性能表现
 */

import { DemoManager } from "./demo-manager";

// 运行性能测试
console.log("⚡ 开始算法性能测试...\n");

const startTime = performance.now();

DemoManager.runPerformanceTests();

const endTime = performance.now();
const totalTime = endTime - startTime;

console.log(`\n⏱️  总测试时间: ${totalTime.toFixed(2)}ms`);
console.log("🏁 性能测试完成！");
