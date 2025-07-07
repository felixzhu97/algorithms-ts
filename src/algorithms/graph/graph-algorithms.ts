/**
 * 图算法实现
 * 《算法导论》第22章 图的基本算法
 *
 * 包含以下算法：
 * 1. 广度优先搜索（BFS）
 * 2. 深度优先搜索（DFS）
 * 3. 拓扑排序
 * 4. 强连通分量（Kosaraju算法）
 */

import {
  AdjacencyList,
  WeightedAdjacencyList,
  Color,
  Vertex,
  BFSResult,
  DFSResult,
  TopologicalSortResult,
  SCCResult,
} from "../../types";
import { Graph } from "../../data-structures/graphs";

/**
 * 广度优先搜索（BFS）
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V)
 */
export function breadthFirstSearch(graph: Graph, source: number): BFSResult {
  const vertices = graph.getVertexCount();

  if (source < 0 || source >= vertices) {
    throw new Error(`源顶点 ${source} 超出范围`);
  }

  // 初始化所有顶点
  const vertexStates: Vertex[] = Array.from({ length: vertices }, (_, i) => ({
    id: i,
    color: Color.WHITE,
    distance: Infinity,
    parent: null,
  }));

  const distances: number[] = new Array(vertices).fill(Infinity);
  const parents: (number | null)[] = new Array(vertices).fill(null);
  const visited: boolean[] = new Array(vertices).fill(false);

  // 初始化源顶点
  vertexStates[source].color = Color.GRAY;
  vertexStates[source].distance = 0;
  distances[source] = 0;
  visited[source] = true;

  const queue: number[] = [source];

  while (queue.length > 0) {
    const u = queue.shift()!;

    // 遍历所有邻居
    for (const v of graph.getNeighbors(u)) {
      if (vertexStates[v].color === Color.WHITE) {
        vertexStates[v].color = Color.GRAY;
        vertexStates[v].distance = vertexStates[u].distance + 1;
        vertexStates[v].parent = u;

        distances[v] = vertexStates[v].distance;
        parents[v] = u;
        visited[v] = true;

        queue.push(v);
      }
    }

    vertexStates[u].color = Color.BLACK;
  }

  return {
    vertices: vertexStates,
    distances,
    parents,
    visited,
  };
}

/**
 * 深度优先搜索（DFS）
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V)
 */
export function depthFirstSearch(graph: Graph): DFSResult {
  const vertices = graph.getVertexCount();

  // 初始化所有顶点
  const vertexStates: Vertex[] = Array.from({ length: vertices }, (_, i) => ({
    id: i,
    color: Color.WHITE,
    distance: 0,
    parent: null,
    discoveryTime: 0,
    finishTime: 0,
  }));

  const parents: (number | null)[] = new Array(vertices).fill(null);
  const discoveryTimes: number[] = new Array(vertices).fill(0);
  const finishTimes: number[] = new Array(vertices).fill(0);
  let time = 0;

  // DFS访问函数
  function dfsVisit(u: number): void {
    time++;
    vertexStates[u].discoveryTime = time;
    discoveryTimes[u] = time;
    vertexStates[u].color = Color.GRAY;

    // 访问所有邻居
    for (const v of graph.getNeighbors(u)) {
      if (vertexStates[v].color === Color.WHITE) {
        vertexStates[v].parent = u;
        parents[v] = u;
        dfsVisit(v);
      }
    }

    vertexStates[u].color = Color.BLACK;
    time++;
    vertexStates[u].finishTime = time;
    finishTimes[u] = time;
  }

  // 对所有白色顶点执行DFS
  for (let u = 0; u < vertices; u++) {
    if (vertexStates[u].color === Color.WHITE) {
      dfsVisit(u);
    }
  }

  return {
    vertices: vertexStates,
    parents,
    discoveryTimes,
    finishTimes,
    time,
  };
}

/**
 * 拓扑排序（仅适用于有向无环图DAG）
 * 使用DFS实现
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V)
 */
export function topologicalSort(graph: Graph): TopologicalSortResult {
  const graphInfo = graph.getInfo();

  if (!graphInfo.isDirected) {
    throw new Error("拓扑排序只适用于有向图");
  }

  const vertices = graph.getVertexCount();
  const vertexStates: Vertex[] = Array.from({ length: vertices }, (_, i) => ({
    id: i,
    color: Color.WHITE,
    distance: 0,
    parent: null,
    discoveryTime: 0,
    finishTime: 0,
  }));

  const order: number[] = [];
  let time = 0;
  let isDAG = true;

  // DFS访问函数，检测环并构建拓扑序
  function dfsVisit(u: number): void {
    time++;
    vertexStates[u].discoveryTime = time;
    vertexStates[u].color = Color.GRAY;

    for (const v of graph.getNeighbors(u)) {
      if (vertexStates[v].color === Color.WHITE) {
        vertexStates[v].parent = u;
        dfsVisit(v);
      } else if (vertexStates[v].color === Color.GRAY) {
        // 发现后向边，说明存在环
        isDAG = false;
      }
    }

    vertexStates[u].color = Color.BLACK;
    time++;
    vertexStates[u].finishTime = time;

    // 在顶点完成时将其加入拓扑序的前面
    order.unshift(u);
  }

  // 对所有白色顶点执行DFS
  for (let u = 0; u < vertices; u++) {
    if (vertexStates[u].color === Color.WHITE) {
      dfsVisit(u);
    }
  }

  return {
    order: isDAG ? order : [],
    isDAG,
  };
}

/**
 * Kosaraju强连通分量算法
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V)
 */
export function stronglyConnectedComponents(graph: Graph): SCCResult {
  const graphInfo = graph.getInfo();

  if (!graphInfo.isDirected) {
    throw new Error("强连通分量算法只适用于有向图");
  }

  const vertices = graph.getVertexCount();

  // 第一步：对原图执行DFS，获取完成时间
  const dfsResult = depthFirstSearch(graph);

  // 按完成时间降序排列顶点
  const verticesByFinishTime = Array.from(
    { length: vertices },
    (_, i) => i
  ).sort((a, b) => dfsResult.finishTimes[b] - dfsResult.finishTimes[a]);

  // 第二步：对转置图按完成时间降序执行DFS
  const transposedGraph = createTransposeGraph(graph);
  const vertexStates: Vertex[] = Array.from({ length: vertices }, (_, i) => ({
    id: i,
    color: Color.WHITE,
    distance: 0,
    parent: null,
  }));

  const components: number[][] = [];
  const componentMap: number[] = new Array(vertices).fill(-1);
  let componentCount = 0;

  // DFS访问函数，构建强连通分量
  function dfsVisit(u: number, currentComponent: number[]): void {
    vertexStates[u].color = Color.GRAY;
    currentComponent.push(u);
    componentMap[u] = componentCount;

    for (const v of transposedGraph.getNeighbors(u)) {
      if (vertexStates[v].color === Color.WHITE) {
        vertexStates[v].parent = u;
        dfsVisit(v, currentComponent);
      }
    }

    vertexStates[u].color = Color.BLACK;
  }

  // 按完成时间降序访问顶点
  for (const u of verticesByFinishTime) {
    if (vertexStates[u].color === Color.WHITE) {
      const currentComponent: number[] = [];
      dfsVisit(u, currentComponent);
      components.push(currentComponent);
      componentCount++;
    }
  }

  return {
    components,
    componentMap,
    count: componentCount,
  };
}

/**
 * 创建转置图（只对有向图有意义）
 */
function createTransposeGraph(graph: Graph): Graph {
  const graphInfo = graph.getInfo();

  if (!graphInfo.isDirected) {
    throw new Error("转置操作只适用于有向图");
  }

  const transposed = new Graph(
    graph.getVertexCount(),
    true,
    graphInfo.isWeighted
  );

  const edges = graph.getAllEdges();
  for (const edge of edges) {
    if ("weight" in edge) {
      transposed.addEdge(edge.to, edge.from, edge.weight);
    } else {
      transposed.addEdge(edge.to, edge.from);
    }
  }

  return transposed;
}

/**
 * 检测有向图中的环
 * 时间复杂度：O(V + E)
 */
export function hasCycle(graph: Graph): boolean {
  const vertices = graph.getVertexCount();
  const colors = new Array(vertices).fill(Color.WHITE);

  function dfsVisit(u: number): boolean {
    colors[u] = Color.GRAY;

    for (const v of graph.getNeighbors(u)) {
      if (colors[v] === Color.GRAY) {
        // 发现后向边，存在环
        return true;
      }
      if (colors[v] === Color.WHITE && dfsVisit(v)) {
        return true;
      }
    }

    colors[u] = Color.BLACK;
    return false;
  }

  for (let u = 0; u < vertices; u++) {
    if (colors[u] === Color.WHITE) {
      if (dfsVisit(u)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 计算从源顶点到所有顶点的路径
 */
export function getPath(
  parents: (number | null)[],
  source: number,
  target: number
): number[] {
  const path: number[] = [];
  let current: number | null = target;

  while (current !== null && current !== source) {
    path.unshift(current);
    current = parents[current];
  }

  if (current === source) {
    path.unshift(source);
    return path;
  }

  return []; // 无路径
}

/**
 * 打印BFS结果
 */
export function printBFSResult(result: BFSResult, source: number): void {
  console.log(`\nBFS从顶点 ${source} 开始的结果:`);
  console.log("顶点\t距离\t父节点");

  for (let i = 0; i < result.vertices.length; i++) {
    const distance =
      result.distances[i] === Infinity ? "∞" : result.distances[i];
    const parent = result.parents[i] === null ? "NIL" : result.parents[i];
    console.log(`${i}\t${distance}\t${parent}`);
  }
}

/**
 * 打印DFS结果
 */
export function printDFSResult(result: DFSResult): void {
  console.log("\nDFS结果:");
  console.log("顶点\t发现时间\t完成时间\t父节点");

  for (let i = 0; i < result.vertices.length; i++) {
    const parent = result.parents[i] === null ? "NIL" : result.parents[i];
    console.log(
      `${i}\t${result.discoveryTimes[i]}\t\t${result.finishTimes[i]}\t\t${parent}`
    );
  }
}

/**
 * 打印拓扑排序结果
 */
export function printTopologicalSort(result: TopologicalSortResult): void {
  console.log("\n拓扑排序结果:");
  if (result.isDAG) {
    console.log(`拓扑序: ${result.order.join(" -> ")}`);
  } else {
    console.log("图中存在环，无法进行拓扑排序");
  }
}

/**
 * 打印强连通分量结果
 */
export function printSCCResult(result: SCCResult): void {
  console.log("\n强连通分量结果:");
  console.log(`强连通分量数量: ${result.count}`);

  for (let i = 0; i < result.components.length; i++) {
    console.log(`分量 ${i}: [${result.components[i].join(", ")}]`);
  }
}

/**
 * 图算法工具类
 */
export class GraphAlgorithms {
  /**
   * 执行所有图算法的综合演示
   */
  static demonstrateAll(graph: Graph, source: number = 0): void {
    console.log("=== 图算法演示 ===\n");

    // 打印图结构
    graph.printGraph();

    // BFS演示
    try {
      const bfsResult = breadthFirstSearch(graph, source);
      printBFSResult(bfsResult, source);
    } catch (error) {
      console.log(`BFS错误: ${error}`);
    }

    // DFS演示
    const dfsResult = depthFirstSearch(graph);
    printDFSResult(dfsResult);

    // 拓扑排序演示（仅对有向图）
    const graphInfo = graph.getInfo();
    if (graphInfo.isDirected) {
      const topoResult = topologicalSort(graph);
      printTopologicalSort(topoResult);

      // 强连通分量演示
      const sccResult = stronglyConnectedComponents(graph);
      printSCCResult(sccResult);
    }

    // 环检测
    console.log(`\n图中是否存在环: ${hasCycle(graph) ? "是" : "否"}`);
  }

  /**
   * 创建示例图用于测试
   */
  static createExampleDAG(): Graph {
    const graph = new Graph(6, true); // 有向图

    // 添加边构建一个DAG
    graph.addEdge(5, 2);
    graph.addEdge(5, 0);
    graph.addEdge(4, 0);
    graph.addEdge(4, 1);
    graph.addEdge(2, 3);
    graph.addEdge(3, 1);

    return graph;
  }

  /**
   * 创建示例无向图
   */
  static createExampleUndirectedGraph(): Graph {
    const graph = new Graph(5, false); // 无向图

    graph.addEdge(0, 1);
    graph.addEdge(0, 4);
    graph.addEdge(1, 2);
    graph.addEdge(1, 3);
    graph.addEdge(1, 4);
    graph.addEdge(2, 3);
    graph.addEdge(3, 4);

    return graph;
  }

  /**
   * 创建示例强连通图
   */
  static createExampleSCCGraph(): Graph {
    const graph = new Graph(8, true); // 有向图

    // 第一个强连通分量：0, 1, 2
    graph.addEdge(0, 1);
    graph.addEdge(1, 2);
    graph.addEdge(2, 0);

    // 第二个强连通分量：3, 4
    graph.addEdge(3, 4);
    graph.addEdge(4, 3);

    // 第三个强连通分量：5, 6, 7
    graph.addEdge(5, 6);
    graph.addEdge(6, 7);
    graph.addEdge(7, 5);

    // 分量间的边
    graph.addEdge(1, 3);
    graph.addEdge(4, 5);
    graph.addEdge(2, 6);

    return graph;
  }
}
