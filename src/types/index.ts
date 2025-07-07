/**
 * 通用比较函数类型
 */
export type CompareFn<T> = (a: T, b: T) => number;

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
  left?: TreeNode<T>;
  right?: TreeNode<T>;
  parent?: TreeNode<T>;
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
  left?: RBTreeNode<T>;
  right?: RBTreeNode<T>;
  parent?: RBTreeNode<T>;
}
