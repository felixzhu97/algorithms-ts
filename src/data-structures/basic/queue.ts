/**
 * 队列的实现
 * 《算法导论》第10章 基本数据结构
 *
 * 队列是一种先进先出(FIFO)的数据结构
 * 支持两个基本操作：enqueue(入队)和dequeue(出队)
 */
export class Queue<T> {
  private items: T[] = [];
  private head: number = 0;

  /**
   * 入队操作
   * 时间复杂度: O(1)
   * @param item 要入队的元素
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * 出队操作
   * 时间复杂度: O(1) 均摊时间复杂度
   * @returns 队首元素，如果队列为空则抛出异常
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error("Queue underflow");
    }

    const item = this.items[this.head];
    this.head++;

    // 当head超过数组长度的一半时，重新整理数组以节省空间
    if (this.head > this.items.length / 2) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  /**
   * 查看队首元素但不移除
   * 时间复杂度: O(1)
   * @returns 队首元素，如果队列为空则返回undefined
   */
  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.head];
  }

  /**
   * 查看队尾元素但不移除
   * 时间复杂度: O(1)
   * @returns 队尾元素，如果队列为空则返回undefined
   */
  rear(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * 检查队列是否为空
   * 时间复杂度: O(1)
   * @returns 队列是否为空
   */
  isEmpty(): boolean {
    return this.head >= this.items.length;
  }

  /**
   * 获取队列的大小
   * 时间复杂度: O(1)
   * @returns 队列中元素的数量
   */
  size(): number {
    return this.items.length - this.head;
  }

  /**
   * 清空队列
   * 时间复杂度: O(1)
   */
  clear(): void {
    this.items = [];
    this.head = 0;
  }

  /**
   * 将队列转换为数组
   * 时间复杂度: O(n)
   * @returns 队列中所有元素的数组（队首在前，队尾在后）
   */
  toArray(): T[] {
    return this.items.slice(this.head);
  }

  /**
   * 队列的字符串表示
   * @returns 队列的字符串表示
   */
  toString(): string {
    return `Queue(${this.toArray().join(", ")})`;
  }
}

/**
 * 双端队列的实现
 * 支持在两端进行插入和删除操作
 */
export class Deque<T> {
  private items: T[] = [];

  /**
   * 在前端添加元素
   * 时间复杂度: O(n) - 需要移动所有元素
   * @param item 要添加的元素
   */
  addFront(item: T): void {
    this.items.unshift(item);
  }

  /**
   * 在后端添加元素
   * 时间复杂度: O(1)
   * @param item 要添加的元素
   */
  addRear(item: T): void {
    this.items.push(item);
  }

  /**
   * 从前端移除元素
   * 时间复杂度: O(n) - 需要移动所有元素
   * @returns 前端元素
   */
  removeFront(): T {
    if (this.isEmpty()) {
      throw new Error("Deque is empty");
    }
    return this.items.shift()!;
  }

  /**
   * 从后端移除元素
   * 时间复杂度: O(1)
   * @returns 后端元素
   */
  removeRear(): T {
    if (this.isEmpty()) {
      throw new Error("Deque is empty");
    }
    return this.items.pop()!;
  }

  /**
   * 查看前端元素
   * 时间复杂度: O(1)
   * @returns 前端元素
   */
  peekFront(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0];
  }

  /**
   * 查看后端元素
   * 时间复杂度: O(1)
   * @returns 后端元素
   */
  peekRear(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.items.length - 1];
  }

  /**
   * 检查双端队列是否为空
   * 时间复杂度: O(1)
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 获取双端队列的大小
   * 时间复杂度: O(1)
   * @returns 元素数量
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空双端队列
   * 时间复杂度: O(1)
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 转换为数组
   * 时间复杂度: O(n)
   * @returns 所有元素的数组
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * 字符串表示
   * @returns 字符串表示
   */
  toString(): string {
    return `Deque(${this.items.join(", ")})`;
  }
}
