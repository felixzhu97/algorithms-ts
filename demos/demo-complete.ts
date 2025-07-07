/**
 * 完整算法演示
 * 展示所有算法和数据结构的功能
 */

import { DemoManager } from "./demo-manager";

// 运行完整演示
console.log("🎯 开始完整算法演示...\n");

const startTime = performance.now();

DemoManager.runAllDemos();

const endTime = performance.now();
const totalTime = endTime - startTime;

console.log(`\n⏱️  总演示时间: ${totalTime.toFixed(2)}ms`);
console.log("🎉 演示完成！");
