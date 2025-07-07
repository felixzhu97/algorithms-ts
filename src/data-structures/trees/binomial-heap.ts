/**
 * 二项堆数据结构实现
 * 《算法导论》第19章 二项堆
 *
 * 二项堆是一种堆的实现，支持高效的合并操作。
 * 二项堆的特点：
 * 1. 由二项树的集合组成
 * 2. 对于任意大小n的堆，有唯一的二项树表示
 * 3. 支持O(log n)的插入、删除最小值、减小键值操作
 * 4. 支持O(log n)的合并操作
 * 5. 创建堆的时间复杂度为O(1)
 */

import { CompareFn, defaultCompare } from "../../types";

/**
 * 二项树节点
 */
export class BinomialNode<T> {
  public value: T;
  public degree: number = 0; // 度数（子节点数量）
  public parent: BinomialNode<T> | null = null;
  public child: BinomialNode<T> | null = null; // 最左子节点
  public sibling: BinomialNode<T> | null = null; // 右兄弟节点

  constructor(value: T) {
    this.value = value;
  }

  /**
   * 获取所有子节点
   */
  getChildren(): BinomialNode<T>[] {
    const children: BinomialNode<T>[] = [];
    let current = this.child;
    while (current !== null) {
      children.push(current);
      current = current.sibling;
    }
    return children;
  }

  /**
   * 添加子节点
   */
  addChild(child: BinomialNode<T>): void {
    child.parent = this;
    child.sibling = this.child;
    this.child = child;
    this.degree++;
  }

  /**
   * 检查是否为二项树根
   */
  isRoot(): boolean {
    return this.parent === null;
  }

  /**
   * 获取树的大小
   */
  getSize(): number {
    return Math.pow(2, this.degree);
  }
}

/**
 * 二项堆类
 */
export class BinomialHeap<T> {
  private head: BinomialNode<T> | null = null; // 根列表的头节点
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
    return this.head === null;
  }

  /**
   * 获取最小值（不删除）
   * 时间复杂度: O(log n)
   */
  minimum(): T | null {
    if (this.head === null) {
      return null;
    }

    let minNode = this.head;
    let current = this.head.sibling;

    while (current !== null) {
      if (this.compare(current.value, minNode.value) < 0) {
        minNode = current;
      }
      current = current.sibling;
    }

    return minNode.value;
  }

  /**
   * 插入新元素
   * 时间复杂度: O(log n)
   */
  insert(value: T): BinomialNode<T> {
    const newNode = new BinomialNode(value);
    const newHeap = new BinomialHeap<T>(this.compare);
    newHeap.head = newNode;
    newHeap.size = 1;

    this.union(newHeap);
    this.size++;

    return newNode;
  }

  /**
   * 提取最小值
   * 时间复杂度: O(log n)
   */
  extractMin(): T | null {
    if (this.head === null) {
      return null;
    }

    // 找到最小值节点
    let minNode = this.head;
    let minPrev: BinomialNode<T> | null = null;
    let prev: BinomialNode<T> | null = null;
    let current: BinomialNode<T> | null = this.head;

    while (current !== null) {
      if (this.compare(current.value, minNode.value) < 0) {
        minNode = current;
        minPrev = prev;
      }
      prev = current;
      current = current.sibling;
    }

    // 从根列表中移除最小节点
    if (minPrev === null) {
      this.head = minNode.sibling;
    } else {
      minPrev.sibling = minNode.sibling;
    }

    // 创建新堆，包含最小节点的子树
    const newHeap = new BinomialHeap<T>(this.compare);
    if (minNode.child !== null) {
      // 反转子节点列表（因为子节点按度数递减排列）
      newHeap.head = this.reverseNodeList(minNode.child);

      // 清除父指针
      let child: BinomialNode<T> | null = newHeap.head;
      while (child !== null) {
        child.parent = null;
        child = child.sibling;
      }
    }

    // 合并两个堆
    this.union(newHeap);
    this.size--;

    return minNode.value;
  }

  /**
   * 减小键值
   * 时间复杂度: O(log n)
   */
  decreaseKey(node: BinomialNode<T>, newValue: T): boolean {
    if (this.compare(newValue, node.value) > 0) {
      return false; // 新值不能大于原值
    }

    node.value = newValue;

    // 向上调整堆性质
    let current = node;
    let parent = current.parent;

    while (parent !== null && this.compare(current.value, parent.value) < 0) {
      // 交换值
      [current.value, parent.value] = [parent.value, current.value];
      current = parent;
      parent = current.parent;
    }

    return true;
  }

  /**
   * 删除节点
   * 时间复杂度: O(log n)
   */
  delete(node: BinomialNode<T>): boolean {
    // 创建一个比所有值都小的虚拟最小值
    const minValue = {} as T;
    const originalCompare = this.compare;

    // 临时修改比较函数，使虚拟值最小
    this.compare = (a: T, b: T) => {
      if (a === minValue) return -1;
      if (b === minValue) return 1;
      return originalCompare(a, b);
    };

    // 将节点值设为虚拟最小值
    const originalValue = node.value;
    node.value = minValue;

    // 向上调整到根
    let current = node;
    let parent = current.parent;

    while (parent !== null) {
      [current.value, parent.value] = [parent.value, current.value];
      current = parent;
      parent = current.parent;
    }

    // 恢复比较函数
    this.compare = originalCompare;

    // 提取最小值（即目标节点）
    const extracted = this.extractMin();

    return extracted === minValue;
  }

  /**
   * 合并两个二项堆
   * 时间复杂度: O(log n)
   */
  union(other: BinomialHeap<T>): void {
    if (other.head === null) {
      return;
    }

    if (this.head === null) {
      this.head = other.head;
      this.size = other.size;
      return;
    }

    // 合并根列表
    this.head = this.mergeRootLists(this.head, other.head);
    this.size += other.size;

    // 调整堆以满足二项堆性质
    if (this.head === null) {
      return;
    }

    let prev: BinomialNode<T> | null = null;
    let current: BinomialNode<T> | null = this.head;
    let next = current.sibling;

    while (next !== null) {
      // 情况1: 当前和下一个度数不同，或者存在三个连续相同度数
      if (
        current.degree !== next.degree ||
        (next.sibling !== null && next.sibling.degree === current.degree)
      ) {
        prev = current;
        current = next;
      }
      // 情况2: 当前值小于等于下一个值
      else if (this.compare(current.value, next.value) <= 0) {
        current.sibling = next.sibling;
        this.linkNodes(current, next);
      }
      // 情况3: 当前值大于下一个值
      else {
        if (prev === null) {
          this.head = next;
        } else {
          prev.sibling = next;
        }
        this.linkNodes(next, current);
        current = next;
      }

      next = current.sibling;
    }
  }

  /**
   * 合并两个根列表
   */
  private mergeRootLists(
    list1: BinomialNode<T> | null,
    list2: BinomialNode<T> | null
  ): BinomialNode<T> | null {
    if (list1 === null) return list2;
    if (list2 === null) return list1;

    let head: BinomialNode<T>;

    if (list1.degree <= list2.degree) {
      head = list1;
      list1 = list1.sibling;
    } else {
      head = list2;
      list2 = list2.sibling;
    }

    let current = head;

    while (list1 !== null && list2 !== null) {
      if (list1.degree <= list2.degree) {
        current.sibling = list1;
        list1 = list1.sibling;
      } else {
        current.sibling = list2;
        list2 = list2.sibling;
      }
      current = current.sibling;
    }

    current.sibling = list1 !== null ? list1 : list2;

    return head;
  }

  /**
   * 链接两个相同度数的二项树
   */
  private linkNodes(parent: BinomialNode<T>, child: BinomialNode<T>): void {
    child.parent = parent;
    child.sibling = parent.child;
    parent.child = child;
    parent.degree++;
  }

  /**
   * 反转节点列表
   */
  private reverseNodeList(head: BinomialNode<T>): BinomialNode<T> {
    let prev: BinomialNode<T> | null = null;
    let current: BinomialNode<T> | null = head;

    while (current !== null) {
      const next: BinomialNode<T> | null = current.sibling;
      current.sibling = prev;
      prev = current;
      current = next;
    }

    return prev!;
  }

  /**
   * 获取所有根节点
   */
  getRoots(): BinomialNode<T>[] {
    const roots: BinomialNode<T>[] = [];
    let current = this.head;

    while (current !== null) {
      roots.push(current);
      current = current.sibling;
    }

    return roots;
  }

  /**
   * 获取堆的度数列表
   */
  getDegrees(): number[] {
    return this.getRoots().map((root) => root.degree);
  }

  /**
   * 验证二项堆的性质
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.head === null) {
      return { isValid: true, errors: [] };
    }

    // 验证根列表按度数非递减排序
    let current: BinomialNode<T> | null = this.head;
    let prevDegree = -1;
    const degrees: number[] = [];

    while (current !== null) {
      if (current.degree <= prevDegree) {
        errors.push(
          `根列表度数未按非递减顺序排列: ${prevDegree} -> ${current.degree}`
        );
      }

      degrees.push(current.degree);
      prevDegree = current.degree;

      // 验证每个二项树
      this.validateBinomialTree(current, errors);

      current = current.sibling;
    }

    // 验证不能有两个相同度数的根
    const uniqueDegrees = new Set(degrees);
    if (uniqueDegrees.size !== degrees.length) {
      errors.push("存在相同度数的根节点");
    }

    // 验证大小计算
    const calculatedSize = degrees.reduce(
      (sum, degree) => sum + Math.pow(2, degree),
      0
    );
    if (calculatedSize !== this.size) {
      errors.push(`大小不匹配: 计算值${calculatedSize}, 存储值${this.size}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 验证单个二项树
   */
  private validateBinomialTree(root: BinomialNode<T>, errors: string[]): void {
    // 验证度数与子节点数量匹配
    const children = root.getChildren();
    if (children.length !== root.degree) {
      errors.push(`节点度数${root.degree}与子节点数量${children.length}不匹配`);
    }

    // 验证堆性质
    for (const child of children) {
      if (this.compare(child.value, root.value) < 0) {
        errors.push(`堆性质违反: 子节点${child.value}小于父节点${root.value}`);
      }

      if (child.parent !== root) {
        errors.push("父指针不正确");
      }

      // 递归验证子树
      this.validateBinomialTree(child, errors);
    }

    // 验证子节点度数按递减排序
    for (let i = 1; i < children.length; i++) {
      if (children[i].degree >= children[i - 1].degree) {
        errors.push("子节点度数未按递减顺序排列");
      }
    }

    // 验证二项树的度数性质
    if (root.degree > 0) {
      const expectedDegrees = Array.from(
        { length: root.degree },
        (_, i) => root.degree - 1 - i
      );
      const actualDegrees = children.map((child) => child.degree);

      if (!this.arraysEqual(expectedDegrees, actualDegrees)) {
        errors.push(
          `二项树度数结构不正确: 期望${expectedDegrees}, 实际${actualDegrees}`
        );
      }
    }
  }

  /**
   * 比较两个数组是否相等
   */
  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * 获取堆的统计信息
   */
  getStats(): {
    size: number;
    treeCount: number;
    maxDegree: number;
    degrees: number[];
    height: number;
  } {
    const roots = this.getRoots();
    const degrees = roots.map((root) => root.degree);

    return {
      size: this.size,
      treeCount: roots.length,
      maxDegree: degrees.length > 0 ? Math.max(...degrees) : 0,
      degrees,
      height: degrees.length > 0 ? Math.max(...degrees) + 1 : 0,
    };
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
  clone(): BinomialHeap<T> {
    const newHeap = new BinomialHeap<T>(this.compare);
    newHeap.head = this.cloneNodeList(this.head);
    newHeap.size = this.size;
    return newHeap;
  }

  /**
   * 克隆节点列表
   */
  private cloneNodeList(head: BinomialNode<T> | null): BinomialNode<T> | null {
    if (head === null) return null;

    const newHead = this.cloneNode(head);
    let current = newHead;
    let original = head.sibling;

    while (original !== null) {
      current.sibling = this.cloneNode(original);
      current = current.sibling;
      original = original.sibling;
    }

    return newHead;
  }

  /**
   * 克隆单个节点及其子树
   */
  private cloneNode(node: BinomialNode<T>): BinomialNode<T> {
    const newNode = new BinomialNode(node.value);
    newNode.degree = node.degree;

    if (node.child !== null) {
      newNode.child = this.cloneNodeWithSiblings(node.child);

      // 设置父指针
      let child: BinomialNode<T> | null = newNode.child;
      while (child !== null) {
        child.parent = newNode;
        child = child.sibling;
      }
    }

    return newNode;
  }

  /**
   * 克隆节点及其兄弟节点
   */
  private cloneNodeWithSiblings(head: BinomialNode<T>): BinomialNode<T> {
    const newHead = this.cloneNode(head);
    let current = newHead;
    let original = head.sibling;

    while (original !== null) {
      current.sibling = this.cloneNode(original);
      current = current.sibling;
      original = original.sibling;
    }

    return newHead;
  }

  /**
   * 打印堆结构（用于调试）
   */
  printHeap(): void {
    if (this.head === null) {
      console.log("空堆");
      return;
    }

    console.log("=== 二项堆结构 ===");
    console.log(`大小: ${this.size}`);
    console.log(`度数列表: [${this.getDegrees().join(", ")}]`);

    let current: BinomialNode<T> | null = this.head;
    let treeIndex = 0;

    while (current !== null) {
      console.log(`\n二项树 B${current.degree} (索引 ${treeIndex}):`);
      this.printTree(current, 0);
      current = current.sibling;
      treeIndex++;
    }
  }

  /**
   * 打印二项树
   */
  private printTree(node: BinomialNode<T>, level: number): void {
    const indent = "  ".repeat(level);
    console.log(`${indent}${node.value} (度数: ${node.degree})`);

    let child: BinomialNode<T> | null = node.child;
    while (child !== null) {
      this.printTree(child, level + 1);
      child = child.sibling;
    }
  }
}

/**
 * 二项堆工具类
 */
export class BinomialHeapUtils {
  /**
   * 从数组创建二项堆
   */
  static fromArray<T>(
    array: T[],
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): BinomialHeap<T> {
    const heap = new BinomialHeap(compareFn);
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
    const heap = BinomialHeapUtils.fromArray(array, compareFn);
    return heap.toArray();
  }

  /**
   * 合并多个数组为有序数组
   */
  static mergeArrays<T>(
    arrays: T[][],
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
  ): T[] {
    const heap = new BinomialHeap(compareFn);

    // 将所有元素插入堆
    for (const array of arrays) {
      for (const item of array) {
        heap.insert(item);
      }
    }

    return heap.toArray();
  }

  /**
   * 性能测试
   */
  static performanceTest(): void {
    console.log("=== 二项堆性能测试 ===\n");

    const sizes = [1000, 5000, 10000];

    for (const size of sizes) {
      console.log(`--- 大小: ${size} ---`);

      const values = Array.from({ length: size }, () =>
        Math.floor(Math.random() * size)
      );

      // 插入测试
      const heap = new BinomialHeap<number>();
      const insertStart = performance.now();
      for (const value of values) {
        heap.insert(value);
      }
      const insertTime = performance.now() - insertStart;

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
      console.log(
        `  提取时间: ${extractTime.toFixed(2)}ms (${extracted.length}次)`
      );
      console.log(`  最大度数: ${stats.maxDegree}`);
      console.log(`  树数量: ${stats.treeCount}`);
      console.log(`  验证结果: ${validation.isValid ? "✅" : "❌"}`);
      console.log(`  有序性: ${isSorted ? "✅" : "❌"}`);
      console.log();
    }
  }

  /**
   * 演示二项堆操作
   */
  static demonstrate(): void {
    console.log("=== 二项堆操作演示 ===\n");

    const heap = new BinomialHeap<number>();
    const values = [10, 5, 15, 3, 20, 8, 25, 1, 12];

    console.log("--- 插入操作 ---");
    for (const value of values) {
      console.log(`插入 ${value}`);
      heap.insert(value);
      console.log(`当前最小值: ${heap.minimum()}`);
      console.log(`度数列表: [${heap.getDegrees().join(", ")}]`);
    }

    heap.printHeap();

    console.log("\n--- 提取最小值操作 ---");
    for (let i = 0; i < 3; i++) {
      const min = heap.extractMin();
      console.log(`提取最小值: ${min}`);
      console.log(`剩余大小: ${heap.getSize()}`);
      console.log(`度数列表: [${heap.getDegrees().join(", ")}]`);
    }

    console.log("\n--- 合并操作 ---");
    const heap2 = BinomialHeapUtils.fromArray([2, 7, 18, 30]);
    console.log("堆1度数列表:", heap.getDegrees());
    console.log("堆2度数列表:", heap2.getDegrees());

    heap.union(heap2);
    console.log("合并后度数列表:", heap.getDegrees());
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
    console.log(`树数量: ${stats.treeCount}`);
    console.log(`最大度数: ${stats.maxDegree}`);
    console.log(`树高度: ${stats.height}`);

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

    // 二项堆测试
    console.log("二项堆:");
    const binomialStart = performance.now();
    const binomialHeap = BinomialHeapUtils.fromArray(values);
    const binomialBuildTime = performance.now() - binomialStart;

    const binomialExtractStart = performance.now();
    for (let i = 0; i < 100; i++) {
      binomialHeap.extractMin();
    }
    const binomialExtractTime = performance.now() - binomialExtractStart;

    console.log(`  构建时间: ${binomialBuildTime.toFixed(2)}ms`);
    console.log(`  提取时间: ${binomialExtractTime.toFixed(2)}ms`);

    // JavaScript原生数组排序比较
    console.log("\n原生排序:");
    const nativeStart = performance.now();
    const sortedArray = [...values].sort((a, b) => a - b);
    const nativeTime = performance.now() - nativeStart;

    console.log(`  排序时间: ${nativeTime.toFixed(2)}ms`);

    console.log(
      `\n二项堆相对性能: ${(
        (binomialBuildTime + binomialExtractTime) /
        nativeTime
      ).toFixed(2)}x`
    );
  }
}
