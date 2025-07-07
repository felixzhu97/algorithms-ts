/**
 * 斐波那契堆数据结构实现
 * 《算法导论》第20章 斐波那契堆
 *
 * 斐波那契堆是一种支持高效减小键值操作的堆数据结构。
 * 主要特点：
 * 1. 插入：O(1) 摊还时间
 * 2. 查找最小值：O(1) 时间
 * 3. 合并：O(1) 时间
 * 4. 提取最小值：O(log n) 摊还时间
 * 5. 减小键值：O(1) 摊还时间
 * 6. 删除：O(log n) 摊还时间
 */

import { CompareFn, defaultCompare } from "../../types";

/**
 * 斐波那契堆节点
 */
export class FibonacciNode<T> {
  public value: T;
  public degree: number = 0; // 度数（子节点数量）
  public marked: boolean = false; // 标记位
  public parent: FibonacciNode<T> | null = null;
  public child: FibonacciNode<T> | null = null; // 任意一个子节点
  public left: FibonacciNode<T>; // 左兄弟
  public right: FibonacciNode<T>; // 右兄弟

  constructor(value: T) {
    this.value = value;
    this.left = this;
    this.right = this;
  }

  /**
   * 获取所有子节点
   */
  getChildren(): FibonacciNode<T>[] {
    const children: FibonacciNode<T>[] = [];
    if (this.child === null) {
      return children;
    }

    let current = this.child;
    do {
      children.push(current);
      current = current.right;
    } while (current !== this.child);

    return children;
  }

  /**
   * 添加子节点
   */
  addChild(child: FibonacciNode<T>): void {
    child.parent = this;
    child.marked = false;

    if (this.child === null) {
      this.child = child;
      child.left = child;
      child.right = child;
    } else {
      // 将子节点插入到子节点循环链表中
      child.left = this.child.left;
      child.right = this.child;
      this.child.left.right = child;
      this.child.left = child;
    }

    this.degree++;
  }

  /**
   * 移除子节点
   */
  removeChild(child: FibonacciNode<T>): void {
    if (this.child === child) {
      if (child.right === child) {
        // 只有一个子节点
        this.child = null;
      } else {
        this.child = child.right;
      }
    }

    // 从循环链表中移除
    child.left.right = child.right;
    child.right.left = child.left;
    child.parent = null;
    child.left = child;
    child.right = child;

    this.degree--;
  }

  /**
   * 检查是否为根节点
   */
  isRoot(): boolean {
    return this.parent === null;
  }
}

/**
 * 斐波那契堆类
 */
export class FibonacciHeap<T> {
  private min: FibonacciNode<T> | null = null; // 最小节点
  private size: number = 0;
  private compare: CompareFn<T>;

  constructor(compareFn: CompareFn<T> = defaultCompare as CompareFn<T>) {
    this.compare = compareFn;
  }

  /**
   * 获取堆的大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 检查堆是否为空
   */
  isEmpty(): boolean {
    return this.min === null;
  }

  /**
   * 获取最小值（不删除）
   * 时间复杂度: O(1)
   */
  minimum(): T | null {
    return this.min?.value || null;
  }

  /**
   * 插入新元素
   * 摊还时间复杂度: O(1)
   */
  insert(value: T): FibonacciNode<T> {
    const newNode = new FibonacciNode(value);

    if (this.min === null) {
      this.min = newNode;
    } else {
      // 将新节点插入到根列表中
      this.insertToRootList(newNode);

      // 更新最小值
      if (this.compare(newNode.value, this.min.value) < 0) {
        this.min = newNode;
      }
    }

    this.size++;
    return newNode;
  }

  /**
   * 提取最小值
   * 摊还时间复杂度: O(log n)
   */
  extractMin(): T | null {
    const minNode = this.min;

    if (minNode === null) {
      return null;
    }

    // 将最小节点的所有子节点提升到根列表
    const children = minNode.getChildren();
    for (const child of children) {
      child.parent = null;
      child.marked = false;
      this.insertToRootList(child);
    }

    // 从根列表中移除最小节点
    this.removeFromRootList(minNode);

    if (minNode === minNode.right) {
      // 堆只有一个节点
      this.min = null;
    } else {
      this.min = minNode.right;
      this.consolidate();
    }

    this.size--;
    return minNode.value;
  }

  /**
   * 减小键值
   * 摊还时间复杂度: O(1)
   */
  decreaseKey(node: FibonacciNode<T>, newValue: T): boolean {
    if (this.compare(newValue, node.value) > 0) {
      return false; // 新值不能大于原值
    }

    node.value = newValue;
    const parent = node.parent;

    if (parent !== null && this.compare(node.value, parent.value) < 0) {
      this.cut(node, parent);
      this.cascadingCut(parent);
    }

    if (this.min === null || this.compare(node.value, this.min.value) < 0) {
      this.min = node;
    }

    return true;
  }

  /**
   * 删除节点
   * 摊还时间复杂度: O(log n)
   */
  delete(node: FibonacciNode<T>): boolean {
    // 创建一个比所有值都小的虚拟最小值
    const minValue = {} as T;
    const originalCompare = this.compare;

    // 临时修改比较函数，使虚拟值最小
    this.compare = (a: T, b: T) => {
      if (a === minValue) return -1;
      if (b === minValue) return 1;
      return originalCompare(a, b);
    };

    // 将节点值设为虚拟最小值并减小键值
    node.value = minValue;
    const parent = node.parent;

    if (parent !== null) {
      this.cut(node, parent);
      this.cascadingCut(parent);
    }

    this.min = node;

    // 恢复比较函数
    this.compare = originalCompare;

    // 提取最小值（即目标节点）
    const extracted = this.extractMin();

    return extracted === minValue;
  }

  /**
   * 合并两个斐波那契堆
   * 时间复杂度: O(1)
   */
  union(other: FibonacciHeap<T>): void {
    if (other.min === null) {
      return;
    }

    if (this.min === null) {
      this.min = other.min;
      this.size = other.size;
      return;
    }

    // 合并根列表
    const thisLeft = this.min.left;
    const otherLeft = other.min.left;

    this.min.left = otherLeft;
    otherLeft.right = this.min;
    other.min.left = thisLeft;
    thisLeft.right = other.min;

    // 更新最小值
    if (this.compare(other.min.value, this.min.value) < 0) {
      this.min = other.min;
    }

    this.size += other.size;

    // 清空另一个堆
    other.min = null;
    other.size = 0;
  }

  /**
   * 将节点插入到根列表
   */
  private insertToRootList(node: FibonacciNode<T>): void {
    if (this.min === null) {
      this.min = node;
      node.left = node;
      node.right = node;
    } else {
      node.left = this.min.left;
      node.right = this.min;
      this.min.left.right = node;
      this.min.left = node;
    }
  }

  /**
   * 从根列表移除节点
   */
  private removeFromRootList(node: FibonacciNode<T>): void {
    if (node.right === node) {
      // 只有一个根节点
      this.min = null;
    } else {
      node.left.right = node.right;
      node.right.left = node.left;
      if (this.min === node) {
        this.min = node.right;
      }
    }

    node.left = node;
    node.right = node;
  }

  /**
   * 整理堆：确保没有两个根有相同的度数
   */
  private consolidate(): void {
    const maxDegree = Math.floor(Math.log2(this.size)) + 1;
    const degreeArray: (FibonacciNode<T> | null)[] = new Array(
      maxDegree + 1
    ).fill(null);

    // 收集所有根节点
    const roots: FibonacciNode<T>[] = [];
    if (this.min !== null) {
      let current = this.min;
      do {
        roots.push(current);
        current = current.right;
      } while (current !== this.min);
    }

    // 对每个根节点进行度数整理
    for (const root of roots) {
      let x = root;
      let degree = x.degree;

      while (degreeArray[degree] !== null) {
        let y = degreeArray[degree]!;

        if (this.compare(x.value, y.value) > 0) {
          [x, y] = [y, x];
        }

        this.link(y, x);
        degreeArray[degree] = null;
        degree++;
      }

      degreeArray[degree] = x;
    }

    // 重建根列表和更新最小值
    this.min = null;
    for (const node of degreeArray) {
      if (node !== null) {
        if (this.min === null) {
          this.min = node;
          node.left = node;
          node.right = node;
        } else {
          this.insertToRootList(node);
          if (this.compare(node.value, this.min.value) < 0) {
            this.min = node;
          }
        }
      }
    }
  }

  /**
   * 链接两个节点：将y作为x的子节点
   */
  private link(y: FibonacciNode<T>, x: FibonacciNode<T>): void {
    // 从根列表中移除y
    y.left.right = y.right;
    y.right.left = y.left;

    // 将y作为x的子节点
    x.addChild(y);
    y.marked = false;
  }

  /**
   * 切断操作：将子节点从父节点中分离
   */
  private cut(x: FibonacciNode<T>, y: FibonacciNode<T>): void {
    // 从y的子节点列表中移除x
    y.removeChild(x);

    // 将x添加到根列表
    this.insertToRootList(x);
    x.marked = false;
  }

  /**
   * 级联切断操作
   */
  private cascadingCut(y: FibonacciNode<T>): void {
    const z = y.parent;

    if (z !== null) {
      if (!y.marked) {
        y.marked = true;
      } else {
        this.cut(y, z);
        this.cascadingCut(z);
      }
    }
  }

  /**
   * 获取根节点列表
   */
  getRoots(): FibonacciNode<T>[] {
    const roots: FibonacciNode<T>[] = [];

    if (this.min === null) {
      return roots;
    }

    let current = this.min;
    do {
      roots.push(current);
      current = current.right;
    } while (current !== this.min);

    return roots;
  }

  /**
   * 获取度数列表
   */
  getDegrees(): number[] {
    return this.getRoots().map((root) => root.degree);
  }

  /**
   * 获取标记节点数量
   */
  getMarkedNodeCount(): number {
    let count = 0;
    this.traverseAllNodes((node) => {
      if (node.marked) count++;
    });
    return count;
  }

  /**
   * 遍历所有节点
   */
  private traverseAllNodes(callback: (node: FibonacciNode<T>) => void): void {
    if (this.min === null) return;

    const visited = new Set<FibonacciNode<T>>();
    const stack: FibonacciNode<T>[] = [];

    // 将所有根节点加入栈
    let current = this.min;
    do {
      stack.push(current);
      current = current.right;
    } while (current !== this.min);

    while (stack.length > 0) {
      const node = stack.pop()!;

      if (visited.has(node)) continue;
      visited.add(node);

      callback(node);

      // 添加所有子节点到栈
      const children = node.getChildren();
      for (const child of children) {
        if (!visited.has(child)) {
          stack.push(child);
        }
      }
    }
  }

  /**
   * 验证斐波那契堆的性质
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.min === null) {
      if (this.size !== 0) {
        errors.push("空堆的大小应该为0");
      }
      return { isValid: errors.length === 0, errors };
    }

    // 验证最小值
    let actualMin = this.min.value;
    this.traverseAllNodes((node) => {
      if (this.compare(node.value, actualMin) < 0) {
        actualMin = node.value;
      }
    });

    if (this.compare(this.min.value, actualMin) !== 0) {
      errors.push("最小值指针不正确");
    }

    // 验证堆性质
    this.traverseAllNodes((node) => {
      const children = node.getChildren();
      for (const child of children) {
        if (this.compare(child.value, node.value) < 0) {
          errors.push(
            `堆性质违反: 子节点${child.value}小于父节点${node.value}`
          );
        }
        if (child.parent !== node) {
          errors.push("父指针不正确");
        }
      }

      // 验证度数
      if (node.degree !== children.length) {
        errors.push(
          `节点度数${node.degree}与子节点数量${children.length}不匹配`
        );
      }
    });

    // 验证根节点的parent指针
    const roots = this.getRoots();
    for (const root of roots) {
      if (root.parent !== null) {
        errors.push("根节点的父指针应该为null");
      }
    }

    // 验证大小
    let actualSize = 0;
    this.traverseAllNodes(() => actualSize++);
    if (actualSize !== this.size) {
      errors.push(`大小不匹配: 计算值${actualSize}, 存储值${this.size}`);
    }

    // 验证标记：根节点不应该被标记
    for (const root of roots) {
      if (root.marked) {
        errors.push("根节点不应该被标记");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    size: number;
    rootCount: number;
    maxDegree: number;
    degrees: number[];
    markedNodes: number;
    maxDepth: number;
  } {
    const roots = this.getRoots();
    const degrees = roots.map((root) => root.degree);

    return {
      size: this.size,
      rootCount: roots.length,
      maxDegree: degrees.length > 0 ? Math.max(...degrees) : 0,
      degrees,
      markedNodes: this.getMarkedNodeCount(),
      maxDepth: this.getMaxDepth(),
    };
  }

  /**
   * 获取最大深度
   */
  private getMaxDepth(): number {
    let maxDepth = 0;

    const getDepth = (node: FibonacciNode<T>, depth: number): void => {
      maxDepth = Math.max(maxDepth, depth);
      const children = node.getChildren();
      for (const child of children) {
        getDepth(child, depth + 1);
      }
    };

    const roots = this.getRoots();
    for (const root of roots) {
      getDepth(root, 1);
    }

    return maxDepth;
  }

  /**
   * 转换为数组（按堆序）
   */
  toArray(): T[] {
    const result: T[] = [];
    const tempHeap = this.clone();

    while (!tempHeap.isEmpty()) {
      const min = tempHeap.extractMin();
      if (min !== null) {
        result.push(min);
      }
    }

    return result;
  }

  /**
   * 克隆堆
   */
  clone(): FibonacciHeap<T> {
    const newHeap = new FibonacciHeap<T>(this.compare);

    if (this.min === null) {
      return newHeap;
    }

    const nodeMap = new Map<FibonacciNode<T>, FibonacciNode<T>>();

    // 第一遍：创建所有节点的副本
    this.traverseAllNodes((node) => {
      const newNode = new FibonacciNode(node.value);
      newNode.degree = node.degree;
      newNode.marked = node.marked;
      nodeMap.set(node, newNode);
    });

    // 第二遍：重建关系
    this.traverseAllNodes((node) => {
      const newNode = nodeMap.get(node)!;

      if (node.parent !== null) {
        newNode.parent = nodeMap.get(node.parent)!;
      }

      if (node.child !== null) {
        newNode.child = nodeMap.get(node.child)!;
      }

      newNode.left = nodeMap.get(node.left)!;
      newNode.right = nodeMap.get(node.right)!;
    });

    newHeap.min = nodeMap.get(this.min)!;
    newHeap.size = this.size;

    return newHeap;
  }

  /**
   * 打印堆结构（用于调试）
   */
  printHeap(): void {
    if (this.min === null) {
      console.log("空堆");
      return;
    }

    console.log("=== 斐波那契堆结构 ===");
    console.log(`大小: ${this.size}`);
    console.log(`最小值: ${this.min.value}`);
    console.log(`根节点数量: ${this.getRoots().length}`);
    console.log(`度数列表: [${this.getDegrees().join(", ")}]`);

    const roots = this.getRoots();
    for (let i = 0; i < roots.length; i++) {
      console.log(`\n根节点 ${i + 1} (度数 ${roots[i].degree}):`);
      this.printTree(roots[i], 0);
    }
  }

  /**
   * 打印树结构
   */
  private printTree(node: FibonacciNode<T>, level: number): void {
    const indent = "  ".repeat(level);
    const mark = node.marked ? " [M]" : "";
    console.log(`${indent}${node.value}${mark} (度数: ${node.degree})`);

    const children = node.getChildren();
    for (const child of children) {
      this.printTree(child, level + 1);
    }
  }
}

/**
 * 斐波那契堆工具类
 */
export class FibonacciHeapUtils {
  /**
   * 从数组创建斐波那契堆
   */
  static fromArray<T>(
    array: T[],
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): FibonacciHeap<T> {
    const heap = new FibonacciHeap(compareFn);
    for (const item of array) {
      heap.insert(item);
    }
    return heap;
  }

  /**
   * 堆排序
   */
  static heapSort<T>(
    array: T[],
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): T[] {
    const heap = FibonacciHeapUtils.fromArray(array, compareFn);
    return heap.toArray();
  }

  /**
   * Dijkstra算法的高效实现（使用斐波那契堆）
   */
  static dijkstraWithFibonacciHeap<T>(
    graph: Map<T, Array<{ node: T; weight: number }>>,
    source: T,
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): Map<T, { distance: number; previous: T | null }> {
    const heap = new FibonacciHeap<{ node: T; distance: number }>(
      (a, b) => a.distance - b.distance
    );
    const nodeToHeapNode = new Map<
      T,
      FibonacciNode<{ node: T; distance: number }>
    >();
    const distances = new Map<T, number>();
    const previous = new Map<T, T | null>();
    const visited = new Set<T>();

    // 初始化距离
    for (const node of graph.keys()) {
      const distance = compareFn(node, source) === 0 ? 0 : Infinity;
      distances.set(node, distance);
      previous.set(node, null);

      const heapNode = heap.insert({ node, distance });
      nodeToHeapNode.set(node, heapNode);
    }

    while (!heap.isEmpty()) {
      const minItem = heap.extractMin();
      if (minItem === null) break;

      const currentNode = minItem.node;
      if (visited.has(currentNode)) continue;

      visited.add(currentNode);
      nodeToHeapNode.delete(currentNode);

      const neighbors = graph.get(currentNode) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (visited.has(neighbor)) continue;

        const newDistance = distances.get(currentNode)! + weight;
        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance);
          previous.set(neighbor, currentNode);

          const heapNode = nodeToHeapNode.get(neighbor);
          if (heapNode) {
            heap.decreaseKey(heapNode, {
              node: neighbor,
              distance: newDistance,
            });
          }
        }
      }
    }

    const result = new Map<T, { distance: number; previous: T | null }>();
    for (const node of graph.keys()) {
      result.set(node, {
        distance: distances.get(node)!,
        previous: previous.get(node)!,
      });
    }

    return result;
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("=== 斐波那契堆性能测试 ===\n");

    const sizes = [1000, 5000, 10000];

    for (const size of sizes) {
      console.log(`--- 大小: ${size} ---`);

      const values = Array.from({ length: size }, () =>
        Math.floor(Math.random() * size)
      );

      // 插入测试
      const heap = new FibonacciHeap<number>();
      const nodes: FibonacciNode<number>[] = [];

      const insertStart = performance.now();
      for (const value of values) {
        nodes.push(heap.insert(value));
      }
      const insertTime = performance.now() - insertStart;

      // 减小键值测试
      const decreaseStart = performance.now();
      for (let i = 0; i < Math.min(100, nodes.length); i++) {
        const randomIndex = Math.floor(Math.random() * nodes.length);
        const newValue = Math.floor(Math.random() * 100);
        heap.decreaseKey(nodes[randomIndex], newValue);
      }
      const decreaseTime = performance.now() - decreaseStart;

      // 提取最小值测试
      const extractStart = performance.now();
      const extracted: number[] = [];
      for (let i = 0; i < Math.min(100, size); i++) {
        const min = heap.extractMin();
        if (min !== null) {
          extracted.push(min);
        }
      }
      const extractTime = performance.now() - extractStart;

      // 验证有序性
      const isSorted = extracted.every(
        (val, i) => i === 0 || val >= extracted[i - 1]
      );

      // 统计信息
      const stats = heap.getStats();
      const validation = heap.validate();

      console.log(`  插入时间: ${insertTime.toFixed(2)}ms`);
      console.log(`  减小键值时间: ${decreaseTime.toFixed(2)}ms (100次)`);
      console.log(
        `  提取时间: ${extractTime.toFixed(2)}ms (${extracted.length}次)`
      );
      console.log(`  最大度数: ${stats.maxDegree}`);
      console.log(`  根节点数: ${stats.rootCount}`);
      console.log(`  标记节点数: ${stats.markedNodes}`);
      console.log(`  验证结果: ${validation.isValid ? "✅" : "❌"}`);
      console.log(`  有序性: ${isSorted ? "✅" : "❌"}`);
      console.log();
    }
  }

  /**
   * 演示斐波那契堆操作
   */
  static demonstrate(): void {
    console.log("=== 斐波那契堆操作演示 ===\n");

    const heap = new FibonacciHeap<number>();
    const values = [10, 5, 15, 3, 20, 8, 25, 1, 12];
    const nodes: FibonacciNode<number>[] = [];

    console.log("--- 插入操作 ---");
    for (const value of values) {
      const node = heap.insert(value);
      nodes.push(node);
      console.log(`插入 ${value}`);
      console.log(`当前最小值: ${heap.minimum()}`);
      console.log(`根节点数: ${heap.getRoots().length}`);
    }

    heap.printHeap();

    console.log("\n--- 减小键值操作 ---");
    const nodeToDecrease = nodes[6]; // 值为25的节点
    console.log(`将节点值从 ${nodeToDecrease.value} 减小到 2`);
    heap.decreaseKey(nodeToDecrease, 2);
    console.log(`新的最小值: ${heap.minimum()}`);

    console.log("\n--- 提取最小值操作 ---");
    for (let i = 0; i < 3; i++) {
      const min = heap.extractMin();
      console.log(`提取最小值: ${min}`);
      console.log(`剩余大小: ${heap.getSize()}`);
      console.log(`根节点数: ${heap.getRoots().length}`);
    }

    console.log("\n--- 合并操作 ---");
    const heap2 = FibonacciHeapUtils.fromArray([2, 7, 18, 30]);
    console.log("堆1根节点数:", heap.getRoots().length);
    console.log("堆2根节点数:", heap2.getRoots().length);

    heap.union(heap2);
    console.log("合并后根节点数:", heap.getRoots().length);
    console.log("合并后大小:", heap.getSize());

    console.log("\n--- 验证 ---");
    const validation = heap.validate();
    console.log(`验证结果: ${validation.isValid ? "✅" : "❌"}`);
    if (!validation.isValid) {
      console.log("错误:", validation.errors);
    }

    console.log("\n--- 统计信息 ---");
    const stats = heap.getStats();
    console.log(`总大小: ${stats.size}`);
    console.log(`根节点数: ${stats.rootCount}`);
    console.log(`最大度数: ${stats.maxDegree}`);
    console.log(`标记节点数: ${stats.markedNodes}`);
    console.log(`最大深度: ${stats.maxDepth}`);

    console.log("\n--- 有序输出 ---");
    const sorted = heap.toArray();
    console.log(`排序结果: [${sorted.join(", ")}]`);
  }

  /**
   * 比较不同堆实现的性能
   */
  static compareHeapPerformance(): void {
    console.log("=== 堆性能比较 ===\n");

    const size = 5000;
    const values = Array.from({ length: size }, () =>
      Math.floor(Math.random() * size)
    );

    console.log("测试插入 + 减小键值 + 提取操作...\n");

    // 斐波那契堆测试
    console.log("斐波那契堆:");
    const fibStart = performance.now();
    const fibHeap = new FibonacciHeap<number>();
    const fibNodes: FibonacciNode<number>[] = [];

    // 插入
    for (const value of values) {
      fibNodes.push(fibHeap.insert(value));
    }

    // 减小键值
    for (let i = 0; i < 100; i++) {
      const randomIndex = Math.floor(Math.random() * fibNodes.length);
      const newValue = Math.floor(Math.random() * 100);
      fibHeap.decreaseKey(fibNodes[randomIndex], newValue);
    }

    // 提取
    for (let i = 0; i < 100; i++) {
      fibHeap.extractMin();
    }

    const fibTime = performance.now() - fibStart;
    console.log(`  总时间: ${fibTime.toFixed(2)}ms`);

    // JavaScript原生排序比较
    console.log("\n原生排序:");
    const nativeStart = performance.now();
    const sortedArray = [...values].sort((a, b) => a - b);
    const nativeTime = performance.now() - nativeStart;

    console.log(`  排序时间: ${nativeTime.toFixed(2)}ms`);

    console.log(`\n斐波那契堆相对性能: ${(fibTime / nativeTime).toFixed(2)}x`);
    console.log(
      "注意：斐波那契堆的优势在于支持高效的减小键值操作，这对图算法非常重要。"
    );
  }
}
