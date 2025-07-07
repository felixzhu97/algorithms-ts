/**
 * 最短路径算法实现
 * 《算法导论》第24章 单源最短路径
 * 《算法导论》第25章 所有点对最短路径
 *
 * 包含以下算法：
 * 1. Dijkstra算法（单源最短路径，非负权重）
 * 2. Bellman-Ford算法（单源最短路径，可处理负权重）
 * 3. Floyd-Warshall算法（所有点对最短路径）
 */

import { Heap } from "../../data-structures/trees/heap";
import { Graph } from "./graph-algorithms";
import {
  ShortestPathResult,
  AllPairsShortestPathResult,
  Edge,
} from "../../types";

/**
 * 优先队列节点
 */
interface PriorityQueueNode {
  vertex: number;
  distance: number;
}

/**
 * Dijkstra算法
 * 时间复杂度：O((V + E) log V) 使用最小堆
 * 空间复杂度：O(V)
 * 适用于非负权重图
 */
export function dijkstra(graph: Graph, source: number): ShortestPathResult {
  const vertices = graph.getVertices();

  if (source < 0 || source >= vertices) {
    throw new Error(`源顶点 ${source} 超出范围`);
  }

  if (!graph.getIsWeighted()) {
    throw new Error("Dijkstra算法需要加权图");
  }

  // 初始化距离和前驱
  const distances: number[] = new Array(vertices).fill(Infinity);
  const predecessors: (number | null)[] = new Array(vertices).fill(null);
  const visited: boolean[] = new Array(vertices).fill(false);

  distances[source] = 0;

  // 使用最小堆作为优先队列
  const pq = new Heap<PriorityQueueNode>((a, b) => a.distance - b.distance);
  pq.insert({ vertex: source, distance: 0 });

  while (!pq.isEmpty()) {
    const current = pq.extract()!;
    const u = current.vertex;

    if (visited[u]) continue;
    visited[u] = true;

    // 检查所有邻居
    const neighbors = graph.getWeightedNeighbors(u);
    for (const { vertex: v, weight } of neighbors) {
      if (weight < 0) {
        throw new Error("Dijkstra算法不能处理负权重边");
      }

      const altDistance = distances[u] + weight;

      if (altDistance < distances[v]) {
        distances[v] = altDistance;
        predecessors[v] = u;
        pq.insert({ vertex: v, distance: altDistance });
      }
    }
  }

  return {
    distances,
    predecessors,
  };
}

/**
 * Bellman-Ford算法
 * 时间复杂度：O(VE)
 * 空间复杂度：O(V)
 * 可以处理负权重边，检测负权重环
 */
export function bellmanFord(graph: Graph, source: number): ShortestPathResult {
  const vertices = graph.getVertices();

  if (source < 0 || source >= vertices) {
    throw new Error(`源顶点 ${source} 超出范围`);
  }

  if (!graph.getIsWeighted()) {
    throw new Error("Bellman-Ford算法需要加权图");
  }

  // 初始化距离和前驱
  const distances: number[] = new Array(vertices).fill(Infinity);
  const predecessors: (number | null)[] = new Array(vertices).fill(null);

  distances[source] = 0;

  // 获取所有边
  const edges = graph.getEdges();

  // 松弛操作，重复 V-1 次
  for (let i = 0; i < vertices - 1; i++) {
    for (const edge of edges) {
      const { from: u, to: v, weight } = edge;
      if (distances[u] !== Infinity && distances[u] + weight! < distances[v]) {
        distances[v] = distances[u] + weight!;
        predecessors[v] = u;
      }
    }
  }

  // 检测负权重环
  let hasNegativeCycle = false;
  for (const edge of edges) {
    const { from: u, to: v, weight } = edge;
    if (distances[u] !== Infinity && distances[u] + weight! < distances[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return {
    distances,
    predecessors,
    hasNegativeCycle,
  };
}

/**
 * Floyd-Warshall算法
 * 时间复杂度：O(V³)
 * 空间复杂度：O(V²)
 * 计算所有点对之间的最短路径
 */
export function floydWarshall(graph: Graph): AllPairsShortestPathResult {
  const vertices = graph.getVertices();

  if (!graph.getIsWeighted()) {
    throw new Error("Floyd-Warshall算法需要加权图");
  }

  // 初始化距离矩阵
  const distances: number[][] = Array.from({ length: vertices }, () =>
    Array.from({ length: vertices }, () => Infinity)
  );

  const predecessors: (number | null)[][] = Array.from(
    { length: vertices },
    () => Array.from({ length: vertices }, () => null)
  );

  // 初始化对角线为0
  for (let i = 0; i < vertices; i++) {
    distances[i][i] = 0;
  }

  // 设置直接边的距离
  const edges = graph.getEdges();
  for (const edge of edges) {
    const { from: u, to: v, weight } = edge;
    distances[u][v] = weight!;
    predecessors[u][v] = u;

    // 如果是无向图，添加反向边
    if (!graph.getIsDirected()) {
      distances[v][u] = weight!;
      predecessors[v][u] = v;
    }
  }

  // Floyd-Warshall主算法
  for (let k = 0; k < vertices; k++) {
    for (let i = 0; i < vertices; i++) {
      for (let j = 0; j < vertices; j++) {
        if (distances[i][k] + distances[k][j] < distances[i][j]) {
          distances[i][j] = distances[i][k] + distances[k][j];
          predecessors[i][j] = predecessors[k][j];
        }
      }
    }
  }

  return {
    distances,
    predecessors,
  };
}

/**
 * SPFA算法（Shortest Path Faster Algorithm）
 * Bellman-Ford的优化版本
 * 平均时间复杂度：O(kE)，其中k是常数
 * 最坏时间复杂度：O(VE)
 */
export function spfa(graph: Graph, source: number): ShortestPathResult {
  const vertices = graph.getVertices();

  if (source < 0 || source >= vertices) {
    throw new Error(`源顶点 ${source} 超出范围`);
  }

  if (!graph.getIsWeighted()) {
    throw new Error("SPFA算法需要加权图");
  }

  const distances: number[] = new Array(vertices).fill(Infinity);
  const predecessors: (number | null)[] = new Array(vertices).fill(null);
  const inQueue: boolean[] = new Array(vertices).fill(false);
  const count: number[] = new Array(vertices).fill(0);

  distances[source] = 0;

  const queue: number[] = [source];
  inQueue[source] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;

    const neighbors = graph.getWeightedNeighbors(u);
    for (const { vertex: v, weight } of neighbors) {
      const altDistance = distances[u] + weight;

      if (altDistance < distances[v]) {
        distances[v] = altDistance;
        predecessors[v] = u;

        if (!inQueue[v]) {
          queue.push(v);
          inQueue[v] = true;
          count[v]++;

          // 检测负权重环
          if (count[v] >= vertices) {
            return {
              distances,
              predecessors,
              hasNegativeCycle: true,
            };
          }
        }
      }
    }
  }

  return {
    distances,
    predecessors,
    hasNegativeCycle: false,
  };
}

/**
 * 重构路径
 */
export function reconstructPath(
  predecessors: (number | null)[],
  source: number,
  target: number
): number[] {
  const path: number[] = [];
  let current: number | null = target;

  while (current !== null) {
    path.unshift(current);
    current = predecessors[current];
  }

  // 检查路径是否从源点开始
  if (path.length === 0 || path[0] !== source) {
    return []; // 无路径
  }

  return path;
}

/**
 * 重构所有点对路径
 */
export function reconstructAllPairsPath(
  predecessors: (number | null)[][],
  source: number,
  target: number
): number[] {
  if (predecessors[source][target] === null) {
    return []; // 无路径
  }

  const path: number[] = [];
  let current = target;

  while (current !== source) {
    path.unshift(current);
    current = predecessors[source][current]!;
  }

  path.unshift(source);
  return path;
}

/**
 * 检测图中是否存在负权重环
 */
export function hasNegativeCycle(graph: Graph): boolean {
  const vertices = graph.getVertices();

  if (vertices === 0) return false;

  // 添加一个虚拟源点，连接到所有顶点
  const distances: number[] = new Array(vertices).fill(0);
  const edges = graph.getEdges();

  // 松弛操作，重复 V 次
  for (let i = 0; i < vertices; i++) {
    let updated = false;

    for (const edge of edges) {
      const { from: u, to: v, weight } = edge;
      if (distances[u] + weight! < distances[v]) {
        distances[v] = distances[u] + weight!;
        updated = true;
      }
    }

    // 如果第V次迭代仍有更新，说明存在负权重环
    if (i === vertices - 1 && updated) {
      return true;
    }

    // 如果没有更新，可以提前结束
    if (!updated) {
      break;
    }
  }

  return false;
}

/**
 * 打印最短路径结果
 */
export function printShortestPathResult(
  result: ShortestPathResult,
  source: number,
  graph?: Graph
): void {
  console.log(`\n从顶点 ${source} 的最短路径:`);

  if (result.hasNegativeCycle) {
    console.log("⚠️ 检测到负权重环！");
    return;
  }

  console.log("顶点\t距离\t前驱\t路径");

  for (let i = 0; i < result.distances.length; i++) {
    const distance =
      result.distances[i] === Infinity ? "∞" : result.distances[i];
    const predecessor =
      result.predecessors[i] === null ? "NIL" : result.predecessors[i];
    const path = reconstructPath(result.predecessors, source, i);
    const pathStr = path.length > 0 ? path.join(" -> ") : "无路径";

    console.log(`${i}\t${distance}\t${predecessor}\t${pathStr}`);
  }
}

/**
 * 打印所有点对最短路径结果
 */
export function printAllPairsShortestPath(
  result: AllPairsShortestPathResult,
  vertices: number
): void {
  console.log("\n所有点对最短路径距离矩阵:");

  // 打印表头
  process.stdout.write("  \t");
  for (let j = 0; j < vertices; j++) {
    process.stdout.write(`${j}\t`);
  }
  console.log();

  // 打印距离矩阵
  for (let i = 0; i < vertices; i++) {
    process.stdout.write(`${i}\t`);
    for (let j = 0; j < vertices; j++) {
      const distance =
        result.distances[i][j] === Infinity ? "∞" : result.distances[i][j];
      process.stdout.write(`${distance}\t`);
    }
    console.log();
  }

  console.log("\n示例路径 (0 -> 其他顶点):");
  for (let target = 1; target < vertices; target++) {
    const path = reconstructAllPairsPath(result.predecessors, 0, target);
    const pathStr = path.length > 0 ? path.join(" -> ") : "无路径";
    const distance =
      result.distances[0][target] === Infinity
        ? "∞"
        : result.distances[0][target];
    console.log(`到顶点${target}: ${pathStr} (距离: ${distance})`);
  }
}

/**
 * 最短路径算法工具类
 */
export class ShortestPathAlgorithms {
  /**
   * 比较不同最短路径算法的性能
   */
  static compareAlgorithms(graph: Graph, source: number = 0): void {
    console.log("=== 最短路径算法性能比较 ===\n");

    const vertices = graph.getVertices();
    console.log(`图信息: ${vertices}个顶点, ${graph.getEdgeCount()}条边\n`);

    try {
      // Dijkstra算法
      const dijkstraStart = performance.now();
      const dijkstraResult = dijkstra(graph, source);
      const dijkstraTime = performance.now() - dijkstraStart;

      console.log(`Dijkstra算法:`);
      console.log(`  耗时: ${dijkstraTime.toFixed(2)}ms`);
      console.log(
        `  是否有负权重环: ${dijkstraResult.hasNegativeCycle || false}`
      );
    } catch (error) {
      console.log(`Dijkstra算法: 错误 - ${error}`);
    }

    try {
      // Bellman-Ford算法
      const bellmanFordStart = performance.now();
      const bellmanFordResult = bellmanFord(graph, source);
      const bellmanFordTime = performance.now() - bellmanFordStart;

      console.log(`\nBellman-Ford算法:`);
      console.log(`  耗时: ${bellmanFordTime.toFixed(2)}ms`);
      console.log(
        `  是否有负权重环: ${bellmanFordResult.hasNegativeCycle || false}`
      );
    } catch (error) {
      console.log(`\nBellman-Ford算法: 错误 - ${error}`);
    }

    try {
      // SPFA算法
      const spfaStart = performance.now();
      const spfaResult = spfa(graph, source);
      const spfaTime = performance.now() - spfaStart;

      console.log(`\nSPFA算法:`);
      console.log(`  耗时: ${spfaTime.toFixed(2)}ms`);
      console.log(`  是否有负权重环: ${spfaResult.hasNegativeCycle || false}`);
    } catch (error) {
      console.log(`\nSPFA算法: 错误 - ${error}`);
    }

    // Floyd-Warshall算法（小图才测试，因为O(V³)复杂度）
    if (vertices <= 100) {
      try {
        const floydStart = performance.now();
        const floydResult = floydWarshall(graph);
        const floydTime = performance.now() - floydStart;

        console.log(`\nFloyd-Warshall算法:`);
        console.log(`  耗时: ${floydTime.toFixed(2)}ms`);
      } catch (error) {
        console.log(`\nFloyd-Warshall算法: 错误 - ${error}`);
      }
    } else {
      console.log(`\nFloyd-Warshall算法: 跳过（图太大，O(V³)复杂度）`);
    }
  }

  /**
   * 创建示例加权图
   */
  static createExampleWeightedGraph(): Graph {
    const graph = new Graph(5, true, true); // 有向加权图

    // 添加边
    graph.addEdge(0, 1, 10);
    graph.addEdge(0, 4, 5);
    graph.addEdge(1, 2, 1);
    graph.addEdge(1, 4, 2);
    graph.addEdge(2, 3, 4);
    graph.addEdge(3, 0, 7);
    graph.addEdge(3, 2, 6);
    graph.addEdge(4, 1, 3);
    graph.addEdge(4, 2, 9);
    graph.addEdge(4, 3, 2);

    return graph;
  }

  /**
   * 创建包含负权重边的图
   */
  static createNegativeWeightGraph(): Graph {
    const graph = new Graph(4, true, true); // 有向加权图

    graph.addEdge(0, 1, 1);
    graph.addEdge(0, 2, 4);
    graph.addEdge(1, 2, -3);
    graph.addEdge(1, 3, 2);
    graph.addEdge(2, 3, 3);

    return graph;
  }

  /**
   * 创建包含负权重环的图
   */
  static createNegativeCycleGraph(): Graph {
    const graph = new Graph(3, true, true); // 有向加权图

    graph.addEdge(0, 1, 1);
    graph.addEdge(1, 2, -3);
    graph.addEdge(2, 0, 1); // 形成负权重环: 0->1->2->0 总权重 = -1

    return graph;
  }

  /**
   * 演示所有最短路径算法
   */
  static demonstrateAll(): void {
    console.log("=== 最短路径算法演示 ===\n");

    // 普通加权图演示
    console.log("--- 普通加权图演示 ---");
    const normalGraph = this.createExampleWeightedGraph();
    normalGraph.printGraph();

    const dijkstraResult = dijkstra(normalGraph, 0);
    printShortestPathResult(dijkstraResult, 0);

    // 负权重图演示
    console.log("\n--- 负权重图演示 ---");
    const negativeGraph = this.createNegativeWeightGraph();
    negativeGraph.printGraph();

    const bellmanFordResult = bellmanFord(negativeGraph, 0);
    printShortestPathResult(bellmanFordResult, 0);

    // Floyd-Warshall演示
    console.log("\n--- 所有点对最短路径演示 ---");
    const floydResult = floydWarshall(negativeGraph);
    printAllPairsShortestPath(floydResult, negativeGraph.getVertices());

    // 负权重环检测
    console.log("\n--- 负权重环检测演示 ---");
    const cycleGraph = this.createNegativeCycleGraph();
    cycleGraph.printGraph();

    const cycleResult = bellmanFord(cycleGraph, 0);
    if (cycleResult.hasNegativeCycle) {
      console.log("✅ 成功检测到负权重环！");
    } else {
      console.log("❌ 未检测到负权重环");
    }

    // 性能比较
    console.log("\n--- 性能比较演示 ---");
    this.compareAlgorithms(normalGraph, 0);
  }
}

/**
 * 创建随机加权图用于测试
 */
export function createRandomWeightedGraph(
  vertices: number,
  edges: number,
  maxWeight: number = 100,
  allowNegative: boolean = false
): Graph {
  const graph = new Graph(vertices, true, true);

  for (let i = 0; i < edges; i++) {
    const from = Math.floor(Math.random() * vertices);
    const to = Math.floor(Math.random() * vertices);

    if (from !== to && !graph.hasEdge(from, to)) {
      let weight = Math.floor(Math.random() * maxWeight) + 1;
      if (allowNegative && Math.random() < 0.2) {
        weight = -weight;
      }
      graph.addEdge(from, to, weight);
    }
  }

  return graph;
}
