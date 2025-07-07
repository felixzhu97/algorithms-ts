/**
 * 不相交集合数据结构实现（并查集）
 * 《算法导论》第21章 用于不相交集合的数据结构
 *
 * 不相交集合数据结构维护一系列互不相交的集合，支持两种操作：
 * 1. Union(x, y): 合并包含x和y的两个集合
 * 2. Find(x): 返回包含x的集合的代表元素
 *
 * 优化策略：
 * 1. 按秩合并（Union by Rank）
 * 2. 路径压缩（Path Compression）
 *
 * 使用这两种优化，时间复杂度接近O(α(n))，其中α是阿克曼函数的反函数
 */

/**
 * 不相交集合节点
 */
export class DisjointSetNode<T> {
  public value: T;
  public parent: DisjointSetNode<T>;
  public rank: number = 0; // 秩（近似高度）
  public size: number = 1; // 集合大小

  constructor(value: T) {
    this.value = value;
    this.parent = this; // 初始时自己是自己的父节点
  }

  /**
   * 检查是否为根节点
   */
  isRoot(): boolean {
    return this.parent === this;
  }
}

/**
 * 不相交集合数据结构类
 */
export class DisjointSet<T> {
  private nodes: Map<T, DisjointSetNode<T>> = new Map();
  private numSets: number = 0;

  /**
   * 获取集合数量
   */
  getNumSets(): number {
    return this.numSets;
  }

  /**
   * 获取元素数量
   */
  getSize(): number {
    return this.nodes.size;
  }

  /**
   * 创建单元素集合
   * 时间复杂度: O(1)
   */
  makeSet(value: T): void {
    if (this.nodes.has(value)) {
      return; // 元素已存在
    }

    this.nodes.set(value, new DisjointSetNode(value));
    this.numSets++;
  }

  /**
   * 查找元素所属集合的代表元素
   * 时间复杂度: O(α(n)) 摊还时间
   */
  find(value: T): T | null {
    const node = this.nodes.get(value);
    if (!node) {
      return null; // 元素不存在
    }

    const root = this.findNode(node);
    return root.value;
  }

  /**
   * 查找节点的根节点（带路径压缩）
   */
  private findNode(node: DisjointSetNode<T>): DisjointSetNode<T> {
    if (node.parent !== node) {
      // 路径压缩：将路径上的所有节点直接连接到根节点
      node.parent = this.findNode(node.parent);
    }
    return node.parent;
  }

  /**
   * 合并两个集合
   * 时间复杂度: O(α(n)) 摊还时间
   */
  union(x: T, y: T): boolean {
    const nodeX = this.nodes.get(x);
    const nodeY = this.nodes.get(y);

    if (!nodeX || !nodeY) {
      return false; // 元素不存在
    }

    const rootX = this.findNode(nodeX);
    const rootY = this.findNode(nodeY);

    if (rootX === rootY) {
      return false; // 已经在同一个集合中
    }

    // 按秩合并：将较小的树连接到较大的树下
    if (rootX.rank < rootY.rank) {
      rootX.parent = rootY;
      rootY.size += rootX.size;
    } else if (rootX.rank > rootY.rank) {
      rootY.parent = rootX;
      rootX.size += rootY.size;
    } else {
      // 秩相等时，任选一个作为根，并增加其秩
      rootY.parent = rootX;
      rootX.rank++;
      rootX.size += rootY.size;
    }

    this.numSets--;
    return true;
  }

  /**
   * 检查两个元素是否在同一个集合中
   * 时间复杂度: O(α(n)) 摊还时间
   */
  connected(x: T, y: T): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    return rootX !== null && rootY !== null && rootX === rootY;
  }

  /**
   * 获取包含指定元素的集合的大小
   */
  getSetSize(value: T): number {
    const node = this.nodes.get(value);
    if (!node) {
      return 0;
    }

    const root = this.findNode(node);
    return root.size;
  }

  /**
   * 获取指定元素所在集合的所有元素
   */
  getSetMembers(value: T): T[] {
    const representative = this.find(value);
    if (representative === null) {
      return [];
    }

    const members: T[] = [];
    for (const [nodeValue, node] of this.nodes) {
      if (
        this.findNode(node) === this.findNode(this.nodes.get(representative)!)
      ) {
        members.push(nodeValue);
      }
    }

    return members;
  }

  /**
   * 获取所有集合的代表元素
   */
  getRepresentatives(): T[] {
    const representatives: T[] = [];
    const seen = new Set<DisjointSetNode<T>>();

    for (const node of this.nodes.values()) {
      const root = this.findNode(node);
      if (!seen.has(root)) {
        seen.add(root);
        representatives.push(root.value);
      }
    }

    return representatives;
  }

  /**
   * 获取所有集合
   */
  getAllSets(): T[][] {
    const setsMap = new Map<DisjointSetNode<T>, T[]>();

    for (const [value, node] of this.nodes) {
      const root = this.findNode(node);
      if (!setsMap.has(root)) {
        setsMap.set(root, []);
      }
      setsMap.get(root)!.push(value);
    }

    return Array.from(setsMap.values());
  }

  /**
   * 检查数据结构是否包含指定元素
   */
  contains(value: T): boolean {
    return this.nodes.has(value);
  }

  /**
   * 获取最大集合的大小
   */
  getMaxSetSize(): number {
    let maxSize = 0;
    const representatives = this.getRepresentatives();

    for (const rep of representatives) {
      const size = this.getSetSize(rep);
      maxSize = Math.max(maxSize, size);
    }

    return maxSize;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalElements: number;
    numSets: number;
    maxSetSize: number;
    minSetSize: number;
    averageSetSize: number;
    maxRank: number;
    averageRank: number;
  } {
    if (this.nodes.size === 0) {
      return {
        totalElements: 0,
        numSets: 0,
        maxSetSize: 0,
        minSetSize: 0,
        averageSetSize: 0,
        maxRank: 0,
        averageRank: 0,
      };
    }

    const representatives = this.getRepresentatives();
    const setSizes = representatives.map((rep) => this.getSetSize(rep));
    const ranks = Array.from(this.nodes.values()).map((node) => node.rank);

    return {
      totalElements: this.nodes.size,
      numSets: this.numSets,
      maxSetSize: Math.max(...setSizes),
      minSetSize: Math.min(...setSizes),
      averageSetSize:
        setSizes.reduce((sum, size) => sum + size, 0) / setSizes.length,
      maxRank: Math.max(...ranks),
      averageRank: ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length,
    };
  }

  /**
   * 验证数据结构的完整性
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 验证每个节点的rank和size
    for (const [value, node] of this.nodes) {
      // 验证父指针
      if (!this.nodes.has(node.parent.value)) {
        errors.push(`节点 ${value} 的父指针无效`);
      }

      // 验证root节点的size
      if (node.isRoot()) {
        const actualSize = this.getSetMembers(value).length;
        if (node.size !== actualSize) {
          errors.push(
            `根节点 ${value} 的size不正确: 期望 ${actualSize}, 实际 ${node.size}`
          );
        }
      }

      // 验证非root节点的rank不大于父节点的rank
      if (!node.isRoot() && node.rank >= node.parent.rank) {
        errors.push(
          `节点 ${value} 的rank ${node.rank} 不小于父节点的rank ${node.parent.rank}`
        );
      }
    }

    // 验证集合数量
    const actualNumSets = this.getRepresentatives().length;
    if (this.numSets !== actualNumSets) {
      errors.push(
        `集合数量不正确: 期望 ${actualNumSets}, 实际 ${this.numSets}`
      );
    }

    // 验证路径压缩的正确性
    for (const [value, node] of this.nodes) {
      const root1 = this.findNode(node);
      const root2 = this.findNode(node);
      if (root1 !== root2) {
        errors.push(`路径压缩不一致: 节点 ${value}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 重置数据结构
   */
  clear(): void {
    this.nodes.clear();
    this.numSets = 0;
  }

  /**
   * 克隆数据结构
   */
  clone(): DisjointSet<T> {
    const newSet = new DisjointSet<T>();

    // 第一遍：创建所有节点
    const nodeMap = new Map<DisjointSetNode<T>, DisjointSetNode<T>>();
    for (const [value, node] of this.nodes) {
      const newNode = new DisjointSetNode(value);
      newNode.rank = node.rank;
      newNode.size = node.size;
      newSet.nodes.set(value, newNode);
      nodeMap.set(node, newNode);
    }

    // 第二遍：设置父指针
    for (const [value, node] of this.nodes) {
      const newNode = newSet.nodes.get(value)!;
      const parentNode = nodeMap.get(node.parent);
      if (parentNode) {
        newNode.parent = parentNode;
      }
    }

    newSet.numSets = this.numSets;
    return newSet;
  }

  /**
   * 打印数据结构状态（用于调试）
   */
  printStatus(): void {
    console.log("=== 不相交集合状态 ===");
    console.log(`总元素数: ${this.nodes.size}`);
    console.log(`集合数: ${this.numSets}`);

    const allSets = this.getAllSets();
    console.log("\n当前集合:");
    for (let i = 0; i < allSets.length; i++) {
      const set = allSets[i];
      const representative = this.find(set[0]);
      const size = this.getSetSize(set[0]);
      console.log(
        `  集合 ${i + 1}: [${set.join(
          ", "
        )}] (代表: ${representative}, 大小: ${size})`
      );
    }

    const stats = this.getStats();
    console.log("\n统计信息:");
    console.log(`  最大集合大小: ${stats.maxSetSize}`);
    console.log(`  最小集合大小: ${stats.minSetSize}`);
    console.log(`  平均集合大小: ${stats.averageSetSize.toFixed(2)}`);
    console.log(`  最大秩: ${stats.maxRank}`);
    console.log(`  平均秩: ${stats.averageRank.toFixed(2)}`);
  }
}

/**
 * 不相交集合应用示例类
 */
export class DisjointSetApplications {
  /**
   * 检测无向图中的环
   */
  static detectCycle<T>(edges: Array<[T, T]>): boolean {
    const ds = new DisjointSet<T>();

    // 创建所有顶点的集合
    const vertices = new Set<T>();
    for (const [u, v] of edges) {
      vertices.add(u);
      vertices.add(v);
    }

    for (const vertex of vertices) {
      ds.makeSet(vertex);
    }

    // 检查每条边
    for (const [u, v] of edges) {
      if (ds.connected(u, v)) {
        return true; // 发现环
      }
      ds.union(u, v);
    }

    return false;
  }

  /**
   * 计算连通分量数量
   */
  static countConnectedComponents<T>(
    edges: Array<[T, T]>,
    vertices: T[]
  ): number {
    const ds = new DisjointSet<T>();

    for (const vertex of vertices) {
      ds.makeSet(vertex);
    }

    for (const [u, v] of edges) {
      ds.union(u, v);
    }

    return ds.getNumSets();
  }

  /**
   * 朋友圈问题：计算朋友圈数量
   */
  static countFriendCircles(friendships: number[][]): number {
    const n = friendships.length;
    const ds = new DisjointSet<number>();

    // 初始化每个人为独立的集合
    for (let i = 0; i < n; i++) {
      ds.makeSet(i);
    }

    // 合并朋友关系
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (friendships[i][j] === 1) {
          ds.union(i, j);
        }
      }
    }

    return ds.getNumSets();
  }

  /**
   * 岛屿数量问题
   */
  static numIslands(grid: string[][]): number {
    if (grid.length === 0 || grid[0].length === 0) {
      return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const ds = new DisjointSet<string>();

    // 初始化所有陆地格子
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === "1") {
          ds.makeSet(`${i},${j}`);
        }
      }
    }

    // 连接相邻的陆地格子
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === "1") {
          for (const [di, dj] of directions) {
            const ni = i + di;
            const nj = j + dj;
            if (
              ni >= 0 &&
              ni < rows &&
              nj >= 0 &&
              nj < cols &&
              grid[ni][nj] === "1"
            ) {
              ds.union(`${i},${j}`, `${ni},${nj}`);
            }
          }
        }
      }
    }

    return ds.getNumSets();
  }

  /**
   * 最小生成树的Kruskal算法
   */
  static kruskalMST<T>(
    vertices: T[],
    edges: Array<{ from: T; to: T; weight: number }>
  ): Array<{ from: T; to: T; weight: number }> {
    const ds = new DisjointSet<T>();
    const mst: Array<{ from: T; to: T; weight: number }> = [];

    // 初始化每个顶点为独立集合
    for (const vertex of vertices) {
      ds.makeSet(vertex);
    }

    // 按权重排序边
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    // 贪心选择边
    for (const edge of sortedEdges) {
      if (!ds.connected(edge.from, edge.to)) {
        ds.union(edge.from, edge.to);
        mst.push(edge);

        // 如果已经有n-1条边，停止
        if (mst.length === vertices.length - 1) {
          break;
        }
      }
    }

    return mst;
  }
}

/**
 * 不相交集合工具类
 */
export class DisjointSetUtils {
  /**
   * 从边列表创建不相交集合
   */
  static fromEdges<T>(edges: Array<[T, T]>): DisjointSet<T> {
    const ds = new DisjointSet<T>();
    const vertices = new Set<T>();

    // 收集所有顶点
    for (const [u, v] of edges) {
      vertices.add(u);
      vertices.add(v);
    }

    // 创建单元素集合
    for (const vertex of vertices) {
      ds.makeSet(vertex);
    }

    // 合并连接的顶点
    for (const [u, v] of edges) {
      ds.union(u, v);
    }

    return ds;
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("=== 不相交集合性能测试 ===\n");

    const sizes = [1000, 5000, 10000];

    for (const size of sizes) {
      console.log(`--- 大小: ${size} ---`);

      const ds = new DisjointSet<number>();

      // 初始化测试
      const initStart = performance.now();
      for (let i = 0; i < size; i++) {
        ds.makeSet(i);
      }
      const initTime = performance.now() - initStart;

      // 随机Union操作测试
      const unionStart = performance.now();
      for (let i = 0; i < size / 2; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        ds.union(x, y);
      }
      const unionTime = performance.now() - unionStart;

      // Find操作测试
      const findStart = performance.now();
      for (let i = 0; i < 1000; i++) {
        const x = Math.floor(Math.random() * size);
        ds.find(x);
      }
      const findTime = performance.now() - findStart;

      // 连通性测试
      const connectedStart = performance.now();
      for (let i = 0; i < 1000; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        ds.connected(x, y);
      }
      const connectedTime = performance.now() - connectedStart;

      const stats = ds.getStats();
      const validation = ds.validate();

      console.log(`  初始化时间: ${initTime.toFixed(2)}ms`);
      console.log(`  Union时间: ${unionTime.toFixed(2)}ms (${size / 2}次)`);
      console.log(`  Find时间: ${findTime.toFixed(2)}ms (1000次)`);
      console.log(`  连通性测试时间: ${connectedTime.toFixed(2)}ms (1000次)`);
      console.log(`  集合数量: ${stats.numSets}`);
      console.log(`  最大集合大小: ${stats.maxSetSize}`);
      console.log(`  最大秩: ${stats.maxRank}`);
      console.log(`  验证结果: ${validation.isValid ? "✅" : "❌"}`);
      console.log();
    }
  }

  /**
   * 演示不相交集合操作
   */
  static demonstrate(): void {
    console.log("=== 不相交集合操作演示 ===\n");

    const ds = new DisjointSet<string>();
    const elements = ["A", "B", "C", "D", "E", "F", "G", "H"];

    console.log("--- 初始化 ---");
    for (const element of elements) {
      ds.makeSet(element);
    }
    ds.printStatus();

    console.log("\n--- Union操作 ---");
    const unions = [
      ["A", "B"],
      ["C", "D"],
      ["E", "F"],
      ["A", "C"], // 合并两个集合
      ["G", "H"],
      ["A", "E"], // 再次合并
    ];

    for (const [x, y] of unions) {
      console.log(`Union(${x}, ${y})`);
      ds.union(x, y);
      console.log(
        `结果: ${x} 和 ${y} ${ds.connected(x, y) ? "已连通" : "未连通"}`
      );
    }

    ds.printStatus();

    console.log("\n--- Find操作 ---");
    for (const element of elements) {
      const representative = ds.find(element);
      console.log(`Find(${element}) = ${representative}`);
    }

    console.log("\n--- 连通性测试 ---");
    const testPairs = [
      ["A", "D"],
      ["B", "F"],
      ["G", "A"],
      ["H", "C"],
    ];
    for (const [x, y] of testPairs) {
      const connected = ds.connected(x, y);
      console.log(`${x} 和 ${y} ${connected ? "连通" : "不连通"}`);
    }

    console.log("\n--- 应用示例：环检测 ---");
    const edges: Array<[string, string]> = [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "A"], // 包含环
    ];
    const hasCycle = DisjointSetApplications.detectCycle(edges);
    console.log(`图中${hasCycle ? "包含" : "不包含"}环`);

    console.log("\n--- 验证 ---");
    const validation = ds.validate();
    console.log(`验证结果: ${validation.isValid ? "✅" : "❌"}`);
    if (!validation.isValid) {
      console.log("错误:", validation.errors);
    }
  }
}
