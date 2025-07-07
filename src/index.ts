/**
 * 《算法导论》TypeScript 实现
 * 主入口文件
 */

// 导入算法和数据结构（用于内部使用）
import { Stack } from "./data-structures/basic/stack";
import { Queue } from "./data-structures/basic/queue";
import { LinkedList } from "./data-structures/basic/linked-list";
import { insertionSort } from "./algorithms/sorting/insertion-sort";
import { mergeSort } from "./algorithms/sorting/merge-sort";
import {
  quickSort,
  randomizedQuickSort,
  threeWayQuickSort,
} from "./algorithms/sorting/quick-sort";
import { heapSort } from "./algorithms/sorting/heap-sort";
import { BinarySearchTree } from "./data-structures/trees/binary-search-tree";
import { RedBlackTree } from "./data-structures/trees/red-black-tree";
import {
  ChainingHashTable,
  OpenAddressingHashTable,
} from "./data-structures/basic/hash-table";
import {
  Graph,
  breadthFirstSearch,
  depthFirstSearch,
  topologicalSort,
  stronglyConnectedComponents,
  hasCycle,
  getPath,
  printBFSResult,
  printDFSResult,
  printTopologicalSort,
  printSCCResult,
  GraphAlgorithms,
} from "./algorithms/graph/graph-algorithms";
import {
  dijkstra,
  bellmanFord,
  floydWarshall,
  spfa,
  reconstructPath,
  reconstructAllPairsPath,
  hasNegativeCycle,
  printShortestPathResult,
  printAllPairsShortestPath,
  ShortestPathAlgorithms,
  createRandomWeightedGraph,
} from "./algorithms/graph/shortest-path";
import {
  UnionFindSet,
  kruskal,
  prim,
  primSimple,
  validateMST,
  countSpanningTrees,
  printMSTResult,
  MSTAlgorithms,
  createRandomWeightedUndirectedGraph,
} from "./algorithms/graph/minimum-spanning-tree";
import {
  matrixChainMultiplication,
  longestCommonSubsequence,
  knapsack01,
  unboundedKnapsack,
  longestIncreasingSubsequence,
  longestIncreasingSubsequenceOptimized,
  editDistance,
  maxSubarraySum,
  coinChange,
  climbStairs,
  canPartition,
  DynamicProgrammingAlgorithms,
} from "./algorithms/dynamic-programming/dynamic-programming";
import {
  activitySelection,
  activitySelectionRecursive,
  huffmanCoding,
  huffmanDecoding,
  fractionalKnapsack,
  taskScheduling,
  greedyCoinChange,
  canJump,
  canCompleteCircuit,
  intervalCover,
  minMeetingRooms,
  GreedyAlgorithms,
} from "./algorithms/greedy/greedy-algorithms";

// 数据结构导出
export { Stack } from "./data-structures/basic/stack";
export { Queue, Deque } from "./data-structures/basic/queue";
export {
  LinkedList,
  DoublyLinkedList,
  ListNode,
  DoublyListNode,
} from "./data-structures/basic/linked-list";
export {
  Heap,
  MaxHeap,
  MinHeap,
  PriorityQueue,
} from "./data-structures/trees/heap";
export {
  BSTNode,
  BinarySearchTree,
} from "./data-structures/trees/binary-search-tree";
export {
  RBTreeNode,
  RedBlackTree,
} from "./data-structures/trees/red-black-tree";
export {
  ChainingHashTable,
  OpenAddressingHashTable,
  PerfectHashTable,
  ProbingStrategy,
  HashTableUtils,
  defaultStringHash,
  defaultNumberHash,
  defaultObjectHash,
} from "./data-structures/basic/hash-table";

// 排序算法
export {
  insertionSort,
  binaryInsertionSort,
  insertionSortInPlace,
} from "./algorithms/sorting/insertion-sort";

export {
  mergeSort,
  mergeSortBottomUp,
  kWayMergeSort,
} from "./algorithms/sorting/merge-sort";

export {
  quickSort,
  quickSortHoare,
  randomizedQuickSort,
  threeWayQuickSort,
  iterativeQuickSort,
} from "./algorithms/sorting/quick-sort";

export {
  heapSort,
  heapSortWithHeapClass,
  heapSortInPlace,
  findTopK,
  findTopKEfficient,
} from "./algorithms/sorting/heap-sort";

export {
  countingSort,
  radixSort,
  bucketSort,
  bucketSortInteger,
  radixSortString,
} from "./algorithms/sorting/linear-sorts";

// 图算法
export {
  Graph,
  breadthFirstSearch,
  depthFirstSearch,
  topologicalSort,
  stronglyConnectedComponents,
  hasCycle,
  getPath,
  printBFSResult,
  printDFSResult,
  printTopologicalSort,
  printSCCResult,
  GraphAlgorithms,
} from "./algorithms/graph/graph-algorithms";

// 最短路径算法
export {
  dijkstra,
  bellmanFord,
  floydWarshall,
  spfa,
  reconstructPath,
  reconstructAllPairsPath,
  hasNegativeCycle,
  printShortestPathResult,
  printAllPairsShortestPath,
  ShortestPathAlgorithms,
  createRandomWeightedGraph,
} from "./algorithms/graph/shortest-path";

// 最小生成树算法
export {
  UnionFindSet,
  kruskal,
  prim,
  primSimple,
  validateMST,
  countSpanningTrees,
  printMSTResult,
  MSTAlgorithms,
  createRandomWeightedUndirectedGraph,
} from "./algorithms/graph/minimum-spanning-tree";

// 动态规划算法
export {
  matrixChainMultiplication,
  longestCommonSubsequence,
  knapsack01,
  unboundedKnapsack,
  longestIncreasingSubsequence,
  longestIncreasingSubsequenceOptimized,
  editDistance,
  maxSubarraySum,
  coinChange,
  climbStairs,
  canPartition,
  DynamicProgrammingAlgorithms,
} from "./algorithms/dynamic-programming/dynamic-programming";

// 贪心算法
export {
  activitySelection,
  activitySelectionRecursive,
  huffmanCoding,
  huffmanDecoding,
  fractionalKnapsack,
  taskScheduling,
  greedyCoinChange,
  canJump,
  canCompleteCircuit,
  intervalCover,
  minMeetingRooms,
  GreedyAlgorithms,
} from "./algorithms/greedy/greedy-algorithms";

// 类型定义
export * from "./types";

/**
 * 算法性能测试和演示
 */
export class AlgorithmDemo {
  /**
   * 生成随机数组用于测试
   */
  static generateRandomArray(
    size: number,
    min: number = 0,
    max: number = 1000
  ): number[] {
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
  }

  /**
   * 生成已排序数组
   */
  static generateSortedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }

  /**
   * 生成逆序数组
   */
  static generateReversedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => size - i - 1);
  }

  /**
   * 生成包含重复元素的数组
   */
  static generateArrayWithDuplicates(
    size: number,
    uniqueElements: number = 10
  ): number[] {
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * uniqueElements));
    }
    return arr;
  }

  /**
   * 验证数组是否已正确排序
   */
  static isSorted<T>(
    arr: T[],
    compareFn: (a: T, b: T) => number = (a, b) => (a as any) - (b as any)
  ): boolean {
    for (let i = 1; i < arr.length; i++) {
      if (compareFn(arr[i - 1], arr[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * 测量算法执行时间
   */
  static measureTime<T>(fn: () => T): { result: T; timeMs: number } {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return {
      result,
      timeMs: end - start,
    };
  }

  /**
   * 运行排序算法比较测试
   */
  static runSortingComparison(arraySize: number = 1000): void {
    console.log(`\n=== 排序算法性能比较 (数组大小: ${arraySize}) ===\n`);

    // 生成测试数据
    const testArrays = {
      random: this.generateRandomArray(arraySize),
      sorted: this.generateSortedArray(arraySize),
      reversed: this.generateReversedArray(arraySize),
      duplicates: this.generateArrayWithDuplicates(arraySize, 50),
    };

    const algorithms = [
      { name: "插入排序", fn: insertionSort },
      { name: "归并排序", fn: mergeSort },
      { name: "快速排序", fn: quickSort },
      { name: "堆排序", fn: heapSort },
      { name: "随机快速排序", fn: randomizedQuickSort },
      { name: "三路快速排序", fn: threeWayQuickSort },
    ];

    Object.entries(testArrays).forEach(([testType, testArray]) => {
      console.log(`\n--- ${testType} 数组测试 ---`);

      algorithms.forEach(({ name, fn }) => {
        const { result: sortResult, timeMs } = this.measureTime(() =>
          fn(testArray)
        );
        const isCorrect = this.isSorted(sortResult.sorted);

        console.log(`${name}:`);
        console.log(`  时间: ${timeMs.toFixed(2)}ms`);
        console.log(`  比较次数: ${sortResult.comparisons}`);
        console.log(`  交换次数: ${sortResult.swaps}`);
        console.log(`  结果正确: ${isCorrect ? "✅" : "❌"}`);
        console.log("");
      });
    });
  }

  /**
   * 演示数据结构的基本操作
   */
  static demonstrateDataStructures(): void {
    console.log("\n=== 数据结构演示 ===\n");

    // 栈演示
    console.log("--- 栈 (Stack) ---");
    const stack = new Stack<number>();
    [1, 2, 3, 4, 5].forEach((item) => stack.push(item));
    console.log(`栈内容: ${stack.toString()}`);
    console.log(`弹出: ${stack.pop()}`);
    console.log(`栈顶: ${stack.peek()}`);
    console.log(`栈大小: ${stack.size()}\n`);

    // 队列演示
    console.log("--- 队列 (Queue) ---");
    const queue = new Queue<string>();
    ["A", "B", "C", "D"].forEach((item) => queue.enqueue(item));
    console.log(`队列内容: ${queue.toString()}`);
    console.log(`出队: ${queue.dequeue()}`);
    console.log(`队首: ${queue.front()}`);
    console.log(`队列大小: ${queue.size()}\n`);

    // 链表演示
    console.log("--- 链表 (LinkedList) ---");
    const list = new LinkedList<number>();
    [10, 20, 30, 40].forEach((item) => list.append(item));
    console.log(`链表内容: ${list.toString()}`);
    list.prepend(5);
    console.log(`前插5后: ${list.toString()}`);
    list.remove(20);
    console.log(`删除20后: ${list.toString()}`);
    list.reverse();
    console.log(`反转后: ${list.toString()}\n`);

    // 二叉搜索树演示
    console.log("--- 二叉搜索树 (Binary Search Tree) ---");
    const bst = new BinarySearchTree<number>();
    [50, 30, 70, 20, 40, 60, 80].forEach((item) => bst.insert(item));
    console.log(`BST大小: ${bst.size()}`);
    console.log(`中序遍历 (排序序列): [${bst.inorderTraversal().join(", ")}]`);
    console.log(`前序遍历: [${bst.preorderTraversal().join(", ")}]`);
    console.log(`层序遍历: [${bst.levelOrderTraversal().join(", ")}]`);
    console.log(`搜索40: ${bst.contains(40) ? "找到" : "未找到"}`);
    console.log(`搜索100: ${bst.contains(100) ? "找到" : "未找到"}`);
    console.log(`最小值: ${bst.minimum().value}`);
    console.log(`最大值: ${bst.maximum().value}`);
    bst.delete(30);
    console.log(`删除30后中序遍历: [${bst.inorderTraversal().join(", ")}]`);
    console.log(`树高度: ${bst.height()}`);
    console.log(`是否为有效BST: ${bst.isValidBST()}\n`);

    // 哈希表演示
    console.log("--- 哈希表 (Hash Table) ---");

    // 链地址法哈希表
    console.log("链地址法哈希表:");
    const chainingHT = new ChainingHashTable<string, number>();
    ["apple", "banana", "cherry", "date", "elderberry"].forEach(
      (fruit, index) => {
        chainingHT.set(fruit, index + 1);
      }
    );
    console.log(`大小: ${chainingHT.getSize()}`);
    console.log(`负载因子: ${chainingHT.getLoadFactor().toFixed(2)}`);
    console.log(`查找 'banana': ${chainingHT.get("banana")}`);
    console.log(`包含 'fig': ${chainingHT.has("fig")}`);
    console.log(`所有键: [${chainingHT.keys().join(", ")}]`);
    chainingHT.delete("cherry");
    console.log(`删除 'cherry' 后的键: [${chainingHT.keys().join(", ")}]\n`);

    // 开放地址法哈希表
    console.log("开放地址法哈希表 (线性探测):");
    const openHT = new OpenAddressingHashTable<string, number>();
    ["red", "green", "blue", "yellow", "purple"].forEach((color, index) => {
      openHT.set(color, index + 1);
    });
    console.log(`大小: ${openHT.getSize()}`);
    console.log(`负载因子: ${openHT.getLoadFactor().toFixed(2)}`);
    console.log(`查找 'blue': ${openHT.get("blue")}`);
    console.log(`包含 'orange': ${openHT.has("orange")}`);
    console.log(`所有键: [${openHT.keys().join(", ")}]`);
    const stats = openHT.getStats();
    console.log(
      `聚类信息: 最大簇大小=${stats.clusteringInfo.maxClusterSize}, 总簇数=${stats.clusteringInfo.totalClusters}\n`
    );

    // 红黑树演示
    console.log("--- 红黑树 (Red-Black Tree) ---");
    const rbt = new RedBlackTree<number>();
    [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach((item) =>
      rbt.insert(item)
    );
    console.log(`红黑树大小: ${rbt.getSize()}`);
    console.log(`中序遍历 (排序序列): [${rbt.inorderTraversal().join(", ")}]`);
    console.log(`前序遍历: [${rbt.preorderTraversal().join(", ")}]`);
    console.log(`层序遍历: [${rbt.levelOrderTraversal().join(", ")}]`);
    console.log(`搜索35: ${rbt.contains(35) ? "找到" : "未找到"}`);
    console.log(`搜索100: ${rbt.contains(100) ? "找到" : "未找到"}`);
    console.log(`最小值: ${rbt.min()}`);
    console.log(`最大值: ${rbt.max()}`);
    console.log(`树高度: ${rbt.height()}`);
    console.log(`黑高度: ${rbt.blackHeight()}`);
    console.log(`是否为有效红黑树: ${rbt.isValidRedBlackTree()}`);
    rbt.delete(30);
    console.log(`删除30后中序遍历: [${rbt.inorderTraversal().join(", ")}]`);
    console.log(`删除后仍为有效红黑树: ${rbt.isValidRedBlackTree()}\n`);
  }

  /**
   * 演示图算法
   */
  static demonstrateGraphAlgorithms(): void {
    console.log("\n=== 图算法演示 ===\n");

    // 无向图演示
    console.log("--- 无向图演示 ---");
    const undirectedGraph = GraphAlgorithms.createExampleUndirectedGraph();
    undirectedGraph.printGraph();

    console.log("\nBFS从顶点0开始:");
    const bfsResult = breadthFirstSearch(undirectedGraph, 0);
    printBFSResult(bfsResult, 0);

    console.log("\nDFS遍历:");
    const dfsResult = depthFirstSearch(undirectedGraph);
    printDFSResult(dfsResult);

    // 有向无环图演示
    console.log("\n--- 有向无环图（DAG）演示 ---");
    const dag = GraphAlgorithms.createExampleDAG();
    dag.printGraph();

    const topoResult = topologicalSort(dag);
    printTopologicalSort(topoResult);

    // 强连通分量演示
    console.log("\n--- 强连通分量演示 ---");
    const sccGraph = GraphAlgorithms.createExampleSCCGraph();
    sccGraph.printGraph();

    const sccResult = stronglyConnectedComponents(sccGraph);
    printSCCResult(sccResult);

    // 路径查找演示
    console.log("\n--- 路径查找演示 ---");
    console.log("从顶点0到其他顶点的路径:");
    for (let target = 1; target < undirectedGraph.getVertices(); target++) {
      const path = getPath(bfsResult.parents, 0, target);
      if (path.length > 0) {
        console.log(`到顶点${target}: ${path.join(" -> ")}`);
      } else {
        console.log(`到顶点${target}: 无路径`);
      }
    }

    // 性能测试
    console.log("\n--- 图算法性能测试 ---");
    this.performGraphPerformanceTest();
  }

  /**
   * 图算法性能测试
   */
  private static performGraphPerformanceTest(): void {
    const vertices = 1000;
    const edges = 5000;

    console.log(`创建随机图: ${vertices}个顶点, ${edges}条边`);

    // 创建随机图
    const randomGraph = new Graph(vertices, true);
    for (let i = 0; i < edges; i++) {
      const from = Math.floor(Math.random() * vertices);
      const to = Math.floor(Math.random() * vertices);
      if (from !== to && !randomGraph.hasEdge(from, to)) {
        randomGraph.addEdge(from, to);
      }
    }

    // 测试BFS性能
    const { timeMs: bfsTime } = this.measureTime(() => {
      breadthFirstSearch(randomGraph, 0);
    });
    console.log(`BFS耗时: ${bfsTime.toFixed(2)}ms`);

    // 测试DFS性能
    const { timeMs: dfsTime } = this.measureTime(() => {
      depthFirstSearch(randomGraph);
    });
    console.log(`DFS耗时: ${dfsTime.toFixed(2)}ms`);

    // 测试拓扑排序性能
    const { timeMs: topoTime } = this.measureTime(() => {
      topologicalSort(randomGraph);
    });
    console.log(`拓扑排序耗时: ${topoTime.toFixed(2)}ms`);

    // 测试强连通分量性能
    const { timeMs: sccTime } = this.measureTime(() => {
      stronglyConnectedComponents(randomGraph);
    });
    console.log(`强连通分量耗时: ${sccTime.toFixed(2)}ms`);
  }

  /**
   * 演示最短路径算法
   */
  static demonstrateShortestPathAlgorithms(): void {
    console.log("\n=== 最短路径算法演示 ===\n");
    ShortestPathAlgorithms.demonstrateAll();
  }

  /**
   * 演示最小生成树算法
   */
  static demonstrateMSTAlgorithms(): void {
    console.log("\n=== 最小生成树算法演示 ===\n");
    MSTAlgorithms.demonstrateAll();
  }

  /**
   * 演示动态规划算法
   */
  static demonstrateDynamicProgramming(): void {
    console.log("\n=== 动态规划算法演示 ===\n");
    DynamicProgrammingAlgorithms.demonstrateAll();
  }

  /**
   * 演示贪心算法
   */
  static demonstrateGreedyAlgorithms(): void {
    console.log("\n=== 贪心算法演示 ===\n");
    GreedyAlgorithms.demonstrateAll();
  }

  /**
   * 综合演示所有算法
   */
  static demonstrateAll(): void {
    console.log("🚀 《算法导论》完整算法演示\n");

    // 基础数据结构
    this.demonstrateDataStructures();

    // 排序算法比较
    this.runSortingComparison();

    // 图算法
    this.demonstrateGraphAlgorithms();

    // 最短路径算法
    this.demonstrateShortestPathAlgorithms();

    // 最小生成树算法
    this.demonstrateMSTAlgorithms();

    // 动态规划算法
    this.demonstrateDynamicProgramming();

    // 贪心算法
    this.demonstrateGreedyAlgorithms();

    console.log("\n✅ 《算法导论》完整演示完成！");
    console.log(
      "🎯 已实现：排序、数据结构、图算法、最短路径、最小生成树、动态规划、贪心算法"
    );
  }

  /**
   * 性能测试套件
   */
  static performanceTestSuite(): void {
    console.log("\n=== 算法性能测试套件 ===\n");

    console.log("--- 排序算法性能测试 ---");
    this.runSortingComparison(10000);

    console.log("\n--- 图算法性能测试 ---");
    this.performGraphPerformanceTest();

    console.log("\n--- 最短路径算法性能测试 ---");
    const testGraph = createRandomWeightedGraph(1000, 5000, 100, false);
    ShortestPathAlgorithms.compareAlgorithms(testGraph, 0);

    console.log("\n--- 最小生成树算法性能测试 ---");
    const mstGraph = createRandomWeightedUndirectedGraph(1000, 5000, 100);
    MSTAlgorithms.compareAlgorithms(mstGraph);

    console.log("\n--- 动态规划算法性能测试 ---");
    DynamicProgrammingAlgorithms.performanceTest();

    console.log("\n--- 贪心算法性能测试 ---");
    GreedyAlgorithms.performanceTest();

    console.log("\n✅ 性能测试套件完成！");
  }
}
