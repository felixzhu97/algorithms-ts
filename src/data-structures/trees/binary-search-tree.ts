import { CompareFn, defaultCompare, TreeNode } from "../../types";

/**
 * 二叉搜索树实现
 * 《算法导论》第12章 二叉搜索树
 *
 * 二叉搜索树是一种基于比较的数据结构，满足以下性质：
 * - 对于树中任意节点x，其左子树中所有节点的值都小于x的值
 * - 对于树中任意节点x，其右子树中所有节点的值都大于x的值
 * - 左子树和右子树也都是二叉搜索树
 *
 * 时间复杂度：
 * - 搜索、插入、删除：平均O(log n)，最坏O(n)
 * - 遍历：O(n)
 *
 * 空间复杂度：O(n)
 */

/**
 * 二叉搜索树节点
 */
export class BSTNode<T> implements TreeNode<T> {
  public value: T;
  public left: BSTNode<T> | null = null;
  public right: BSTNode<T> | null = null;
  public parent: BSTNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }

  /**
   * 检查节点是否为叶子节点
   */
  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }

  /**
   * 检查节点是否为根节点
   */
  isRoot(): boolean {
    return this.parent === null;
  }

  /**
   * 检查节点是否为父节点的左子节点
   */
  isLeftChild(): boolean {
    return this.parent !== null && this.parent.left === this;
  }

  /**
   * 检查节点是否为父节点的右子节点
   */
  isRightChild(): boolean {
    return this.parent !== null && this.parent.right === this;
  }

  /**
   * 获取节点的子节点数量
   */
  getChildrenCount(): number {
    let count = 0;
    if (this.left) count++;
    if (this.right) count++;
    return count;
  }
}

/**
 * 二叉搜索树类
 */
export class BinarySearchTree<T> {
  private root: BSTNode<T> | null = null;
  private compare: CompareFn<T>;
  private nodeCount = 0;

  constructor(compareFn: CompareFn<T> = defaultCompare as CompareFn<T>) {
    this.compare = compareFn;
  }

  /**
   * 获取树的根节点
   */
  getRoot(): BSTNode<T> | null {
    return this.root;
  }

  /**
   * 获取树的大小（节点数量）
   */
  size(): number {
    return this.nodeCount;
  }

  /**
   * 检查树是否为空
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * 清空树
   */
  clear(): void {
    this.root = null;
    this.nodeCount = 0;
  }

  /**
   * 搜索值
   * 时间复杂度：O(h)，其中h是树的高度
   * @param value 要搜索的值
   * @returns 包含该值的节点，如果不存在则返回null
   */
  search(value: T): BSTNode<T> | null {
    return this.searchNode(this.root, value);
  }

  /**
   * 递归搜索节点
   */
  private searchNode(node: BSTNode<T> | null, value: T): BSTNode<T> | null {
    if (node === null) {
      return null;
    }

    const cmp = this.compare(value, node.value);
    if (cmp === 0) {
      return node;
    } else if (cmp < 0) {
      return this.searchNode(node.left, value);
    } else {
      return this.searchNode(node.right, value);
    }
  }

  /**
   * 迭代搜索（非递归版本）
   * @param value 要搜索的值
   * @returns 包含该值的节点，如果不存在则返回null
   */
  searchIterative(value: T): BSTNode<T> | null {
    let current = this.root;

    while (current !== null) {
      const cmp = this.compare(value, current.value);
      if (cmp === 0) {
        return current;
      } else if (cmp < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  /**
   * 检查树中是否包含某个值
   * @param value 要检查的值
   * @returns 是否包含该值
   */
  contains(value: T): boolean {
    return this.search(value) !== null;
  }

  /**
   * 插入值
   * 时间复杂度：O(h)
   * @param value 要插入的值
   * @returns 是否成功插入（如果值已存在则返回false）
   */
  insert(value: T): boolean {
    const newNode = new BSTNode(value);

    if (this.root === null) {
      this.root = newNode;
      this.nodeCount++;
      return true;
    }

    return this.insertNode(this.root, newNode);
  }

  /**
   * 递归插入节点
   */
  private insertNode(node: BSTNode<T>, newNode: BSTNode<T>): boolean {
    const cmp = this.compare(newNode.value, node.value);

    if (cmp === 0) {
      // 值已存在，不插入
      return false;
    } else if (cmp < 0) {
      if (node.left === null) {
        node.left = newNode;
        newNode.parent = node;
        this.nodeCount++;
        return true;
      } else {
        return this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
        newNode.parent = node;
        this.nodeCount++;
        return true;
      } else {
        return this.insertNode(node.right, newNode);
      }
    }
  }

  /**
   * 迭代插入（非递归版本）
   * @param value 要插入的值
   * @returns 是否成功插入
   */
  insertIterative(value: T): boolean {
    const newNode = new BSTNode(value);

    if (this.root === null) {
      this.root = newNode;
      this.nodeCount++;
      return true;
    }

    let current = this.root;
    let parent: BSTNode<T>;

    while (true) {
      parent = current;
      const cmp = this.compare(value, current.value);

      if (cmp === 0) {
        return false; // 值已存在
      } else if (cmp < 0) {
        current = current.left!;
        if (current === null) {
          parent.left = newNode;
          newNode.parent = parent;
          this.nodeCount++;
          return true;
        }
      } else {
        current = current.right!;
        if (current === null) {
          parent.right = newNode;
          newNode.parent = parent;
          this.nodeCount++;
          return true;
        }
      }
    }
  }

  /**
   * 删除值
   * 时间复杂度：O(h)
   * @param value 要删除的值
   * @returns 是否成功删除
   */
  delete(value: T): boolean {
    const nodeToDelete = this.search(value);
    if (nodeToDelete === null) {
      return false;
    }

    this.deleteNode(nodeToDelete);
    this.nodeCount--;
    return true;
  }

  /**
   * 删除节点
   * 三种情况：
   * 1. 节点是叶子节点：直接删除
   * 2. 节点有一个子节点：用子节点替换该节点
   * 3. 节点有两个子节点：用后继节点替换该节点
   */
  private deleteNode(node: BSTNode<T>): void {
    if (node.left === null) {
      // 情况1和2：没有左子节点
      this.transplant(node, node.right);
    } else if (node.right === null) {
      // 情况2：只有左子节点
      this.transplant(node, node.left);
    } else {
      // 情况3：有两个子节点
      const successor = this.minimum(node.right);
      if (successor.parent !== node) {
        this.transplant(successor, successor.right);
        successor.right = node.right;
        successor.right.parent = successor;
      }
      this.transplant(node, successor);
      successor.left = node.left;
      successor.left.parent = successor;
    }
  }

  /**
   * 用一个子树替换另一个子树
   * @param u 被替换的节点
   * @param v 替换的节点
   */
  private transplant(u: BSTNode<T>, v: BSTNode<T> | null): void {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    if (v !== null) {
      v.parent = u.parent;
    }
  }

  /**
   * 找到子树的最小值节点
   * @param node 子树根节点
   * @returns 最小值节点
   */
  minimum(node?: BSTNode<T> | null): BSTNode<T> {
    const startNode = node || this.root;
    if (startNode === null) {
      throw new Error("Tree is empty");
    }

    let current = startNode;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  /**
   * 找到子树的最大值节点
   * @param node 子树根节点
   * @returns 最大值节点
   */
  maximum(node?: BSTNode<T> | null): BSTNode<T> {
    const startNode = node || this.root;
    if (startNode === null) {
      throw new Error("Tree is empty");
    }

    let current = startNode;
    while (current.right !== null) {
      current = current.right;
    }
    return current;
  }

  /**
   * 找到节点的后继节点
   * @param node 节点
   * @returns 后继节点，如果不存在则返回null
   */
  successor(node: BSTNode<T>): BSTNode<T> | null {
    if (node.right !== null) {
      return this.minimum(node.right);
    }

    let parent = node.parent;
    let current = node;
    while (parent !== null && current === parent.right) {
      current = parent;
      parent = parent.parent;
    }
    return parent;
  }

  /**
   * 找到节点的前驱节点
   * @param node 节点
   * @returns 前驱节点，如果不存在则返回null
   */
  predecessor(node: BSTNode<T>): BSTNode<T> | null {
    if (node.left !== null) {
      return this.maximum(node.left);
    }

    let parent = node.parent;
    let current = node;
    while (parent !== null && current === parent.left) {
      current = parent;
      parent = parent.parent;
    }
    return parent;
  }

  /**
   * 中序遍历（左-根-右）
   * 对于二叉搜索树，中序遍历会得到排序后的序列
   */
  inorderTraversal(): T[] {
    const result: T[] = [];
    this.inorderTraversalHelper(this.root, result);
    return result;
  }

  private inorderTraversalHelper(node: BSTNode<T> | null, result: T[]): void {
    if (node !== null) {
      this.inorderTraversalHelper(node.left, result);
      result.push(node.value);
      this.inorderTraversalHelper(node.right, result);
    }
  }

  /**
   * 前序遍历（根-左-右）
   */
  preorderTraversal(): T[] {
    const result: T[] = [];
    this.preorderTraversalHelper(this.root, result);
    return result;
  }

  private preorderTraversalHelper(node: BSTNode<T> | null, result: T[]): void {
    if (node !== null) {
      result.push(node.value);
      this.preorderTraversalHelper(node.left, result);
      this.preorderTraversalHelper(node.right, result);
    }
  }

  /**
   * 后序遍历（左-右-根）
   */
  postorderTraversal(): T[] {
    const result: T[] = [];
    this.postorderTraversalHelper(this.root, result);
    return result;
  }

  private postorderTraversalHelper(node: BSTNode<T> | null, result: T[]): void {
    if (node !== null) {
      this.postorderTraversalHelper(node.left, result);
      this.postorderTraversalHelper(node.right, result);
      result.push(node.value);
    }
  }

  /**
   * 层序遍历（广度优先遍历）
   */
  levelOrderTraversal(): T[] {
    if (this.root === null) {
      return [];
    }

    const result: T[] = [];
    const queue: BSTNode<T>[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    return result;
  }

  /**
   * 获取树的高度
   */
  height(): number {
    return this.getHeight(this.root);
  }

  private getHeight(node: BSTNode<T> | null): number {
    if (node === null) {
      return -1;
    }
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  /**
   * 验证是否为有效的二叉搜索树
   */
  isValidBST(): boolean {
    return this.validateBST(this.root, null, null);
  }

  private validateBST(
    node: BSTNode<T> | null,
    min: T | null,
    max: T | null
  ): boolean {
    if (node === null) {
      return true;
    }

    if (
      (min !== null && this.compare(node.value, min) <= 0) ||
      (max !== null && this.compare(node.value, max) >= 0)
    ) {
      return false;
    }

    return (
      this.validateBST(node.left, min, node.value) &&
      this.validateBST(node.right, node.value, max)
    );
  }

  /**
   * 获取范围内的所有值
   * @param min 最小值
   * @param max 最大值
   * @returns 范围内的值数组
   */
  rangeQuery(min: T, max: T): T[] {
    const result: T[] = [];
    this.rangeQueryHelper(this.root, min, max, result);
    return result;
  }

  private rangeQueryHelper(
    node: BSTNode<T> | null,
    min: T,
    max: T,
    result: T[]
  ): void {
    if (node === null) {
      return;
    }

    const cmpMin = this.compare(node.value, min);
    const cmpMax = this.compare(node.value, max);

    if (cmpMin > 0) {
      this.rangeQueryHelper(node.left, min, max, result);
    }

    if (cmpMin >= 0 && cmpMax <= 0) {
      result.push(node.value);
    }

    if (cmpMax < 0) {
      this.rangeQueryHelper(node.right, min, max, result);
    }
  }

  /**
   * 从数组构建平衡的二叉搜索树
   * @param sortedArray 已排序的数组
   */
  static fromSortedArray<T>(
    sortedArray: T[],
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): BinarySearchTree<T> {
    const tree = new BinarySearchTree(compareFn);
    tree.root = tree.buildBalancedBST(sortedArray, 0, sortedArray.length - 1);
    tree.nodeCount = sortedArray.length;
    return tree;
  }

  private buildBalancedBST(
    arr: T[],
    start: number,
    end: number,
    parent: BSTNode<T> | null = null
  ): BSTNode<T> | null {
    if (start > end) {
      return null;
    }

    const mid = Math.floor((start + end) / 2);
    const node = new BSTNode(arr[mid]);
    node.parent = parent;

    node.left = this.buildBalancedBST(arr, start, mid - 1, node);
    node.right = this.buildBalancedBST(arr, mid + 1, end, node);

    return node;
  }

  /**
   * 转换为数组（中序遍历）
   */
  toArray(): T[] {
    return this.inorderTraversal();
  }

  /**
   * 获取树的字符串表示
   */
  toString(): string {
    if (this.root === null) {
      return "BST(empty)";
    }
    return `BST([${this.inorderTraversal().join(", ")}])`;
  }

  /**
   * 打印树结构（用于调试）
   */
  printTree(): void {
    if (this.root === null) {
      console.log("Tree is empty");
      return;
    }
    this.printTreeHelper(this.root, "", true);
  }

  private printTreeHelper(
    node: BSTNode<T>,
    prefix: string,
    isLast: boolean
  ): void {
    if (node !== null) {
      console.log(prefix + (isLast ? "└── " : "├── ") + node.value);

      const children = [node.left, node.right].filter(
        (child) => child !== null
      );
      children.forEach((child, index) => {
        const isLastChild = index === children.length - 1;
        this.printTreeHelper(
          child!,
          prefix + (isLast ? "    " : "│   "),
          isLastChild
        );
      });
    }
  }
}
