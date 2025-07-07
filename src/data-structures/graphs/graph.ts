/**
 * 图数据结构实现
 * 《算法导论》第22章 图的基本表示
 */

import {
  Edge,
  WeightedEdge,
  AdjacencyList,
  WeightedAdjacencyList,
  Color,
  Vertex,
} from "../../types";

/**
 * 图的表示方式
 */
export enum GraphRepresentation {
  ADJACENCY_LIST = "adjacency_list",
  ADJACENCY_MATRIX = "adjacency_matrix",
}

/**
 * 图类
 */
export class Graph {
  private vertices: number;
  private adjacencyList: AdjacencyList;
  private weightedAdjacencyList: WeightedAdjacencyList;
  private adjacencyMatrix: number[][];
  private isDirected: boolean;
  private isWeighted: boolean;
  private representation: GraphRepresentation;

  constructor(
    vertices: number,
    isDirected: boolean = false,
    isWeighted: boolean = false,
    representation: GraphRepresentation = GraphRepresentation.ADJACENCY_LIST
  ) {
    this.vertices = vertices;
    this.isDirected = isDirected;
    this.isWeighted = isWeighted;
    this.representation = representation;

    // 初始化邻接表
    this.adjacencyList = Array.from({ length: vertices }, () => []);
    this.weightedAdjacencyList = Array.from({ length: vertices }, () => []);

    // 初始化邻接矩阵
    this.adjacencyMatrix = Array.from({ length: vertices }, () =>
      new Array(vertices).fill(isWeighted ? Infinity : 0)
    );

    // 对角线设为0（自己到自己的距离）
    for (let i = 0; i < vertices; i++) {
      this.adjacencyMatrix[i][i] = 0;
    }
  }

  /**
   * 添加边
   */
  addEdge(from: number, to: number, weight: number = 1): void {
    this.validateVertex(from);
    this.validateVertex(to);

    if (this.isWeighted) {
      // 加权图
      this.weightedAdjacencyList[from].push({ vertex: to, weight });
      this.adjacencyMatrix[from][to] = weight;

      if (!this.isDirected) {
        this.weightedAdjacencyList[to].push({ vertex: from, weight });
        this.adjacencyMatrix[to][from] = weight;
      }
    } else {
      // 无权图
      this.adjacencyList[from].push(to);
      this.adjacencyMatrix[from][to] = 1;

      if (!this.isDirected) {
        this.adjacencyList[to].push(from);
        this.adjacencyMatrix[to][from] = 1;
      }
    }
  }

  /**
   * 移除边
   */
  removeEdge(from: number, to: number): void {
    this.validateVertex(from);
    this.validateVertex(to);

    if (this.isWeighted) {
      this.weightedAdjacencyList[from] = this.weightedAdjacencyList[
        from
      ].filter((edge) => edge.vertex !== to);
      this.adjacencyMatrix[from][to] = Infinity;

      if (!this.isDirected) {
        this.weightedAdjacencyList[to] = this.weightedAdjacencyList[to].filter(
          (edge) => edge.vertex !== from
        );
        this.adjacencyMatrix[to][from] = Infinity;
      }
    } else {
      this.adjacencyList[from] = this.adjacencyList[from].filter(
        (vertex) => vertex !== to
      );
      this.adjacencyMatrix[from][to] = 0;

      if (!this.isDirected) {
        this.adjacencyList[to] = this.adjacencyList[to].filter(
          (vertex) => vertex !== from
        );
        this.adjacencyMatrix[to][from] = 0;
      }
    }
  }

  /**
   * 检查是否存在边
   */
  hasEdge(from: number, to: number): boolean {
    this.validateVertex(from);
    this.validateVertex(to);

    if (this.isWeighted) {
      return this.weightedAdjacencyList[from].some(
        (edge) => edge.vertex === to
      );
    } else {
      return this.adjacencyList[from].includes(to);
    }
  }

  /**
   * 获取边的权重
   */
  getEdgeWeight(from: number, to: number): number {
    this.validateVertex(from);
    this.validateVertex(to);

    if (!this.isWeighted) {
      return this.hasEdge(from, to) ? 1 : 0;
    }

    const edge = this.weightedAdjacencyList[from].find((e) => e.vertex === to);
    return edge ? edge.weight : Infinity;
  }

  /**
   * 获取顶点的邻居
   */
  getNeighbors(vertex: number): number[] {
    this.validateVertex(vertex);

    if (this.isWeighted) {
      return this.weightedAdjacencyList[vertex].map((edge) => edge.vertex);
    } else {
      return [...this.adjacencyList[vertex]];
    }
  }

  /**
   * 获取顶点的加权邻居
   */
  getWeightedNeighbors(
    vertex: number
  ): Array<{ vertex: number; weight: number }> {
    this.validateVertex(vertex);

    if (this.isWeighted) {
      return [...this.weightedAdjacencyList[vertex]];
    } else {
      return this.adjacencyList[vertex].map((v) => ({ vertex: v, weight: 1 }));
    }
  }

  /**
   * 获取顶点数
   */
  getVertexCount(): number {
    return this.vertices;
  }

  /**
   * 获取边数
   */
  getEdgeCount(): number {
    let count = 0;

    if (this.isWeighted) {
      for (let i = 0; i < this.vertices; i++) {
        count += this.weightedAdjacencyList[i].length;
      }
    } else {
      for (let i = 0; i < this.vertices; i++) {
        count += this.adjacencyList[i].length;
      }
    }

    return this.isDirected ? count : count / 2;
  }

  /**
   * 获取顶点的入度
   */
  getInDegree(vertex: number): number {
    this.validateVertex(vertex);
    let inDegree = 0;

    for (let i = 0; i < this.vertices; i++) {
      if (this.hasEdge(i, vertex)) {
        inDegree++;
      }
    }

    return inDegree;
  }

  /**
   * 获取顶点的出度
   */
  getOutDegree(vertex: number): number {
    this.validateVertex(vertex);
    return this.getNeighbors(vertex).length;
  }

  /**
   * 获取邻接表
   */
  getAdjacencyList(): AdjacencyList | WeightedAdjacencyList {
    if (this.isWeighted) {
      return this.weightedAdjacencyList.map((neighbors) => [...neighbors]);
    } else {
      return this.adjacencyList.map((neighbors) => [...neighbors]);
    }
  }

  /**
   * 获取邻接矩阵
   */
  getAdjacencyMatrix(): number[][] {
    return this.adjacencyMatrix.map((row) => [...row]);
  }

  /**
   * 获取所有边
   */
  getAllEdges(): Edge[] | WeightedEdge[] {
    const edges: (Edge | WeightedEdge)[] = [];

    if (this.isWeighted) {
      for (let from = 0; from < this.vertices; from++) {
        for (const { vertex: to, weight } of this.weightedAdjacencyList[from]) {
          if (this.isDirected || from <= to) {
            edges.push({ from, to, weight });
          }
        }
      }
    } else {
      for (let from = 0; from < this.vertices; from++) {
        for (const to of this.adjacencyList[from]) {
          if (this.isDirected || from <= to) {
            edges.push({ from, to });
          }
        }
      }
    }

    return edges;
  }

  /**
   * 验证顶点是否有效
   */
  private validateVertex(vertex: number): void {
    if (vertex < 0 || vertex >= this.vertices) {
      throw new Error(`顶点 ${vertex} 超出范围 [0, ${this.vertices - 1}]`);
    }
  }

  /**
   * 检查图是否连通
   */
  isConnected(): boolean {
    if (this.vertices === 0) return true;

    const visited = new Array(this.vertices).fill(false);
    const stack = [0];
    visited[0] = true;
    let visitedCount = 1;

    while (stack.length > 0) {
      const current = stack.pop()!;
      const neighbors = this.getNeighbors(current);

      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
          visitedCount++;
        }
      }
    }

    return visitedCount === this.vertices;
  }

  /**
   * 克隆图
   */
  clone(): Graph {
    const cloned = new Graph(
      this.vertices,
      this.isDirected,
      this.isWeighted,
      this.representation
    );

    const edges = this.getAllEdges();
    for (const edge of edges) {
      if ("weight" in edge) {
        cloned.addEdge(edge.from, edge.to, edge.weight);
      } else {
        cloned.addEdge(edge.from, edge.to);
      }
    }

    return cloned;
  }

  /**
   * 图的信息
   */
  getInfo(): {
    vertices: number;
    edges: number;
    isDirected: boolean;
    isWeighted: boolean;
    isConnected: boolean;
    density: number;
  } {
    const edgeCount = this.getEdgeCount();
    const maxEdges = this.isDirected
      ? this.vertices * (this.vertices - 1)
      : (this.vertices * (this.vertices - 1)) / 2;

    return {
      vertices: this.vertices,
      edges: edgeCount,
      isDirected: this.isDirected,
      isWeighted: this.isWeighted,
      isConnected: this.isConnected(),
      density: maxEdges > 0 ? edgeCount / maxEdges : 0,
    };
  }

  /**
   * 打印图信息
   */
  printGraph(): void {
    const info = this.getInfo();
    console.log(`图信息: ${info.vertices}个顶点, ${info.edges}条边`);
    console.log(
      `类型: ${info.isDirected ? "有向图" : "无向图"}, ${
        info.isWeighted ? "加权图" : "无权图"
      }`
    );
    console.log(`连通性: ${info.isConnected ? "连通" : "非连通"}`);
    console.log(`密度: ${(info.density * 100).toFixed(2)}%`);
    console.log("邻接表:");

    for (let i = 0; i < this.vertices; i++) {
      if (this.isWeighted) {
        const neighbors = this.weightedAdjacencyList[i]
          .map((edge) => `${edge.vertex}(${edge.weight})`)
          .join(", ");
        console.log(`  ${i}: [${neighbors}]`);
      } else {
        const neighbors = this.adjacencyList[i].join(", ");
        console.log(`  ${i}: [${neighbors}]`);
      }
    }
  }

  /**
   * 转换为字符串表示
   */
  toString(): string {
    const info = this.getInfo();
    return `Graph(${info.vertices}v, ${info.edges}e, ${
      info.isDirected ? "directed" : "undirected"
    }, ${info.isWeighted ? "weighted" : "unweighted"})`;
  }
}
