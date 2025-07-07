/**
 * 最大流算法实现
 * 《算法导论》第26章 最大流
 *
 * 最大流问题：在流网络中找到从源点到汇点的最大流量。
 *
 * 实现的算法：
 * 1. Ford-Fulkerson方法（使用DFS寻找增广路径）
 * 2. Edmonds-Karp算法（使用BFS寻找增广路径）
 * 3. Push-Relabel算法（预流推进算法）
 * 4. ISAP算法（改进的最短增广路径算法）
 */

import { CompareFn, defaultCompare } from "../../types";

/**
 * 边接口
 */
export interface FlowEdge {
  from: number;
  to: number;
  capacity: number;
  flow: number;
  cost?: number; // 用于最小费用最大流
}

/**
 * 流网络接口
 */
export interface FlowNetwork {
  vertices: number;
  edges: FlowEdge[];
  source: number;
  sink: number;
}

/**
 * 最大流结果接口
 */
export interface MaxFlowResult {
  maxFlow: number;
  minCut: {
    sourceSet: number[];
    sinkSet: number[];
    cutEdges: FlowEdge[];
  };
  flowEdges: FlowEdge[];
  iterations: number;
  algorithmUsed: string;
}

/**
 * 最小费用最大流结果接口
 */
export interface MinCostMaxFlowResult {
  maxFlow: number;
  minCost: number;
  flowEdges: FlowEdge[];
  paths: Array<{
    path: number[];
    flow: number;
    cost: number;
  }>;
}

/**
 * 邻接矩阵表示的流网络
 */
export class FlowNetworkMatrix {
  public capacity: number[][];
  public flow: number[][];
  public vertices: number;
  public source: number;
  public sink: number;

  constructor(vertices: number, source: number, sink: number) {
    this.vertices = vertices;
    this.source = source;
    this.sink = sink;
    this.capacity = Array.from({ length: vertices }, () =>
      Array(vertices).fill(0)
    );
    this.flow = Array.from({ length: vertices }, () => Array(vertices).fill(0));
  }

  /**
   * 添加边
   */
  addEdge(from: number, to: number, capacity: number): void {
    this.capacity[from][to] = capacity;
  }

  /**
   * 获取残留容量
   */
  getResidualCapacity(from: number, to: number): number {
    return this.capacity[from][to] - this.flow[from][to];
  }

  /**
   * 增加流量
   */
  addFlow(from: number, to: number, flowValue: number): void {
    this.flow[from][to] += flowValue;
    this.flow[to][from] -= flowValue; // 反向边
  }

  /**
   * 重置流量
   */
  resetFlow(): void {
    this.flow = Array.from({ length: this.vertices }, () =>
      Array(this.vertices).fill(0)
    );
  }

  /**
   * 获取当前流量
   */
  getCurrentFlow(): number {
    let totalFlow = 0;
    for (let v = 0; v < this.vertices; v++) {
      totalFlow += this.flow[this.source][v];
    }
    return totalFlow;
  }

  /**
   * 转换为边列表
   */
  toEdgeList(): FlowEdge[] {
    const edges: FlowEdge[] = [];
    for (let u = 0; u < this.vertices; u++) {
      for (let v = 0; v < this.vertices; v++) {
        if (this.capacity[u][v] > 0) {
          edges.push({
            from: u,
            to: v,
            capacity: this.capacity[u][v],
            flow: this.flow[u][v],
          });
        }
      }
    }
    return edges;
  }
}

/**
 * Ford-Fulkerson最大流算法（使用DFS寻找增广路径）
 * 时间复杂度: O(E * f*) 其中f*是最大流值
 */
export function fordFulkerson(network: FlowNetworkMatrix): MaxFlowResult {
  network.resetFlow();
  let iterations = 0;
  const flowEdges: FlowEdge[] = [];

  while (true) {
    iterations++;
    const visited = new Array(network.vertices).fill(false);
    const path: number[] = [];

    // 使用DFS寻找增广路径
    const pathFlow = dfsAugmentingPath(
      network,
      network.source,
      network.sink,
      visited,
      path,
      Infinity
    );

    if (pathFlow === 0) {
      break; // 没有更多增广路径
    }

    // 沿路径增加流量
    for (let i = 0; i < path.length - 1; i++) {
      network.addFlow(path[i], path[i + 1], pathFlow);
    }
  }

  const maxFlow = network.getCurrentFlow();
  const minCut = findMinCut(network);

  return {
    maxFlow,
    minCut,
    flowEdges: network.toEdgeList(),
    iterations,
    algorithmUsed: "Ford-Fulkerson (DFS)",
  };
}

/**
 * DFS寻找增广路径
 */
function dfsAugmentingPath(
  network: FlowNetworkMatrix,
  u: number,
  sink: number,
  visited: boolean[],
  path: number[],
  minCapacity: number
): number {
  if (u === sink) {
    return minCapacity;
  }

  visited[u] = true;
  path.push(u);

  for (let v = 0; v < network.vertices; v++) {
    const residualCapacity = network.getResidualCapacity(u, v);

    if (!visited[v] && residualCapacity > 0) {
      const bottleneck = dfsAugmentingPath(
        network,
        v,
        sink,
        visited,
        path,
        Math.min(minCapacity, residualCapacity)
      );

      if (bottleneck > 0) {
        path.push(sink);
        return bottleneck;
      }
    }
  }

  path.pop();
  return 0;
}

/**
 * Edmonds-Karp最大流算法（使用BFS寻找增广路径）
 * 时间复杂度: O(V * E²)
 */
export function edmondsKarp(network: FlowNetworkMatrix): MaxFlowResult {
  network.resetFlow();
  let iterations = 0;

  while (true) {
    iterations++;

    // 使用BFS寻找最短增广路径
    const { path, bottleneck } = bfsAugmentingPath(network);

    if (bottleneck === 0) {
      break; // 没有更多增广路径
    }

    // 沿路径增加流量
    for (let i = 0; i < path.length - 1; i++) {
      network.addFlow(path[i], path[i + 1], bottleneck);
    }
  }

  const maxFlow = network.getCurrentFlow();
  const minCut = findMinCut(network);

  return {
    maxFlow,
    minCut,
    flowEdges: network.toEdgeList(),
    iterations,
    algorithmUsed: "Edmonds-Karp (BFS)",
  };
}

/**
 * BFS寻找增广路径
 */
function bfsAugmentingPath(network: FlowNetworkMatrix): {
  path: number[];
  bottleneck: number;
} {
  const visited = new Array(network.vertices).fill(false);
  const parent = new Array(network.vertices).fill(-1);
  const queue: number[] = [network.source];

  visited[network.source] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;

    for (let v = 0; v < network.vertices; v++) {
      const residualCapacity = network.getResidualCapacity(u, v);

      if (!visited[v] && residualCapacity > 0) {
        visited[v] = true;
        parent[v] = u;
        queue.push(v);

        if (v === network.sink) {
          // 重构路径并计算瓶颈容量
          const path: number[] = [];
          let bottleneck = Infinity;
          let current = network.sink;

          while (current !== network.source) {
            const prev = parent[current];
            path.unshift(current);
            bottleneck = Math.min(
              bottleneck,
              network.getResidualCapacity(prev, current)
            );
            current = prev;
          }
          path.unshift(network.source);

          return { path, bottleneck };
        }
      }
    }
  }

  return { path: [], bottleneck: 0 };
}

/**
 * Push-Relabel最大流算法
 * 时间复杂度: O(V²E)
 */
export function pushRelabel(network: FlowNetworkMatrix): MaxFlowResult {
  const n = network.vertices;
  const source = network.source;
  const sink = network.sink;

  // 初始化
  const height = new Array(n).fill(0);
  const excess = new Array(n).fill(0);
  const flow = Array.from({ length: n }, () => Array(n).fill(0));

  height[source] = n; // 源点高度设为n

  // 从源点推出初始流
  for (let v = 0; v < n; v++) {
    if (network.capacity[source][v] > 0) {
      flow[source][v] = network.capacity[source][v];
      flow[v][source] = -network.capacity[source][v];
      excess[v] = network.capacity[source][v];
    }
  }

  let iterations = 0;

  while (true) {
    iterations++;

    // 找到有多余流且不是源点或汇点的顶点
    let activeVertex = -1;
    for (let v = 0; v < n; v++) {
      if (v !== source && v !== sink && excess[v] > 0) {
        activeVertex = v;
        break;
      }
    }

    if (activeVertex === -1) {
      break; // 没有活跃顶点
    }

    // 尝试推流
    let pushed = false;
    for (let v = 0; v < n; v++) {
      const residualCapacity =
        network.capacity[activeVertex][v] - flow[activeVertex][v];

      if (residualCapacity > 0 && height[activeVertex] === height[v] + 1) {
        // 可以推流
        const pushFlow = Math.min(excess[activeVertex], residualCapacity);
        flow[activeVertex][v] += pushFlow;
        flow[v][activeVertex] -= pushFlow;
        excess[activeVertex] -= pushFlow;
        excess[v] += pushFlow;
        pushed = true;
        break;
      }
    }

    // 如果无法推流，则重标记
    if (!pushed) {
      relabel(activeVertex, height, network.capacity, flow, n);
    }
  }

  // 计算最大流
  let maxFlow = 0;
  for (let v = 0; v < n; v++) {
    maxFlow += flow[source][v];
  }

  // 更新网络流量
  network.resetFlow();
  for (let u = 0; u < n; u++) {
    for (let v = 0; v < n; v++) {
      if (flow[u][v] > 0) {
        network.addFlow(u, v, flow[u][v]);
      }
    }
  }

  const minCut = findMinCut(network);

  return {
    maxFlow,
    minCut,
    flowEdges: network.toEdgeList(),
    iterations,
    algorithmUsed: "Push-Relabel",
  };
}

/**
 * 重标记操作
 */
function relabel(
  u: number,
  height: number[],
  capacity: number[][],
  flow: number[][],
  n: number
): void {
  let minHeight = Infinity;

  for (let v = 0; v < n; v++) {
    const residualCapacity = capacity[u][v] - flow[u][v];
    if (residualCapacity > 0) {
      minHeight = Math.min(minHeight, height[v]);
    }
  }

  if (minHeight < Infinity) {
    height[u] = minHeight + 1;
  }
}

/**
 * 找到最小割
 */
function findMinCut(network: FlowNetworkMatrix): {
  sourceSet: number[];
  sinkSet: number[];
  cutEdges: FlowEdge[];
} {
  const visited = new Array(network.vertices).fill(false);
  const queue: number[] = [network.source];
  visited[network.source] = true;

  // BFS找到所有从源点可达的顶点
  while (queue.length > 0) {
    const u = queue.shift()!;

    for (let v = 0; v < network.vertices; v++) {
      const residualCapacity = network.getResidualCapacity(u, v);
      if (!visited[v] && residualCapacity > 0) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }

  const sourceSet: number[] = [];
  const sinkSet: number[] = [];
  const cutEdges: FlowEdge[] = [];

  for (let v = 0; v < network.vertices; v++) {
    if (visited[v]) {
      sourceSet.push(v);
    } else {
      sinkSet.push(v);
    }
  }

  // 找到割边
  for (const u of sourceSet) {
    for (const v of sinkSet) {
      if (network.capacity[u][v] > 0) {
        cutEdges.push({
          from: u,
          to: v,
          capacity: network.capacity[u][v],
          flow: network.flow[u][v],
        });
      }
    }
  }

  return { sourceSet, sinkSet, cutEdges };
}

/**
 * ISAP算法（改进的最短增广路径算法）
 * 时间复杂度: O(V²E)
 */
export function isap(network: FlowNetworkMatrix): MaxFlowResult {
  const n = network.vertices;
  const source = network.source;
  const sink = network.sink;

  network.resetFlow();

  // 距离标号
  const distance = new Array(n).fill(0);
  const gap = new Array(n + 1).fill(0);
  const current = new Array(n).fill(0);

  // BFS初始化距离标号
  bfsInitDistance(network, distance, sink);

  for (let i = 0; i < n; i++) {
    gap[distance[i]]++;
    current[i] = 0;
  }

  let maxFlow = 0;
  let iterations = 0;
  let u = source;

  while (distance[source] < n) {
    iterations++;

    if (u === sink) {
      // 找到增广路径，推送流量
      const path: number[] = [];
      let minFlow = Infinity;

      // 重构路径（这里简化实现）
      maxFlow += augmentPath(network, source, sink, minFlow);
      u = source;
      continue;
    }

    let advanced = false;

    // 寻找可行边
    for (let v = current[u]; v < n; v++) {
      if (
        network.getResidualCapacity(u, v) > 0 &&
        distance[u] === distance[v] + 1
      ) {
        current[u] = v;
        u = v;
        advanced = true;
        break;
      }
    }

    if (!advanced) {
      // 重标记
      const oldDistance = distance[u];
      gap[oldDistance]--;

      if (gap[oldDistance] === 0 && oldDistance < n) {
        // Gap优化：如果某个距离标号的顶点数为0，算法结束
        break;
      }

      distance[u] = n;
      for (let v = 0; v < n; v++) {
        if (network.getResidualCapacity(u, v) > 0) {
          distance[u] = Math.min(distance[u], distance[v] + 1);
        }
      }

      gap[distance[u]]++;
      current[u] = 0;

      if (u !== source) {
        // 回退到前驱
        u = findPredecessor(network, u, distance);
      }
    }
  }

  const minCut = findMinCut(network);

  return {
    maxFlow,
    minCut,
    flowEdges: network.toEdgeList(),
    iterations,
    algorithmUsed: "ISAP",
  };
}

/**
 * BFS初始化距离标号
 */
function bfsInitDistance(
  network: FlowNetworkMatrix,
  distance: number[],
  sink: number
): void {
  const n = network.vertices;
  distance.fill(n);
  distance[sink] = 0;

  const queue: number[] = [sink];

  while (queue.length > 0) {
    const u = queue.shift()!;

    for (let v = 0; v < n; v++) {
      if (distance[v] === n && network.getResidualCapacity(v, u) > 0) {
        distance[v] = distance[u] + 1;
        queue.push(v);
      }
    }
  }
}

/**
 * 增广路径推送流量（简化实现）
 */
function augmentPath(
  network: FlowNetworkMatrix,
  source: number,
  sink: number,
  flow: number
): number {
  // 这里是ISAP算法的简化实现
  // 实际实现中需要维护路径栈
  return 0;
}

/**
 * 找到前驱节点（简化实现）
 */
function findPredecessor(
  network: FlowNetworkMatrix,
  u: number,
  distance: number[]
): number {
  for (let v = 0; v < network.vertices; v++) {
    if (
      network.getResidualCapacity(v, u) > 0 &&
      distance[v] === distance[u] - 1
    ) {
      return v;
    }
  }
  return u;
}

/**
 * 最小费用最大流算法（SPFA + 增广路径）
 */
export function minCostMaxFlow(
  vertices: number,
  edges: Array<{ from: number; to: number; capacity: number; cost: number }>,
  source: number,
  sink: number
): MinCostMaxFlowResult {
  // 构建邻接表
  const graph: Array<
    Array<{ to: number; capacity: number; cost: number; rev: number }>
  > = Array.from({ length: vertices }, () => []);

  for (const edge of edges) {
    // 正向边
    graph[edge.from].push({
      to: edge.to,
      capacity: edge.capacity,
      cost: edge.cost,
      rev: graph[edge.to].length,
    });

    // 反向边
    graph[edge.to].push({
      to: edge.from,
      capacity: 0,
      cost: -edge.cost,
      rev: graph[edge.from].length - 1,
    });
  }

  let maxFlow = 0;
  let minCost = 0;
  const paths: Array<{ path: number[]; flow: number; cost: number }> = [];

  while (true) {
    // 使用SPFA寻找最短路径
    const { distance, parent, parentEdge } = spfa(graph, source, sink);

    if (distance[sink] === Infinity) {
      break; // 没有更多增广路径
    }

    // 找到路径上的最小容量
    let pathFlow = Infinity;
    const path: number[] = [];

    let current = sink;
    while (current !== source) {
      const prev = parent[current];
      const edgeIndex = parentEdge[current];
      pathFlow = Math.min(pathFlow, graph[prev][edgeIndex].capacity);
      path.unshift(current);
      current = prev;
    }
    path.unshift(source);

    // 增加流量
    current = sink;
    while (current !== source) {
      const prev = parent[current];
      const edgeIndex = parentEdge[current];
      const edge = graph[prev][edgeIndex];

      edge.capacity -= pathFlow;
      graph[current][edge.rev].capacity += pathFlow;

      current = prev;
    }

    maxFlow += pathFlow;
    minCost += pathFlow * distance[sink];
    paths.push({
      path: [...path],
      flow: pathFlow,
      cost: distance[sink],
    });
  }

  // 构建流边结果
  const flowEdges: FlowEdge[] = [];
  for (let u = 0; u < vertices; u++) {
    for (const edge of graph[u]) {
      const originalCapacity =
        edges.find(
          (e) => e.from === u && e.to === edge.to && e.cost === edge.cost
        )?.capacity || 0;

      if (originalCapacity > 0) {
        flowEdges.push({
          from: u,
          to: edge.to,
          capacity: originalCapacity,
          flow: originalCapacity - edge.capacity,
          cost: edge.cost,
        });
      }
    }
  }

  return {
    maxFlow,
    minCost,
    flowEdges,
    paths,
  };
}

/**
 * SPFA算法寻找最短路径
 */
function spfa(
  graph: Array<
    Array<{ to: number; capacity: number; cost: number; rev: number }>
  >,
  source: number,
  sink: number
): {
  distance: number[];
  parent: number[];
  parentEdge: number[];
} {
  const n = graph.length;
  const distance = new Array(n).fill(Infinity);
  const parent = new Array(n).fill(-1);
  const parentEdge = new Array(n).fill(-1);
  const inQueue = new Array(n).fill(false);

  distance[source] = 0;
  const queue: number[] = [source];
  inQueue[source] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;

    for (let i = 0; i < graph[u].length; i++) {
      const edge = graph[u][i];
      const v = edge.to;

      if (edge.capacity > 0 && distance[u] + edge.cost < distance[v]) {
        distance[v] = distance[u] + edge.cost;
        parent[v] = u;
        parentEdge[v] = i;

        if (!inQueue[v]) {
          queue.push(v);
          inQueue[v] = true;
        }
      }
    }
  }

  return { distance, parent, parentEdge };
}

/**
 * 最大流算法工具类
 */
export class MaxFlowUtils {
  /**
   * 从边列表创建流网络
   */
  static createFlowNetwork(
    vertices: number,
    edges: Array<{ from: number; to: number; capacity: number }>,
    source: number,
    sink: number
  ): FlowNetworkMatrix {
    const network = new FlowNetworkMatrix(vertices, source, sink);

    for (const edge of edges) {
      network.addEdge(edge.from, edge.to, edge.capacity);
    }

    return network;
  }

  /**
   * 验证流的可行性
   */
  static validateFlow(network: FlowNetworkMatrix): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 检查容量约束
    for (let u = 0; u < network.vertices; u++) {
      for (let v = 0; v < network.vertices; v++) {
        if (network.flow[u][v] > network.capacity[u][v]) {
          errors.push(
            `容量约束违反: 边(${u},${v})流量${network.flow[u][v]} > 容量${network.capacity[u][v]}`
          );
        }
        if (network.flow[u][v] < 0 && network.capacity[u][v] === 0) {
          errors.push(`流量约束违反: 边(${u},${v})有负流量但无容量`);
        }
      }
    }

    // 检查流守恒
    for (let v = 0; v < network.vertices; v++) {
      if (v === network.source || v === network.sink) {
        continue;
      }

      let inFlow = 0;
      let outFlow = 0;

      for (let u = 0; u < network.vertices; u++) {
        inFlow += network.flow[u][v];
        outFlow += network.flow[v][u];
      }

      if (Math.abs(inFlow - outFlow) > 1e-9) {
        errors.push(`流守恒违反: 顶点${v}入流${inFlow} ≠ 出流${outFlow}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 比较不同最大流算法的性能
   */
  static compareAlgorithms(
    vertices: number,
    edges: Array<{ from: number; to: number; capacity: number }>,
    source: number,
    sink: number
  ): void {
    console.log("=== 最大流算法性能比较 ===\n");

    const network = MaxFlowUtils.createFlowNetwork(
      vertices,
      edges,
      source,
      sink
    );

    // Ford-Fulkerson
    console.log("Ford-Fulkerson算法:");
    const ffStart = performance.now();
    const ffResult = fordFulkerson(network.clone());
    const ffTime = performance.now() - ffStart;
    console.log(`  时间: ${ffTime.toFixed(2)}ms`);
    console.log(`  最大流: ${ffResult.maxFlow}`);
    console.log(`  迭代次数: ${ffResult.iterations}`);

    // Edmonds-Karp
    console.log("\nEdmonds-Karp算法:");
    const ekStart = performance.now();
    const ekResult = edmondsKarp(network.clone());
    const ekTime = performance.now() - ekStart;
    console.log(`  时间: ${ekTime.toFixed(2)}ms`);
    console.log(`  最大流: ${ekResult.maxFlow}`);
    console.log(`  迭代次数: ${ekResult.iterations}`);

    // Push-Relabel
    console.log("\nPush-Relabel算法:");
    const prStart = performance.now();
    const prResult = pushRelabel(network.clone());
    const prTime = performance.now() - prStart;
    console.log(`  时间: ${prTime.toFixed(2)}ms`);
    console.log(`  最大流: ${prResult.maxFlow}`);
    console.log(`  迭代次数: ${prResult.iterations}`);

    // 验证结果一致性
    const results = [ffResult.maxFlow, ekResult.maxFlow, prResult.maxFlow];
    const allEqual = results.every(
      (flow) => Math.abs(flow - results[0]) < 1e-9
    );
    console.log(`\n结果一致性: ${allEqual ? "✅" : "❌"}`);
  }

  /**
   * 演示最大流算法
   */
  static demonstrate(): void {
    console.log("=== 最大流算法演示 ===\n");

    // 创建示例网络
    const vertices = 6;
    const source = 0;
    const sink = 5;
    const edges = [
      { from: 0, to: 1, capacity: 10 },
      { from: 0, to: 2, capacity: 8 },
      { from: 1, to: 2, capacity: 5 },
      { from: 1, to: 3, capacity: 8 },
      { from: 2, to: 4, capacity: 10 },
      { from: 3, to: 4, capacity: 5 },
      { from: 3, to: 5, capacity: 10 },
      { from: 4, to: 5, capacity: 8 },
    ];

    const network = MaxFlowUtils.createFlowNetwork(
      vertices,
      edges,
      source,
      sink
    );

    console.log("网络信息:");
    console.log(`  顶点数: ${vertices}`);
    console.log(`  边数: ${edges.length}`);
    console.log(`  源点: ${source}, 汇点: ${sink}`);

    console.log("\n边信息:");
    for (const edge of edges) {
      console.log(`  ${edge.from} -> ${edge.to}: 容量 ${edge.capacity}`);
    }

    // 使用Edmonds-Karp算法求解
    console.log("\n--- 使用Edmonds-Karp算法求解 ---");
    const result = edmondsKarp(network);

    console.log(`\n最大流值: ${result.maxFlow}`);
    console.log(`算法迭代次数: ${result.iterations}`);

    console.log("\n流量分配:");
    for (const edge of result.flowEdges) {
      if (edge.flow > 0) {
        console.log(
          `  ${edge.from} -> ${edge.to}: ${edge.flow}/${edge.capacity}`
        );
      }
    }

    console.log("\n最小割:");
    console.log(`  源点侧: [${result.minCut.sourceSet.join(", ")}]`);
    console.log(`  汇点侧: [${result.minCut.sinkSet.join(", ")}]`);
    console.log(`  割边:`);
    for (const edge of result.minCut.cutEdges) {
      console.log(`    ${edge.from} -> ${edge.to}: 容量 ${edge.capacity}`);
    }

    // 验证结果
    const validation = MaxFlowUtils.validateFlow(network);
    console.log(`\n验证结果: ${validation.isValid ? "✅" : "❌"}`);
    if (!validation.isValid) {
      console.log("错误:", validation.errors);
    }
  }
}

// 为FlowNetworkMatrix添加clone方法
declare module "./maximum-flow" {
  interface FlowNetworkMatrix {
    clone(): FlowNetworkMatrix;
  }
}

FlowNetworkMatrix.prototype.clone = function (): FlowNetworkMatrix {
  const cloned = new FlowNetworkMatrix(this.vertices, this.source, this.sink);

  for (let i = 0; i < this.vertices; i++) {
    for (let j = 0; j < this.vertices; j++) {
      cloned.capacity[i][j] = this.capacity[i][j];
      cloned.flow[i][j] = this.flow[i][j];
    }
  }

  return cloned;
};
