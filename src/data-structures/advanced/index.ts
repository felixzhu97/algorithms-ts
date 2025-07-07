/**
 * 高级数据结构模块
 * 包含高级数据结构的完整实现
 *
 * 包含：
 * - 并查集（Union-Find / Disjoint Set）
 * - 线段树（Segment Tree）
 * - 树状数组（Binary Indexed Tree / Fenwick Tree）
 * - 字典树（Trie / Prefix Tree）
 * - LRU缓存（Least Recently Used Cache）
 */

// 不相交集合（并查集）
export {
  DisjointSet,
  DisjointSetNode,
  DisjointSetApplications,
  DisjointSetUtils,
} from "./disjoint-set";

// 线段树
export { SegmentTree, SegmentTreeUtils } from "./segment-tree";

// 树状数组
export {
  BinaryIndexedTree,
  BinaryIndexedTree2D,
  DifferenceArrayBIT,
  BinaryIndexedTreeUtils,
} from "./binary-indexed-tree";

// 字典树
export { Trie, TrieUtils } from "./trie";

// LRU缓存
export { LRUCache, LRUCacheWithStats, LRUCacheUtils } from "./lru-cache";
