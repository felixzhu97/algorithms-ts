/**
 * 通用比较函数类型
 */
export type CompareFn<T> = (a: T, b: T) => number;

/**
 * 比较器类型（兼容别名）
 */
export type Comparator<T> = CompareFn<T>;

/**
 * 默认数字比较函数
 */
export const defaultCompare: CompareFn<number> = (a, b) => a - b;

/**
 * 字符串比较函数
 */
export const stringCompare: CompareFn<string> = (a, b) => a.localeCompare(b);

/**
 * 图的边表示
 */
export interface Edge {
  from: number;
  to: number;
  weight?: number;
}

/**
 * 加权边表示
 */
export interface WeightedEdge extends Edge {
  from: number;
  to: number;
  weight: number;
}

/**
 * 图的邻接表表示
 */
export type AdjacencyList = number[][];

/**
 * 加权图的邻接表表示
 */
export type WeightedAdjacencyList = Array<
  Array<{ vertex: number; weight: number }>
>;

/**
 * 颜色枚举（用于图遍历）
 */
export enum Color {
  WHITE = "white",
  GRAY = "gray",
  BLACK = "black",
}

/**
 * 排序结果接口
 */
export interface SortResult<T> {
  sorted: T[];
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  found: boolean;
  index: number;
  comparisons: number;
}

/**
 * 树节点接口
 */
export interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
  parent: TreeNode<T> | null;
}

/**
 * 红黑树节点颜色
 */
export enum RBColor {
  RED = "red",
  BLACK = "black",
}

/**
 * 红黑树节点接口
 */
export interface RBTreeNode<T> extends TreeNode<T> {
  color: RBColor;
  left: RBTreeNode<T> | null;
  right: RBTreeNode<T> | null;
  parent: RBTreeNode<T> | null;
}

/**
 * 图顶点状态（用于DFS）
 */
export interface Vertex {
  id: number;
  color: Color;
  distance: number;
  parent: number | null;
  discoveryTime?: number; // 发现时间
  finishTime?: number; // 完成时间
}

/**
 * BFS结果接口
 */
export interface BFSResult {
  vertices: Vertex[];
  distances: number[];
  parents: (number | null)[];
  visited: boolean[];
}

/**
 * DFS结果接口
 */
export interface DFSResult {
  vertices: Vertex[];
  parents: (number | null)[];
  discoveryTimes: number[];
  finishTimes: number[];
  time: number;
}

/**
 * 拓扑排序结果接口
 */
export interface TopologicalSortResult {
  order: number[];
  isDAG: boolean; // 是否为有向无环图
}

/**
 * 强连通分量结果接口
 */
export interface SCCResult {
  components: number[][];
  componentMap: number[]; // 每个顶点所属的分量编号
  count: number; // 强连通分量数量
}

/**
 * 最短路径结果接口
 */
export interface ShortestPathResult {
  distances: number[];
  predecessors: (number | null)[];
  hasNegativeCycle?: boolean;
}

/**
 * 所有点对最短路径结果接口
 */
export interface AllPairsShortestPathResult {
  distances: number[][];
  predecessors: (number | null)[][];
}

/**
 * 最小生成树边
 */
export interface MSTEdge extends Edge {
  from: number;
  to: number;
  weight: number;
}

/**
 * 最小生成树结果接口
 */
export interface MSTResult {
  edges: MSTEdge[];
  totalWeight: number;
  isConnected: boolean;
}

/**
 * 并查集接口
 */
export interface UnionFind {
  find(x: number): number;
  union(x: number, y: number): boolean;
  connected(x: number, y: number): boolean;
}

/**
 * 矩阵链乘法结果接口
 */
export interface MatrixChainResult {
  minOperations: number;
  optimalParenthesization: string;
  splitTable: number[][];
}

/**
 * 最长公共子序列结果接口
 */
export interface LCSResult {
  length: number;
  sequence: string;
  table: number[][];
}

/**
 * 背包问题结果接口
 */
export interface KnapsackResult {
  maxValue: number;
  selectedItems: number[];
  table: number[][];
}

/**
 * 背包物品接口
 */
export interface KnapsackItem {
  weight: number;
  value: number;
  name?: string;
}

/**
 * 活动接口
 */
export interface Activity {
  id: number;
  start: number;
  finish: number;
  name?: string;
}

/**
 * 活动选择结果接口
 */
export interface ActivitySelectionResult {
  selectedActivities: Activity[];
  maxCount: number;
}

/**
 * 霍夫曼编码节点接口
 */
export interface HuffmanNode {
  char?: string;
  frequency: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  isLeaf: boolean;
}

/**
 * 霍夫曼编码结果接口
 */
export interface HuffmanResult {
  codes: Map<string, string>;
  tree: HuffmanNode;
  encodedText: string;
  compressionRatio: number;
}
