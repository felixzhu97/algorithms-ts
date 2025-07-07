/**
 * B树数据结构实现
 * 《算法导论》第18章 B树
 *
 * B树是一种平衡的多路搜索树，广泛用于数据库和文件系统。
 * B树的性质：
 * 1. 每个节点最多有2t-1个键值，最多2t个子节点
 * 2. 除根节点外，每个节点至少有t-1个键值，至少t个子节点
 * 3. 根节点至少有1个键值（除非树为空）
 * 4. 所有叶子节点在同一层
 * 5. 节点内的键值按升序排列
 */

import { CompareFn, defaultCompare } from "../../types";

/**
 * B树节点类
 */
export class BTreeNode<T> {
  public keys: T[] = []; // 键值数组
  public children: BTreeNode<T>[] = []; // 子节点数组
  public isLeaf: boolean = true; // 是否为叶子节点
  public parent: BTreeNode<T> | null = null; // 父节点

  constructor(isLeaf: boolean = true) {
    this.isLeaf = isLeaf;
  }

  /**
   * 获取键值数量
   */
  getKeyCount(): number {
    return this.keys.length;
  }

  /**
   * 获取子节点数量
   */
  getChildCount(): number {
    return this.children.length;
  }

  /**
   * 检查节点是否满
   */
  isFull(t: number): boolean {
    return this.keys.length === 2 * t - 1;
  }

  /**
   * 检查节点是否最小
   */
  isMinimal(t: number): boolean {
    return this.keys.length === t - 1;
  }

  /**
   * 在指定位置插入键值
   */
  insertKey(index: number, key: T): void {
    this.keys.splice(index, 0, key);
  }

  /**
   * 在指定位置插入子节点
   */
  insertChild(index: number, child: BTreeNode<T>): void {
    this.children.splice(index, 0, child);
    child.parent = this;
  }

  /**
   * 删除指定位置的键值
   */
  removeKey(index: number): T {
    return this.keys.splice(index, 1)[0];
  }

  /**
   * 删除指定位置的子节点
   */
  removeChild(index: number): BTreeNode<T> {
    const child = this.children.splice(index, 1)[0];
    child.parent = null;
    return child;
  }
}

/**
 * B树搜索结果
 */
export interface BTreeSearchResult<T> {
  found: boolean;
  node: BTreeNode<T> | null;
  index: number;
  path: Array<{ node: BTreeNode<T>; index: number }>;
}

/**
 * B树统计信息
 */
export interface BTreeStats {
  nodeCount: number;
  leafCount: number;
  height: number;
  totalKeys: number;
  averageKeysPerNode: number;
  minKeysPerNode: number;
  maxKeysPerNode: number;
}

/**
 * B树类
 */
export class BTree<T> {
  private root: BTreeNode<T> | null = null;
  private t: number; // 最小度数
  private compare: CompareFn<T>;
  private size: number = 0;

  constructor(
    t: number = 3,
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ) {
    if (t < 2) {
      throw new Error("B树的最小度数t必须至少为2");
    }
    this.t = t;
    this.compare = compareFn;
  }

  /**
   * 获取树的大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 获取最小度数
   */
  getMinimumDegree(): number {
    return this.t;
  }

  /**
   * 检查树是否为空
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * 搜索键值
   * 时间复杂度: O(t log_t n)
   */
  search(key: T): BTreeSearchResult<T> {
    const path: Array<{ node: BTreeNode<T>; index: number }> = [];
    const result = this.searchHelper(this.root, key, path);

    return {
      found: result !== null,
      node: result?.node || null,
      index: result?.index || -1,
      path,
    };
  }

  /**
   * 搜索辅助函数
   */
  private searchHelper(
    node: BTreeNode<T> | null,
    key: T,
    path: Array<{ node: BTreeNode<T>; index: number }>
  ): { node: BTreeNode<T>; index: number } | null {
    if (node === null) {
      return null;
    }

    let i = 0;
    // 在当前节点中查找键值
    while (i < node.getKeyCount() && this.compare(key, node.keys[i]) > 0) {
      i++;
    }

    path.push({ node, index: i });

    // 找到键值
    if (i < node.getKeyCount() && this.compare(key, node.keys[i]) === 0) {
      return { node, index: i };
    }

    // 如果是叶子节点且未找到，返回null
    if (node.isLeaf) {
      return null;
    }

    // 递归搜索子节点
    return this.searchHelper(node.children[i], key, path);
  }

  /**
   * 插入键值
   * 时间复杂度: O(t log_t n)
   */
  insert(key: T): boolean {
    // 检查键值是否已存在
    if (this.search(key).found) {
      return false;
    }

    // 如果树为空，创建根节点
    if (this.root === null) {
      this.root = new BTreeNode<T>(true);
      this.root.keys.push(key);
      this.size++;
      return true;
    }

    // 如果根节点满了，需要分裂
    if (this.root.isFull(this.t)) {
      const newRoot = new BTreeNode<T>(false);
      newRoot.children.push(this.root);
      this.root.parent = newRoot;
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, key);
    this.size++;
    return true;
  }

  /**
   * 在非满节点中插入键值
   */
  private insertNonFull(node: BTreeNode<T>, key: T): void {
    let i = node.getKeyCount() - 1;

    if (node.isLeaf) {
      // 在叶子节点中插入
      node.keys.push(key); // 先添加一个位置
      while (i >= 0 && this.compare(key, node.keys[i]) < 0) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
    } else {
      // 在内部节点中插入
      while (i >= 0 && this.compare(key, node.keys[i]) < 0) {
        i--;
      }
      i++;

      // 如果目标子节点满了，先分裂
      if (node.children[i].isFull(this.t)) {
        this.splitChild(node, i);
        if (this.compare(key, node.keys[i]) > 0) {
          i++;
        }
      }

      this.insertNonFull(node.children[i], key);
    }
  }

  /**
   * 分裂子节点
   */
  private splitChild(parent: BTreeNode<T>, index: number): void {
    const fullChild = parent.children[index];
    const newChild = new BTreeNode<T>(fullChild.isLeaf);

    // 复制后半部分键值到新节点
    const midIndex = this.t - 1;
    for (let j = 0; j < this.t - 1; j++) {
      newChild.keys.push(fullChild.keys[midIndex + 1 + j]);
    }

    // 如果不是叶子节点，复制后半部分子节点
    if (!fullChild.isLeaf) {
      for (let j = 0; j < this.t; j++) {
        newChild.children.push(fullChild.children[midIndex + 1 + j]);
        newChild.children[j].parent = newChild;
      }
      fullChild.children.splice(midIndex + 1, this.t);
    }

    // 删除原节点的后半部分键值
    const midKey = fullChild.keys[midIndex];
    fullChild.keys.splice(midIndex, this.t);

    // 在父节点中插入新的子节点
    parent.insertChild(index + 1, newChild);

    // 在父节点中插入中间键值
    parent.insertKey(index, midKey);
  }

  /**
   * 删除键值
   * 时间复杂度: O(t log_t n)
   */
  delete(key: T): boolean {
    if (this.root === null) {
      return false;
    }

    const deleted = this.deleteHelper(this.root, key);

    // 如果根节点变空，更新根节点
    if (this.root.getKeyCount() === 0) {
      if (this.root.isLeaf) {
        this.root = null;
      } else {
        this.root = this.root.children[0];
        this.root.parent = null;
      }
    }

    if (deleted) {
      this.size--;
    }

    return deleted;
  }

  /**
   * 删除辅助函数
   */
  private deleteHelper(node: BTreeNode<T>, key: T): boolean {
    let i = 0;
    while (i < node.getKeyCount() && this.compare(key, node.keys[i]) > 0) {
      i++;
    }

    // 情况1：键值在当前节点中
    if (i < node.getKeyCount() && this.compare(key, node.keys[i]) === 0) {
      if (node.isLeaf) {
        // 情况1a：在叶子节点中删除
        node.removeKey(i);
        return true;
      } else {
        // 情况1b：在内部节点中删除
        return this.deleteFromInternalNode(node, key, i);
      }
    } else if (node.isLeaf) {
      // 情况2：键值不在树中
      return false;
    } else {
      // 情况3：键值在子树中
      const shouldGoDown =
        i === node.getKeyCount() || this.compare(key, node.keys[i]) < 0;
      const childIndex = shouldGoDown ? i : i + 1;

      if (node.children[childIndex].isMinimal(this.t)) {
        this.fixChild(node, childIndex);
        // 重新确定子节点索引
        return this.deleteHelper(node, key);
      } else {
        return this.deleteHelper(node.children[childIndex], key);
      }
    }
  }

  /**
   * 从内部节点删除键值
   */
  private deleteFromInternalNode(
    node: BTreeNode<T>,
    key: T,
    index: number
  ): boolean {
    const leftChild = node.children[index];
    const rightChild = node.children[index + 1];

    // 情况2a：左子节点有足够的键值
    if (!leftChild.isMinimal(this.t)) {
      const predecessor = this.getPredecessor(leftChild);
      node.keys[index] = predecessor;
      return this.deleteHelper(leftChild, predecessor);
    }
    // 情况2b：右子节点有足够的键值
    else if (!rightChild.isMinimal(this.t)) {
      const successor = this.getSuccessor(rightChild);
      node.keys[index] = successor;
      return this.deleteHelper(rightChild, successor);
    }
    // 情况2c：合并节点
    else {
      this.merge(node, index);
      return this.deleteHelper(leftChild, key);
    }
  }

  /**
   * 获取前驱
   */
  private getPredecessor(node: BTreeNode<T>): T {
    while (!node.isLeaf) {
      node = node.children[node.getChildCount() - 1];
    }
    return node.keys[node.getKeyCount() - 1];
  }

  /**
   * 获取后继
   */
  private getSuccessor(node: BTreeNode<T>): T {
    while (!node.isLeaf) {
      node = node.children[0];
    }
    return node.keys[0];
  }

  /**
   * 修复子节点（确保有足够的键值）
   */
  private fixChild(parent: BTreeNode<T>, childIndex: number): void {
    const child = parent.children[childIndex];

    // 尝试从左兄弟借键值
    if (childIndex > 0 && !parent.children[childIndex - 1].isMinimal(this.t)) {
      this.borrowFromLeftSibling(parent, childIndex);
    }
    // 尝试从右兄弟借键值
    else if (
      childIndex < parent.getChildCount() - 1 &&
      !parent.children[childIndex + 1].isMinimal(this.t)
    ) {
      this.borrowFromRightSibling(parent, childIndex);
    }
    // 合并节点
    else {
      if (childIndex === parent.getChildCount() - 1) {
        this.merge(parent, childIndex - 1);
      } else {
        this.merge(parent, childIndex);
      }
    }
  }

  /**
   * 从左兄弟借键值
   */
  private borrowFromLeftSibling(
    parent: BTreeNode<T>,
    childIndex: number
  ): void {
    const child = parent.children[childIndex];
    const leftSibling = parent.children[childIndex - 1];

    // 将父节点的键值移到子节点
    child.insertKey(0, parent.keys[childIndex - 1]);

    // 将左兄弟的最大键值移到父节点
    parent.keys[childIndex - 1] = leftSibling.removeKey(
      leftSibling.getKeyCount() - 1
    );

    // 如果不是叶子节点，也要移动子节点
    if (!child.isLeaf) {
      child.insertChild(
        0,
        leftSibling.removeChild(leftSibling.getChildCount() - 1)
      );
    }
  }

  /**
   * 从右兄弟借键值
   */
  private borrowFromRightSibling(
    parent: BTreeNode<T>,
    childIndex: number
  ): void {
    const child = parent.children[childIndex];
    const rightSibling = parent.children[childIndex + 1];

    // 将父节点的键值移到子节点
    child.keys.push(parent.keys[childIndex]);

    // 将右兄弟的最小键值移到父节点
    parent.keys[childIndex] = rightSibling.removeKey(0);

    // 如果不是叶子节点，也要移动子节点
    if (!child.isLeaf) {
      child.children.push(rightSibling.removeChild(0));
    }
  }

  /**
   * 合并节点
   */
  private merge(parent: BTreeNode<T>, index: number): void {
    const leftChild = parent.children[index];
    const rightChild = parent.children[index + 1];

    // 将父节点的键值移到左子节点
    leftChild.keys.push(parent.removeKey(index));

    // 将右子节点的所有键值移到左子节点
    leftChild.keys.push(...rightChild.keys);

    // 如果不是叶子节点，也要移动子节点
    if (!leftChild.isLeaf) {
      leftChild.children.push(...rightChild.children);
      rightChild.children.forEach((child) => (child.parent = leftChild));
    }

    // 删除右子节点
    parent.removeChild(index + 1);
  }

  /**
   * 中序遍历
   */
  inorderTraversal(): T[] {
    const result: T[] = [];
    this.inorderHelper(this.root, result);
    return result;
  }

  /**
   * 中序遍历辅助函数
   */
  private inorderHelper(node: BTreeNode<T> | null, result: T[]): void {
    if (node === null) return;

    for (let i = 0; i < node.getKeyCount(); i++) {
      if (!node.isLeaf) {
        this.inorderHelper(node.children[i], result);
      }
      result.push(node.keys[i]);
    }

    if (!node.isLeaf) {
      this.inorderHelper(node.children[node.getKeyCount()], result);
    }
  }

  /**
   * 获取树的高度
   */
  getHeight(): number {
    if (this.root === null) return 0;

    let height = 1;
    let current = this.root;
    while (!current.isLeaf) {
      current = current.children[0];
      height++;
    }
    return height;
  }

  /**
   * 验证B树的性质
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.root === null) {
      return { isValid: true, errors: [] };
    }

    this.validateNode(this.root, errors, null, null, true);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 验证节点
   */
  private validateNode(
    node: BTreeNode<T>,
    errors: string[],
    minKey: T | null,
    maxKey: T | null,
    isRoot: boolean
  ): number {
    // 检查键值数量
    const keyCount = node.getKeyCount();
    if (isRoot && keyCount === 0 && node.children.length > 0) {
      errors.push("根节点不能为空但有子节点");
    } else if (!isRoot && keyCount < this.t - 1) {
      errors.push(`非根节点键值数量${keyCount}少于最小值${this.t - 1}`);
    } else if (keyCount > 2 * this.t - 1) {
      errors.push(`节点键值数量${keyCount}超过最大值${2 * this.t - 1}`);
    }

    // 检查键值顺序
    for (let i = 1; i < keyCount; i++) {
      if (this.compare(node.keys[i - 1], node.keys[i]) >= 0) {
        errors.push("节点内键值未按升序排列");
      }
    }

    // 检查键值范围
    if (
      minKey !== null &&
      keyCount > 0 &&
      this.compare(node.keys[0], minKey) <= 0
    ) {
      errors.push("节点最小键值违反范围约束");
    }
    if (
      maxKey !== null &&
      keyCount > 0 &&
      this.compare(node.keys[keyCount - 1], maxKey) >= 0
    ) {
      errors.push("节点最大键值违反范围约束");
    }

    // 如果是叶子节点，返回高度
    if (node.isLeaf) {
      if (node.children.length > 0) {
        errors.push("叶子节点不能有子节点");
      }
      return 1;
    }

    // 检查子节点数量
    const childCount = node.getChildCount();
    if (childCount !== keyCount + 1) {
      errors.push(
        `内部节点子节点数量${childCount}应该等于键值数量${keyCount}+1`
      );
    }

    // 递归验证子节点并检查高度
    let height = -1;
    for (let i = 0; i < childCount; i++) {
      const child = node.children[i];

      // 检查父指针
      if (child.parent !== node) {
        errors.push("子节点的父指针不正确");
      }

      // 确定子节点的键值范围
      const childMinKey = i === 0 ? minKey : node.keys[i - 1];
      const childMaxKey = i === keyCount ? maxKey : node.keys[i];

      const childHeight = this.validateNode(
        child,
        errors,
        childMinKey,
        childMaxKey,
        false
      );

      if (height === -1) {
        height = childHeight;
      } else if (height !== childHeight) {
        errors.push("子树高度不一致");
      }
    }

    return height + 1;
  }

  /**
   * 获取统计信息
   */
  getStats(): BTreeStats {
    if (this.root === null) {
      return {
        nodeCount: 0,
        leafCount: 0,
        height: 0,
        totalKeys: 0,
        averageKeysPerNode: 0,
        minKeysPerNode: 0,
        maxKeysPerNode: 0,
      };
    }

    const stats = {
      nodeCount: 0,
      leafCount: 0,
      totalKeys: 0,
      minKeysPerNode: Infinity,
      maxKeysPerNode: 0,
    };

    this.collectStats(this.root, stats);

    return {
      ...stats,
      height: this.getHeight(),
      averageKeysPerNode: stats.totalKeys / stats.nodeCount,
      minKeysPerNode:
        stats.minKeysPerNode === Infinity ? 0 : stats.minKeysPerNode,
    };
  }

  /**
   * 收集统计信息
   */
  private collectStats(
    node: BTreeNode<T>,
    stats: {
      nodeCount: number;
      leafCount: number;
      totalKeys: number;
      minKeysPerNode: number;
      maxKeysPerNode: number;
    }
  ): void {
    stats.nodeCount++;
    stats.totalKeys += node.getKeyCount();
    stats.minKeysPerNode = Math.min(stats.minKeysPerNode, node.getKeyCount());
    stats.maxKeysPerNode = Math.max(stats.maxKeysPerNode, node.getKeyCount());

    if (node.isLeaf) {
      stats.leafCount++;
    } else {
      for (const child of node.children) {
        this.collectStats(child, stats);
      }
    }
  }

  /**
   * 打印树结构（用于调试）
   */
  printTree(): void {
    if (this.root === null) {
      console.log("空树");
      return;
    }

    console.log("=== B树结构 ===");
    this.printNode(this.root, 0);
  }

  /**
   * 打印节点
   */
  private printNode(node: BTreeNode<T>, level: number): void {
    const indent = "  ".repeat(level);
    const nodeType = node.isLeaf ? "叶子" : "内部";
    console.log(`${indent}${nodeType}节点: [${node.keys.join(", ")}]`);

    if (!node.isLeaf) {
      for (const child of node.children) {
        this.printNode(child, level + 1);
      }
    }
  }
}

/**
 * B树工具类
 */
export class BTreeUtils {
  /**
   * 从数组创建B树
   */
  static fromArray<T>(
    array: T[],
    t: number = 3,
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): BTree<T> {
    const tree = new BTree(t, compareFn);
    for (const item of array) {
      tree.insert(item);
    }
    return tree;
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("=== B树性能测试 ===\n");

    const sizes = [1000, 5000, 10000];
    const degrees = [3, 5, 10];

    for (const t of degrees) {
      console.log(`--- 最小度数 t=${t} ---`);

      for (const size of sizes) {
        const tree = new BTree<number>(t);
        const values = Array.from({ length: size }, (_, i) => i);

        // 随机打乱
        for (let i = values.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [values[i], values[j]] = [values[j], values[i]];
        }

        // 插入测试
        const insertStart = performance.now();
        for (const value of values) {
          tree.insert(value);
        }
        const insertTime = performance.now() - insertStart;

        // 搜索测试
        const searchStart = performance.now();
        for (let i = 0; i < 100; i++) {
          const randomValue = Math.floor(Math.random() * size);
          tree.search(randomValue);
        }
        const searchTime = performance.now() - searchStart;

        // 统计信息
        const stats = tree.getStats();
        const validation = tree.validate();

        console.log(`  大小 ${size}:`);
        console.log(`    插入时间: ${insertTime.toFixed(2)}ms`);
        console.log(`    搜索时间: ${searchTime.toFixed(2)}ms (100次)`);
        console.log(`    树高度: ${stats.height}`);
        console.log(
          `    平均键值/节点: ${stats.averageKeysPerNode.toFixed(1)}`
        );
        console.log(`    验证结果: ${validation.isValid ? "✅" : "❌"}`);
      }
      console.log();
    }
  }

  /**
   * 演示B树操作
   */
  static demonstrate(): void {
    console.log("=== B树操作演示 ===\n");

    const tree = new BTree<number>(3);
    const values = [10, 20, 5, 15, 25, 1, 30, 35, 40, 50];

    console.log("--- 插入操作 ---");
    for (const value of values) {
      console.log(`插入 ${value}`);
      tree.insert(value);
      const validation = tree.validate();
      if (!validation.isValid) {
        console.log(`❌ 验证失败: ${validation.errors.join(", ")}`);
      }
    }

    tree.printTree();
    console.log(`中序遍历: [${tree.inorderTraversal().join(", ")}]`);

    console.log("\n--- 搜索操作 ---");
    const searchValues = [15, 25, 100];
    for (const value of searchValues) {
      const result = tree.search(value);
      console.log(`搜索 ${value}: ${result.found ? "找到" : "未找到"}`);
    }

    console.log("\n--- 删除操作 ---");
    const deleteValues = [1, 15, 30];
    for (const value of deleteValues) {
      console.log(`删除 ${value}`);
      const deleted = tree.delete(value);
      console.log(`结果: ${deleted ? "成功" : "失败"}`);
      const validation = tree.validate();
      if (!validation.isValid) {
        console.log(`❌ 验证失败: ${validation.errors.join(", ")}`);
      }
    }

    tree.printTree();
    console.log(`中序遍历: [${tree.inorderTraversal().join(", ")}]`);

    console.log("\n--- 统计信息 ---");
    const stats = tree.getStats();
    console.log(`节点数量: ${stats.nodeCount}`);
    console.log(`叶子节点数量: ${stats.leafCount}`);
    console.log(`树高度: ${stats.height}`);
    console.log(`总键值数: ${stats.totalKeys}`);
    console.log(`平均键值/节点: ${stats.averageKeysPerNode.toFixed(2)}`);
  }
}
