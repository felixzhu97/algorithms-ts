import { CompareFn, defaultCompare } from "../../types";

/**
 * 堆数据结构实现
 * 《算法导论》第6章 堆排序
 *
 * 堆是一种完全二叉树，分为最大堆和最小堆：
 * - 最大堆：父节点的值总是大于或等于其子节点的值
 * - 最小堆：父节点的值总是小于或等于其子节点的值
 *
 * 堆通常用数组来表示，对于索引为i的节点：
 * - 父节点索引：Math.floor((i-1)/2)
 * - 左子节点索引：2*i + 1
 * - 右子节点索引：2*i + 2
 */
export class Heap<T> {
  private items: T[] = [];
  private compare: CompareFn<T>;
  private isMaxHeap: boolean;

  /**
   * 构造函数
   * @param compareFn 比较函数
   * @param isMaxHeap 是否为最大堆，默认为true
   */
  constructor(
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>,
    isMaxHeap: boolean = true
  ) {
    this.compare = compareFn;
    this.isMaxHeap = isMaxHeap;
  }

  /**
   * 获取父节点索引
   * @param index 子节点索引
   * @returns 父节点索引
   */
  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  /**
   * 获取左子节点索引
   * @param index 父节点索引
   * @returns 左子节点索引
   */
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  /**
   * 获取右子节点索引
   * @param index 父节点索引
   * @returns 右子节点索引
   */
  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  /**
   * 检查是否有父节点
   * @param index 节点索引
   * @returns 是否有父节点
   */
  private hasParent(index: number): boolean {
    return this.getParentIndex(index) >= 0;
  }

  /**
   * 检查是否有左子节点
   * @param index 节点索引
   * @returns 是否有左子节点
   */
  private hasLeftChild(index: number): boolean {
    return this.getLeftChildIndex(index) < this.items.length;
  }

  /**
   * 检查是否有右子节点
   * @param index 节点索引
   * @returns 是否有右子节点
   */
  private hasRightChild(index: number): boolean {
    return this.getRightChildIndex(index) < this.items.length;
  }

  /**
   * 获取父节点值
   * @param index 子节点索引
   * @returns 父节点值
   */
  private parent(index: number): T {
    return this.items[this.getParentIndex(index)];
  }

  /**
   * 获取左子节点值
   * @param index 父节点索引
   * @returns 左子节点值
   */
  private leftChild(index: number): T {
    return this.items[this.getLeftChildIndex(index)];
  }

  /**
   * 获取右子节点值
   * @param index 父节点索引
   * @returns 右子节点值
   */
  private rightChild(index: number): T {
    return this.items[this.getRightChildIndex(index)];
  }

  /**
   * 交换两个元素
   * @param index1 第一个元素索引
   * @param index2 第二个元素索引
   */
  private swap(index1: number, index2: number): void {
    [this.items[index1], this.items[index2]] = [
      this.items[index2],
      this.items[index1],
    ];
  }

  /**
   * 比较两个元素
   * @param a 第一个元素
   * @param b 第二个元素
   * @returns 比较结果，考虑是否为最大堆
   */
  private shouldSwap(a: T, b: T): boolean {
    const cmp = this.compare(a, b);
    return this.isMaxHeap ? cmp > 0 : cmp < 0;
  }

  /**
   * 向上堆化（用于插入操作）
   * 时间复杂度：O(log n)
   * @param index 起始索引
   */
  private heapifyUp(index: number = this.items.length - 1): void {
    while (
      this.hasParent(index) &&
      this.shouldSwap(this.items[index], this.parent(index))
    ) {
      const parentIndex = this.getParentIndex(index);
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /**
   * 向下堆化（用于删除操作）
   * 时间复杂度：O(log n)
   * @param index 起始索引
   */
  private heapifyDown(index: number = 0): void {
    while (this.hasLeftChild(index)) {
      let targetIndex = this.getLeftChildIndex(index);

      // 找到应该交换的子节点（最大堆找最大子节点，最小堆找最小子节点）
      if (
        this.hasRightChild(index) &&
        this.shouldSwap(this.rightChild(index), this.leftChild(index))
      ) {
        targetIndex = this.getRightChildIndex(index);
      }

      // 如果当前节点已经满足堆性质，停止
      if (!this.shouldSwap(this.items[targetIndex], this.items[index])) {
        break;
      }

      this.swap(index, targetIndex);
      index = targetIndex;
    }
  }

  /**
   * 插入元素
   * 时间复杂度：O(log n)
   * @param item 要插入的元素
   */
  insert(item: T): void {
    this.items.push(item);
    this.heapifyUp();
  }

  /**
   * 删除并返回堆顶元素
   * 时间复杂度：O(log n)
   * @returns 堆顶元素
   */
  extract(): T {
    if (this.isEmpty()) {
      throw new Error("Heap is empty");
    }

    if (this.items.length === 1) {
      return this.items.pop()!;
    }

    const top = this.items[0];
    this.items[0] = this.items.pop()!;
    this.heapifyDown();
    return top;
  }

  /**
   * 查看堆顶元素但不删除
   * 时间复杂度：O(1)
   * @returns 堆顶元素
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[0];
  }

  /**
   * 检查堆是否为空
   * 时间复杂度：O(1)
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 获取堆的大小
   * 时间复杂度：O(1)
   * @returns 堆的大小
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空堆
   * 时间复杂度：O(1)
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 从数组构建堆
   * 时间复杂度：O(n)
   * @param array 输入数组
   */
  buildHeap(array: T[]): void {
    this.items = [...array];

    // 从最后一个非叶子节点开始向下堆化
    const lastParentIndex = Math.floor((this.items.length - 2) / 2);
    for (let i = lastParentIndex; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  /**
   * 将堆转换为数组
   * 时间复杂度：O(n)
   * @returns 堆的数组表示
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * 验证堆的有效性
   * @returns 是否为有效堆
   */
  isValidHeap(): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this.hasLeftChild(i)) {
        if (this.shouldSwap(this.leftChild(i), this.items[i])) {
          return false;
        }
      }
      if (this.hasRightChild(i)) {
        if (this.shouldSwap(this.rightChild(i), this.items[i])) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 获取堆的字符串表示
   * @returns 堆的字符串表示
   */
  toString(): string {
    const type = this.isMaxHeap ? "MaxHeap" : "MinHeap";
    return `${type}([${this.items.join(", ")}])`;
  }
}

/**
 * 最大堆类
 */
export class MaxHeap<T> extends Heap<T> {
  constructor(compareFn: CompareFn<T> = defaultCompare as CompareFn<T>) {
    super(compareFn, true);
  }
}

/**
 * 最小堆类
 */
export class MinHeap<T> extends Heap<T> {
  constructor(compareFn: CompareFn<T> = defaultCompare as CompareFn<T>) {
    super(compareFn, false);
  }
}

/**
 * 优先队列（基于堆实现）
 */
export class PriorityQueue<T> {
  private heap: Heap<T>;

  constructor(
    compareFn: CompareFn<T> = defaultCompare as CompareFn<T>,
    isMaxPriority: boolean = true
  ) {
    this.heap = new Heap(compareFn, isMaxPriority);
  }

  /**
   * 入队
   * @param item 要入队的元素
   */
  enqueue(item: T): void {
    this.heap.insert(item);
  }

  /**
   * 出队
   * @returns 优先级最高的元素
   */
  dequeue(): T {
    return this.heap.extract();
  }

  /**
   * 查看队首元素
   * @returns 优先级最高的元素
   */
  front(): T | undefined {
    return this.heap.peek();
  }

  /**
   * 检查队列是否为空
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  /**
   * 获取队列大小
   * @returns 队列大小
   */
  size(): number {
    return this.heap.size();
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.heap.clear();
  }

  /**
   * 转换为数组
   * @returns 数组表示
   */
  toArray(): T[] {
    return this.heap.toArray();
  }

  /**
   * 字符串表示
   * @returns 字符串表示
   */
  toString(): string {
    return `PriorityQueue(${this.heap.toString()})`;
  }
}
