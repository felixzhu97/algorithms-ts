/**
 * 图算法测试
 * 《算法导论》第22章 图的基本算法
 */

import {
  Graph,
  breadthFirstSearch,
  depthFirstSearch,
  topologicalSort,
  stronglyConnectedComponents,
  hasCycle,
  getPath,
  GraphAlgorithms,
} from "../algorithms/graph/graph-algorithms";
import { Color, Edge } from "../types";

describe("图数据结构 (Graph)", () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph(5, false); // 5个顶点的无向图
  });

  describe("基本操作", () => {
    test("应该正确创建图", () => {
      expect(graph.getVertices()).toBe(5);
      expect(graph.getIsDirected()).toBe(false);
      expect(graph.getIsWeighted()).toBe(false);
      expect(graph.getEdgeCount()).toBe(0);
    });

    test("应该正确添加边", () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);

      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(1, 0)).toBe(true); // 无向图
      expect(graph.hasEdge(1, 2)).toBe(true);
      expect(graph.hasEdge(2, 1)).toBe(true);
      expect(graph.hasEdge(0, 3)).toBe(false);
      expect(graph.getEdgeCount()).toBe(3);
    });

    test("应该正确移除边", () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);

      expect(graph.hasEdge(0, 1)).toBe(true);

      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
      expect(graph.hasEdge(1, 0)).toBe(false);
      expect(graph.hasEdge(1, 2)).toBe(true);
    });

    test("应该正确获取邻居", () => {
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(1, 3);

      const neighbors0 = graph.getNeighbors(0);
      expect(neighbors0.sort()).toEqual([1, 2]);

      const neighbors1 = graph.getNeighbors(1);
      expect(neighbors1.sort()).toEqual([0, 3]);

      const neighbors4 = graph.getNeighbors(4);
      expect(neighbors4).toEqual([]);
    });

    test("应该正确处理有向图", () => {
      const directedGraph = new Graph(3, true);
      directedGraph.addEdge(0, 1);
      directedGraph.addEdge(1, 2);

      expect(directedGraph.hasEdge(0, 1)).toBe(true);
      expect(directedGraph.hasEdge(1, 0)).toBe(false); // 有向图
      expect(directedGraph.getEdgeCount()).toBe(2);
    });

    test("应该正确处理加权图", () => {
      const weightedGraph = new Graph(3, false, true);
      weightedGraph.addEdge(0, 1, 5);
      weightedGraph.addEdge(1, 2, 3);

      expect(weightedGraph.getEdgeWeight(0, 1)).toBe(5);
      expect(weightedGraph.getEdgeWeight(1, 0)).toBe(5); // 无向图
      expect(weightedGraph.getEdgeWeight(1, 2)).toBe(3);
      expect(weightedGraph.getEdgeWeight(0, 2)).toBeNull();
    });

    test("应该验证顶点索引", () => {
      expect(() => graph.addEdge(-1, 0)).toThrow();
      expect(() => graph.addEdge(0, 5)).toThrow();
      expect(() => graph.getNeighbors(10)).toThrow();
    });
  });

  describe("从边列表创建图", () => {
    test("应该从边列表创建无向图", () => {
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 0, weight: 1 },
      ];

      const graphFromEdges = Graph.fromEdges(3, edges, false, false);

      expect(graphFromEdges.getVertices()).toBe(3);
      expect(graphFromEdges.getEdgeCount()).toBe(3);
      expect(graphFromEdges.hasEdge(0, 1)).toBe(true);
      expect(graphFromEdges.hasEdge(1, 0)).toBe(true);
    });

    test("应该从边列表创建有向图", () => {
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 2 },
        { from: 1, to: 2, weight: 3 },
      ];

      const directedGraph = Graph.fromEdges(3, edges, true, true);

      expect(directedGraph.hasEdge(0, 1)).toBe(true);
      expect(directedGraph.hasEdge(1, 0)).toBe(false);
      expect(directedGraph.getEdgeWeight(0, 1)).toBe(2);
    });
  });

  describe("转置图", () => {
    test("应该正确转置有向图", () => {
      const directedGraph = new Graph(3, true);
      directedGraph.addEdge(0, 1);
      directedGraph.addEdge(1, 2);
      directedGraph.addEdge(0, 2);

      const transposed = directedGraph.transpose();

      expect(transposed.hasEdge(1, 0)).toBe(true);
      expect(transposed.hasEdge(2, 1)).toBe(true);
      expect(transposed.hasEdge(2, 0)).toBe(true);
      expect(transposed.hasEdge(0, 1)).toBe(false);
    });

    test("应该拒绝转置无向图", () => {
      expect(() => graph.transpose()).toThrow("转置操作只适用于有向图");
    });
  });

  describe("获取所有边", () => {
    test("应该获取无向图的所有边", () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 0);

      const edges = graph.getEdges();
      expect(edges).toHaveLength(3);

      // 验证边的存在（无向图中边是双向的）
      const edgeSet = new Set(
        edges.map((e) => `${Math.min(e.from, e.to)}-${Math.max(e.from, e.to)}`)
      );
      expect(edgeSet.has("0-1")).toBe(true);
      expect(edgeSet.has("1-2")).toBe(true);
      expect(edgeSet.has("0-2")).toBe(true);
    });
  });
});

describe("广度优先搜索 (BFS)", () => {
  let graph: Graph;

  beforeEach(() => {
    // 创建测试图：0-1-2-3 和 4（孤立点）
    graph = new Graph(5, false);
    graph.addEdge(0, 1);
    graph.addEdge(1, 2);
    graph.addEdge(2, 3);
  });

  test("应该正确执行BFS", () => {
    const result = breadthFirstSearch(graph, 0);

    expect(result.distances[0]).toBe(0);
    expect(result.distances[1]).toBe(1);
    expect(result.distances[2]).toBe(2);
    expect(result.distances[3]).toBe(3);
    expect(result.distances[4]).toBe(Infinity); // 孤立点

    expect(result.parents[0]).toBeNull();
    expect(result.parents[1]).toBe(0);
    expect(result.parents[2]).toBe(1);
    expect(result.parents[3]).toBe(2);
    expect(result.parents[4]).toBeNull();

    expect(result.visited[0]).toBe(true);
    expect(result.visited[1]).toBe(true);
    expect(result.visited[2]).toBe(true);
    expect(result.visited[3]).toBe(true);
    expect(result.visited[4]).toBe(false);
  });

  test("应该处理单个顶点", () => {
    const singleGraph = new Graph(1, false);
    const result = breadthFirstSearch(singleGraph, 0);

    expect(result.distances[0]).toBe(0);
    expect(result.parents[0]).toBeNull();
    expect(result.visited[0]).toBe(true);
  });

  test("应该处理环形图", () => {
    const circleGraph = new Graph(4, false);
    circleGraph.addEdge(0, 1);
    circleGraph.addEdge(1, 2);
    circleGraph.addEdge(2, 3);
    circleGraph.addEdge(3, 0);

    const result = breadthFirstSearch(circleGraph, 0);

    expect(result.distances[0]).toBe(0);
    expect(result.distances[1]).toBe(1);
    expect(result.distances[2]).toBe(2);
    expect(result.distances[3]).toBe(1); // 直接连接到0
  });

  test("应该验证源顶点", () => {
    expect(() => breadthFirstSearch(graph, -1)).toThrow();
    expect(() => breadthFirstSearch(graph, 5)).toThrow();
  });
});

describe("深度优先搜索 (DFS)", () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph(4, true); // 有向图
    graph.addEdge(0, 1);
    graph.addEdge(1, 2);
    graph.addEdge(2, 3);
    graph.addEdge(3, 1); // 创建环
  });

  test("应该正确执行DFS", () => {
    const result = depthFirstSearch(graph);

    expect(result.vertices).toHaveLength(4);
    expect(result.discoveryTimes).toHaveLength(4);
    expect(result.finishTimes).toHaveLength(4);
    expect(result.parents).toHaveLength(4);

    // 验证时间戳的有效性
    for (let i = 0; i < 4; i++) {
      expect(result.discoveryTimes[i]).toBeLessThan(result.finishTimes[i]);
      expect(result.discoveryTimes[i]).toBeGreaterThan(0);
      expect(result.finishTimes[i]).toBeGreaterThan(0);
    }

    expect(result.time).toBeGreaterThan(0);
  });

  test("应该正确设置父节点", () => {
    const result = depthFirstSearch(graph);

    // 根据DFS的性质，应该存在父子关系
    let hasParentChild = false;
    for (let i = 0; i < 4; i++) {
      if (result.parents[i] !== null) {
        hasParentChild = true;
        break;
      }
    }
    expect(hasParentChild).toBe(true);
  });

  test("应该处理空图", () => {
    const emptyGraph = new Graph(3, true);
    const result = depthFirstSearch(emptyGraph);

    expect(result.vertices).toHaveLength(3);
    result.parents.forEach((parent) => expect(parent).toBeNull());
  });
});

describe("拓扑排序", () => {
  test("应该正确对DAG进行拓扑排序", () => {
    const dag = GraphAlgorithms.createExampleDAG();
    const result = topologicalSort(dag);

    expect(result.isDAG).toBe(true);
    expect(result.order).toHaveLength(6);

    // 验证拓扑序的正确性
    const position = new Map<number, number>();
    result.order.forEach((vertex, index) => position.set(vertex, index));

    // 检查所有边是否满足拓扑序
    const edges = dag.getEdges();
    for (const edge of edges) {
      expect(position.get(edge.from)!).toBeLessThan(position.get(edge.to)!);
    }
  });

  test("应该检测有环图", () => {
    const cyclicGraph = new Graph(3, true);
    cyclicGraph.addEdge(0, 1);
    cyclicGraph.addEdge(1, 2);
    cyclicGraph.addEdge(2, 0); // 创建环

    const result = topologicalSort(cyclicGraph);

    expect(result.isDAG).toBe(false);
    expect(result.order).toEqual([]);
  });

  test("应该处理单个顶点", () => {
    const singleGraph = new Graph(1, true);
    const result = topologicalSort(singleGraph);

    expect(result.isDAG).toBe(true);
    expect(result.order).toEqual([0]);
  });

  test("应该拒绝无向图", () => {
    const undirectedGraph = new Graph(3, false);
    expect(() => topologicalSort(undirectedGraph)).toThrow(
      "拓扑排序只适用于有向图"
    );
  });
});

describe("强连通分量", () => {
  test("应该正确找到强连通分量", () => {
    const sccGraph = GraphAlgorithms.createExampleSCCGraph();
    const result = stronglyConnectedComponents(sccGraph);

    expect(result.count).toBe(3);
    expect(result.components).toHaveLength(3);
    expect(result.componentMap).toHaveLength(8);

    // 验证每个顶点都属于某个分量
    for (let i = 0; i < 8; i++) {
      expect(result.componentMap[i]).toBeGreaterThanOrEqual(0);
      expect(result.componentMap[i]).toBeLessThan(3);
    }

    // 验证强连通分量的大小
    const componentSizes = result.components.map((comp) => comp.length);
    expect(componentSizes.sort()).toEqual([2, 3, 3]);
  });

  test("应该处理单个强连通分量", () => {
    const strongGraph = new Graph(3, true);
    strongGraph.addEdge(0, 1);
    strongGraph.addEdge(1, 2);
    strongGraph.addEdge(2, 0);

    const result = stronglyConnectedComponents(strongGraph);

    expect(result.count).toBe(1);
    expect(result.components[0].sort()).toEqual([0, 1, 2]);
  });

  test("应该处理无连接的图", () => {
    const disconnectedGraph = new Graph(3, true);
    // 没有边

    const result = stronglyConnectedComponents(disconnectedGraph);

    expect(result.count).toBe(3);
    expect(result.components).toHaveLength(3);
    result.components.forEach((comp) => expect(comp).toHaveLength(1));
  });

  test("应该拒绝无向图", () => {
    const undirectedGraph = new Graph(3, false);
    expect(() => stronglyConnectedComponents(undirectedGraph)).toThrow();
  });
});

describe("环检测", () => {
  test("应该检测有向图中的环", () => {
    const cyclicGraph = new Graph(3, true);
    cyclicGraph.addEdge(0, 1);
    cyclicGraph.addEdge(1, 2);
    cyclicGraph.addEdge(2, 0);

    expect(hasCycle(cyclicGraph)).toBe(true);
  });

  test("应该检测DAG中无环", () => {
    const dag = GraphAlgorithms.createExampleDAG();
    expect(hasCycle(dag)).toBe(false);
  });

  test("应该处理自环", () => {
    const selfLoopGraph = new Graph(2, true);
    selfLoopGraph.addEdge(0, 0);

    expect(hasCycle(selfLoopGraph)).toBe(true);
  });

  test("应该处理空图", () => {
    const emptyGraph = new Graph(3, true);
    expect(hasCycle(emptyGraph)).toBe(false);
  });
});

describe("路径查找", () => {
  test("应该找到正确的路径", () => {
    const graph = new Graph(4, false);
    graph.addEdge(0, 1);
    graph.addEdge(1, 2);
    graph.addEdge(2, 3);

    const bfsResult = breadthFirstSearch(graph, 0);

    const path = getPath(bfsResult.parents, 0, 3);
    expect(path).toEqual([0, 1, 2, 3]);

    const shortPath = getPath(bfsResult.parents, 0, 1);
    expect(shortPath).toEqual([0, 1]);
  });

  test("应该处理无路径情况", () => {
    const graph = new Graph(4, false);
    graph.addEdge(0, 1);
    // 2和3是孤立的

    const bfsResult = breadthFirstSearch(graph, 0);

    const path = getPath(bfsResult.parents, 0, 2);
    expect(path).toEqual([]);
  });

  test("应该处理到自身的路径", () => {
    const graph = new Graph(3, false);
    graph.addEdge(0, 1);

    const bfsResult = breadthFirstSearch(graph, 0);

    const path = getPath(bfsResult.parents, 0, 0);
    expect(path).toEqual([0]);
  });
});

describe("GraphAlgorithms工具类", () => {
  test("应该创建示例DAG", () => {
    const dag = GraphAlgorithms.createExampleDAG();

    expect(dag.getVertices()).toBe(6);
    expect(dag.getIsDirected()).toBe(true);
    expect(hasCycle(dag)).toBe(false);

    const topoResult = topologicalSort(dag);
    expect(topoResult.isDAG).toBe(true);
  });

  test("应该创建示例无向图", () => {
    const undirectedGraph = GraphAlgorithms.createExampleUndirectedGraph();

    expect(undirectedGraph.getVertices()).toBe(5);
    expect(undirectedGraph.getIsDirected()).toBe(false);
    expect(undirectedGraph.getEdgeCount()).toBeGreaterThan(0);
  });

  test("应该创建示例SCC图", () => {
    const sccGraph = GraphAlgorithms.createExampleSCCGraph();

    expect(sccGraph.getVertices()).toBe(8);
    expect(sccGraph.getIsDirected()).toBe(true);

    const result = stronglyConnectedComponents(sccGraph);
    expect(result.count).toBe(3);
  });
});

describe("性能测试", () => {
  test("大图的BFS性能", () => {
    const vertices = 1000;
    const largeGraph = new Graph(vertices, false);

    // 创建链状图
    for (let i = 0; i < vertices - 1; i++) {
      largeGraph.addEdge(i, i + 1);
    }

    const start = Date.now();
    const result = breadthFirstSearch(largeGraph, 0);
    const time = Date.now() - start;

    expect(result.distances[vertices - 1]).toBe(vertices - 1);
    expect(time).toBeLessThan(1000); // 应该在1秒内完成
    console.log(`BFS ${vertices}顶点耗时: ${time}ms`);
  });

  test("大图的DFS性能", () => {
    const vertices = 1000;
    const largeGraph = new Graph(vertices, true);

    // 创建链状图
    for (let i = 0; i < vertices - 1; i++) {
      largeGraph.addEdge(i, i + 1);
    }

    const start = Date.now();
    const result = depthFirstSearch(largeGraph);
    const time = Date.now() - start;

    expect(result.vertices).toHaveLength(vertices);
    expect(time).toBeLessThan(1000);
    console.log(`DFS ${vertices}顶点耗时: ${time}ms`);
  });

  test("大图的拓扑排序性能", () => {
    const vertices = 1000;
    const largeDAG = new Graph(vertices, true);

    // 创建DAG
    for (let i = 0; i < vertices - 1; i++) {
      largeDAG.addEdge(i, i + 1);
    }

    const start = Date.now();
    const result = topologicalSort(largeDAG);
    const time = Date.now() - start;

    expect(result.isDAG).toBe(true);
    expect(result.order).toHaveLength(vertices);
    expect(time).toBeLessThan(1000);
    console.log(`拓扑排序${vertices}顶点耗时: ${time}ms`);
  });
});

describe("边界情况和错误处理", () => {
  test("应该处理空图", () => {
    const emptyGraph = new Graph(0, false);
    expect(emptyGraph.getVertices()).toBe(0);
    expect(emptyGraph.getEdgeCount()).toBe(0);
  });

  test("应该处理单顶点图", () => {
    const singleGraph = new Graph(1, false);
    expect(singleGraph.getVertices()).toBe(1);
    expect(singleGraph.getNeighbors(0)).toEqual([]);

    const bfsResult = breadthFirstSearch(singleGraph, 0);
    expect(bfsResult.distances[0]).toBe(0);
  });

  test("应该验证无效操作", () => {
    const graph = new Graph(3, false);

    // 无效的顶点索引
    expect(() => graph.addEdge(-1, 0)).toThrow();
    expect(() => graph.addEdge(0, 3)).toThrow();
    expect(() => graph.removeEdge(5, 0)).toThrow();
    expect(() => graph.hasEdge(0, 10)).toThrow();
  });

  test("应该处理重复边", () => {
    const graph = new Graph(3, false);

    graph.addEdge(0, 1);
    graph.addEdge(0, 1); // 重复添加

    expect(graph.getNeighbors(0)).toEqual([1, 1]); // 可能有重复
  });
});

describe("图的打印和调试", () => {
  test("printGraph方法应该不抛出错误", () => {
    const graph = new Graph(3, false);
    graph.addEdge(0, 1);
    graph.addEdge(1, 2);

    expect(() => graph.printGraph()).not.toThrow();
  });

  test("demonstrateAll方法应该不抛出错误", () => {
    const dag = GraphAlgorithms.createExampleDAG();
    expect(() => GraphAlgorithms.demonstrateAll(dag, 0)).not.toThrow();

    const undirectedGraph = GraphAlgorithms.createExampleUndirectedGraph();
    expect(() =>
      GraphAlgorithms.demonstrateAll(undirectedGraph, 0)
    ).not.toThrow();
  });
});
