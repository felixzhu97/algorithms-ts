/**
 * 最小生成树算法实现
 * 《算法导论》第23章 最小生成树
 *
 * 包含以下算法：
 * 1. Kruskal算法（使用并查集）
 * 2. Prim算法（使用最小堆）
 */

import { Heap } from "../../data-structures/trees/heap";
import { Graph } from "../../data-structures/graphs";
import { MSTResult, MSTEdge, UnionFind, Edge, WeightedEdge } from "../../types";

/**
 * 并查集实现
 * 用于Kruskal算法检测环
 */
export class UnionFindSet implements UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  /**
   * 查找根节点（带路径压缩）
   */
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }

  /**
   * 合并两个集合（按秩合并）
   */
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // 已经在同一个集合中
    }

    // 按秩合并
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }

  /**
   * 检查两个元素是否连通
   */
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  /**
   * 获取连通分量数量
   */
  getComponentCount(): number {
    const roots = new Set<number>();
    for (let i = 0; i < this.parent.length; i++) {
      roots.add(this.find(i));
    }
    return roots.size;
  }
}

/**
 * Kruskal算法
 * 时间复杂度：O(E log E)
 * 空间复杂度：O(V)
 * 基于边的贪心算法
 */
export function kruskal(graph: Graph): MSTResult {
  if (graph.getIsDirected()) {
    throw new Error("最小生成树算法只适用于无向图");
  }

  if (!graph.getIsWeighted()) {
    throw new Error("最小生成树算法需要加权图");
  }

  const vertices = graph.getVertices();
  const edges = graph.getEdges();

  // 按权重排序所有边
  const sortedEdges = (edges as WeightedEdge[])
    .filter((edge: WeightedEdge) => edge.weight !== undefined)
    .map((edge: WeightedEdge) => ({ ...edge, weight: edge.weight! }))
    .sort((a: WeightedEdge, b: WeightedEdge) => a.weight - b.weight);

  const mstEdges: MSTEdge[] = [];
  const unionFind = new UnionFindSet(vertices);
  let totalWeight = 0;

  // 遍历排序后的边
  for (const edge of sortedEdges) {
    const { from, to, weight } = edge;

    // 如果添加这条边不会形成环
    if (unionFind.union(from, to)) {
      mstEdges.push({ from, to, weight });
      totalWeight += weight;

      // 如果已经有 V-1 条边，MST构建完成
      if (mstEdges.length === vertices - 1) {
        break;
      }
    }
  }

  // 检查图是否连通
  const isConnected = unionFind.getComponentCount() === 1;

  return {
    edges: mstEdges,
    totalWeight,
    isConnected,
  };
}

/**
 * Prim算法
 * 时间复杂度：O((V + E) log V) 使用最小堆
 * 空间复杂度：O(V)
 * 基于顶点的贪心算法
 */
export function prim(graph: Graph, startVertex: number = 0): MSTResult {
  if (graph.getIsDirected()) {
    throw new Error("最小生成树算法只适用于无向图");
  }

  if (!graph.getIsWeighted()) {
    throw new Error("最小生成树算法需要加权图");
  }

  const vertices = graph.getVertices();

  if (startVertex < 0 || startVertex >= vertices) {
    throw new Error(`起始顶点 ${startVertex} 超出范围`);
  }

  const mstEdges: MSTEdge[] = [];
  const inMST: boolean[] = new Array(vertices).fill(false);
  const minWeight: number[] = new Array(vertices).fill(Infinity);
  const parent: (number | null)[] = new Array(vertices).fill(null);

  // 优先队列节点
  interface PrimNode {
    vertex: number;
    weight: number;
  }

  const pq = new Heap<PrimNode>((a, b) => a.weight - b.weight);

  // 从指定顶点开始
  minWeight[startVertex] = 0;
  pq.insert({ vertex: startVertex, weight: 0 });

  let totalWeight = 0;
  let edgesAdded = 0;

  while (!pq.isEmpty() && edgesAdded < vertices - 1) {
    const current = pq.extract()!;
    const u = current.vertex;

    if (inMST[u]) continue;

    // 将顶点u加入MST
    inMST[u] = true;
    edgesAdded++;

    // 如果不是起始顶点，添加边到MST
    if (parent[u] !== null) {
      mstEdges.push({
        from: parent[u]!,
        to: u,
        weight: minWeight[u],
      });
      totalWeight += minWeight[u];
    }

    // 更新相邻顶点的最小权重
    const neighbors = graph.getWeightedNeighbors(u);
    for (const { vertex: v, weight } of neighbors) {
      if (!inMST[v] && weight < minWeight[v]) {
        minWeight[v] = weight;
        parent[v] = u;
        pq.insert({ vertex: v, weight });
      }
    }
  }

  // 检查是否所有顶点都被访问（图连通性）
  const isConnected = edgesAdded === vertices - 1;

  return {
    edges: mstEdges,
    totalWeight,
    isConnected,
  };
}

/**
 * Prim算法的简化版本（使用线性扫描而非堆）
 * 时间复杂度：O(V²)
 * 适合稠密图
 */
export function primSimple(graph: Graph, startVertex: number = 0): MSTResult {
  if (graph.getIsDirected()) {
    throw new Error("最小生成树算法只适用于无向图");
  }

  if (!graph.getIsWeighted()) {
    throw new Error("最小生成树算法需要加权图");
  }

  const vertices = graph.getVertices();

  if (startVertex < 0 || startVertex >= vertices) {
    throw new Error(`起始顶点 ${startVertex} 超出范围`);
  }

  const mstEdges: MSTEdge[] = [];
  const inMST: boolean[] = new Array(vertices).fill(false);
  const minWeight: number[] = new Array(vertices).fill(Infinity);
  const parent: (number | null)[] = new Array(vertices).fill(null);

  // 初始化起始顶点
  minWeight[startVertex] = 0;
  let totalWeight = 0;

  for (let count = 0; count < vertices; count++) {
    // 找到不在MST中的最小权重顶点
    let u = -1;
    for (let v = 0; v < vertices; v++) {
      if (!inMST[v] && (u === -1 || minWeight[v] < minWeight[u])) {
        u = v;
      }
    }

    if (u === -1 || minWeight[u] === Infinity) {
      break; // 图不连通
    }

    // 将顶点u加入MST
    inMST[u] = true;

    // 如果不是起始顶点，添加边到MST
    if (parent[u] !== null) {
      mstEdges.push({
        from: parent[u]!,
        to: u,
        weight: minWeight[u],
      });
      totalWeight += minWeight[u];
    }

    // 更新相邻顶点的最小权重
    const neighbors = graph.getWeightedNeighbors(u);
    for (const { vertex: v, weight } of neighbors) {
      if (!inMST[v] && weight < minWeight[v]) {
        minWeight[v] = weight;
        parent[v] = u;
      }
    }
  }

  // 检查连通性
  const isConnected = mstEdges.length === vertices - 1;

  return {
    edges: mstEdges,
    totalWeight,
    isConnected,
  };
}

/**
 * 验证最小生成树的正确性
 */
export function validateMST(graph: Graph, mstResult: MSTResult): boolean {
  const vertices = graph.getVertices();

  if (!mstResult.isConnected) {
    return false; // 图不连通，无法形成生成树
  }

  if (mstResult.edges.length !== vertices - 1) {
    return false; // 生成树应该有 V-1 条边
  }

  // 使用并查集检查MST的连通性
  const unionFind = new UnionFindSet(vertices);

  for (const edge of mstResult.edges) {
    if (!unionFind.union(edge.from, edge.to)) {
      return false; // 发现环
    }
  }

  // 检查是否所有顶点都连通
  return unionFind.getComponentCount() === 1;
}

/**
 * 计算图的所有生成树的数量（Kirchhoff矩阵树定理）
 * 仅适用于小图
 */
export function countSpanningTrees(graph: Graph): number {
  if (graph.getIsDirected()) {
    throw new Error("生成树计数只适用于无向图");
  }

  const vertices = graph.getVertices();
  if (vertices <= 1) return vertices;

  // 构建拉普拉斯矩阵
  const laplacian: number[][] = Array.from({ length: vertices }, () =>
    new Array(vertices).fill(0)
  );

  // 填充度数矩阵和邻接矩阵
  for (let i = 0; i < vertices; i++) {
    const neighbors = graph.getNeighbors(i);
    laplacian[i][i] = neighbors.length; // 度数

    for (const neighbor of neighbors) {
      laplacian[i][neighbor] = -1; // 邻接
    }
  }

  // 删除最后一行和最后一列，计算余子式的行列式
  const matrix: number[][] = laplacian
    .slice(0, vertices - 1)
    .map((row) => row.slice(0, vertices - 1));

  return Math.round(determinant(matrix));
}

/**
 * 计算矩阵行列式（使用高斯消元法）
 */
function determinant(matrix: number[][]): number {
  const n = matrix.length;
  if (n === 0) return 1;
  if (n === 1) return matrix[0][0];

  // 创建矩阵副本
  const mat = matrix.map((row) => [...row]);
  let det = 1;

  for (let i = 0; i < n; i++) {
    // 找到主元
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
        maxRow = k;
      }
    }

    // 交换行
    if (maxRow !== i) {
      [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
      det = -det;
    }

    // 如果主元为0，行列式为0
    if (Math.abs(mat[i][i]) < 1e-10) {
      return 0;
    }

    det *= mat[i][i];

    // 消元
    for (let k = i + 1; k < n; k++) {
      const factor = mat[k][i] / mat[i][i];
      for (let j = i; j < n; j++) {
        mat[k][j] -= factor * mat[i][j];
      }
    }
  }

  return det;
}

/**
 * 打印最小生成树结果
 */
export function printMSTResult(result: MSTResult): void {
  console.log("\n最小生成树结果:");

  if (!result.isConnected) {
    console.log("❌ 图不连通，无法构建生成树");
    return;
  }

  console.log(`总权重: ${result.totalWeight}`);
  console.log(`边数: ${result.edges.length}`);
  console.log("MST边:");

  result.edges.forEach((edge, index) => {
    console.log(
      `  ${index + 1}. ${edge.from} -- ${edge.to} (权重: ${edge.weight})`
    );
  });
}

/**
 * 最小生成树算法工具类
 */
export class MSTAlgorithms {
  /**
   * 比较Kruskal和Prim算法
   */
  static compareAlgorithms(graph: Graph): void {
    console.log("=== 最小生成树算法比较 ===\n");

    const vertices = graph.getVertices();
    const edges = graph.getEdgeCount();

    console.log(`图信息: ${vertices}个顶点, ${edges}条边\n`);

    try {
      // Kruskal算法
      const kruskalStart = performance.now();
      const kruskalResult = kruskal(graph);
      const kruskalTime = performance.now() - kruskalStart;

      console.log("Kruskal算法:");
      console.log(`  耗时: ${kruskalTime.toFixed(2)}ms`);
      console.log(`  总权重: ${kruskalResult.totalWeight}`);
      console.log(`  连通性: ${kruskalResult.isConnected ? "连通" : "不连通"}`);
      console.log(
        `  有效性: ${validateMST(graph, kruskalResult) ? "✅" : "❌"}`
      );
    } catch (error) {
      console.log(`Kruskal算法: 错误 - ${error}`);
    }

    try {
      // Prim算法（堆优化）
      const primStart = performance.now();
      const primResult = prim(graph, 0);
      const primTime = performance.now() - primStart;

      console.log(`\nPrim算法（堆优化）:`);
      console.log(`  耗时: ${primTime.toFixed(2)}ms`);
      console.log(`  总权重: ${primResult.totalWeight}`);
      console.log(`  连通性: ${primResult.isConnected ? "连通" : "不连通"}`);
      console.log(`  有效性: ${validateMST(graph, primResult) ? "✅" : "❌"}`);
    } catch (error) {
      console.log(`\nPrim算法（堆优化）: 错误 - ${error}`);
    }

    try {
      // Prim算法（简单版本）
      const primSimpleStart = performance.now();
      const primSimpleResult = primSimple(graph, 0);
      const primSimpleTime = performance.now() - primSimpleStart;

      console.log(`\nPrim算法（O(V²)版本）:`);
      console.log(`  耗时: ${primSimpleTime.toFixed(2)}ms`);
      console.log(`  总权重: ${primSimpleResult.totalWeight}`);
      console.log(
        `  连通性: ${primSimpleResult.isConnected ? "连通" : "不连通"}`
      );
      console.log(
        `  有效性: ${validateMST(graph, primSimpleResult) ? "✅" : "❌"}`
      );
    } catch (error) {
      console.log(`\nPrim算法（O(V²)版本）: 错误 - ${error}`);
    }

    // 生成树计数（小图）
    if (vertices <= 10) {
      try {
        const spanningTreeCount = countSpanningTrees(graph);
        console.log(`\n生成树总数: ${spanningTreeCount}`);
      } catch (error) {
        console.log(`\n生成树计数: 错误 - ${error}`);
      }
    }
  }

  /**
   * 创建示例加权无向图
   */
  static createExampleGraph(): Graph {
    const graph = new Graph(6, false, true); // 无向加权图

    // 添加边
    graph.addEdge(0, 1, 4);
    graph.addEdge(0, 2, 4);
    graph.addEdge(1, 2, 2);
    graph.addEdge(1, 3, 5);
    graph.addEdge(2, 3, 8);
    graph.addEdge(2, 4, 10);
    graph.addEdge(2, 5, 2);
    graph.addEdge(3, 4, 2);
    graph.addEdge(3, 5, 6);
    graph.addEdge(4, 5, 3);

    return graph;
  }

  /**
   * 创建不连通图用于测试
   */
  static createDisconnectedGraph(): Graph {
    const graph = new Graph(6, false, true); // 无向加权图

    // 第一个连通分量: 0, 1, 2
    graph.addEdge(0, 1, 1);
    graph.addEdge(1, 2, 2);
    graph.addEdge(2, 0, 3);

    // 第二个连通分量: 3, 4
    graph.addEdge(3, 4, 4);

    // 顶点5是孤立的

    return graph;
  }

  /**
   * 演示所有最小生成树算法
   */
  static demonstrateAll(): void {
    console.log("=== 最小生成树算法演示 ===\n");

    // 连通图演示
    console.log("--- 连通图演示 ---");
    const connectedGraph = this.createExampleGraph();
    connectedGraph.printGraph();

    const kruskalResult = kruskal(connectedGraph);
    printMSTResult(kruskalResult);

    const primResult = prim(connectedGraph, 0);
    console.log("\nPrim算法验证:");
    console.log(
      `权重一致性: ${
        kruskalResult.totalWeight === primResult.totalWeight ? "✅" : "❌"
      }`
    );

    // 不连通图演示
    console.log("\n--- 不连通图演示 ---");
    const disconnectedGraph = this.createDisconnectedGraph();
    disconnectedGraph.printGraph();

    const disconnectedResult = kruskal(disconnectedGraph);
    printMSTResult(disconnectedResult);

    // 性能比较
    console.log("\n--- 性能比较 ---");
    this.compareAlgorithms(connectedGraph);
  }
}

/**
 * 创建随机加权无向图
 */
export function createRandomWeightedUndirectedGraph(
  vertices: number,
  edges: number,
  maxWeight: number = 100
): Graph {
  const graph = new Graph(vertices, false, true);

  // 确保图连通：先构建一个生成树
  for (let i = 1; i < vertices; i++) {
    const parent = Math.floor(Math.random() * i);
    const weight = Math.floor(Math.random() * maxWeight) + 1;
    graph.addEdge(parent, i, weight);
  }

  // 添加剩余的随机边
  const remainingEdges = edges - (vertices - 1);
  let addedEdges = 0;

  while (addedEdges < remainingEdges) {
    const from = Math.floor(Math.random() * vertices);
    const to = Math.floor(Math.random() * vertices);

    if (from !== to && !graph.hasEdge(from, to)) {
      const weight = Math.floor(Math.random() * maxWeight) + 1;
      graph.addEdge(from, to, weight);
      addedEdges++;
    }
  }

  return graph;
}
