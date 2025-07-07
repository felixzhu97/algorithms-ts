/**
 * 链表节点
 */
export class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * 单向链表的实现
 * 《算法导论》第10章 基本数据结构
 *
 * 链表是一种递归的数据结构，它或者为空(null)，
 * 或者是指向一个节点(node)的引用，该节点含有一个泛型的元素和一个指向另一条链表的引用。
 */
export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private length: number = 0;

  /**
   * 在链表头部插入元素
   * 时间复杂度: O(1)
   * @param value 要插入的值
   */
  prepend(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
  }

  /**
   * 在链表尾部插入元素
   * 时间复杂度: O(n)
   * @param value 要插入的值
   */
  append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.length++;
  }

  /**
   * 在指定位置插入元素
   * 时间复杂度: O(n)
   * @param index 插入位置
   * @param value 要插入的值
   */
  insert(index: number, value: T): void {
    if (index < 0 || index > this.length) {
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      this.prepend(value);
      return;
    }

    const newNode = new ListNode(value);
    let current = this.head;

    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    newNode.next = current!.next;
    current!.next = newNode;
    this.length++;
  }

  /**
   * 删除指定值的第一个节点
   * 时间复杂度: O(n)
   * @param value 要删除的值
   * @returns 是否成功删除
   */
  remove(value: T): boolean {
    if (!this.head) {
      return false;
    }

    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return true;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      this.length--;
      return true;
    }

    return false;
  }

  /**
   * 删除指定位置的节点
   * 时间复杂度: O(n)
   * @param index 要删除的位置
   * @returns 被删除的值
   */
  removeAt(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      const value = this.head!.value;
      this.head = this.head!.next;
      this.length--;
      return value;
    }

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    const value = current!.next!.value;
    current!.next = current!.next!.next;
    this.length--;
    return value;
  }

  /**
   * 查找元素的位置
   * 时间复杂度: O(n)
   * @param value 要查找的值
   * @returns 元素的索引，如果未找到返回-1
   */
  indexOf(value: T): number {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * 检查是否包含某个值
   * 时间复杂度: O(n)
   * @param value 要检查的值
   * @returns 是否包含该值
   */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * 获取指定位置的值
   * 时间复杂度: O(n)
   * @param index 位置索引
   * @returns 该位置的值
   */
  get(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current!.value;
  }

  /**
   * 获取链表长度
   * 时间复杂度: O(1)
   * @returns 链表长度
   */
  size(): number {
    return this.length;
  }

  /**
   * 检查链表是否为空
   * 时间复杂度: O(1)
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * 清空链表
   * 时间复杂度: O(1)
   */
  clear(): void {
    this.head = null;
    this.length = 0;
  }

  /**
   * 反转链表
   * 时间复杂度: O(n)
   * 空间复杂度: O(1)
   */
  reverse(): void {
    let prev: ListNode<T> | null = null;
    let current = this.head;
    let next: ListNode<T> | null = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
  }

  /**
   * 转换为数组
   * 时间复杂度: O(n)
   * @returns 包含所有元素的数组
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * 字符串表示
   * @returns 链表的字符串表示
   */
  toString(): string {
    return `LinkedList(${this.toArray().join(" -> ")})`;
  }

  /**
   * 迭代器支持
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

/**
 * 双向链表节点
 */
export class DoublyListNode<T> {
  value: T;
  next: DoublyListNode<T> | null = null;
  prev: DoublyListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * 双向链表的实现
 * 每个节点都有指向前一个和后一个节点的指针
 */
export class DoublyLinkedList<T> {
  private head: DoublyListNode<T> | null = null;
  private tail: DoublyListNode<T> | null = null;
  private length: number = 0;

  /**
   * 在链表头部插入元素
   * 时间复杂度: O(1)
   * @param value 要插入的值
   */
  prepend(value: T): void {
    const newNode = new DoublyListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.length++;
  }

  /**
   * 在链表尾部插入元素
   * 时间复杂度: O(1)
   * @param value 要插入的值
   */
  append(value: T): void {
    const newNode = new DoublyListNode(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  /**
   * 删除指定值的节点
   * 时间复杂度: O(n)
   * @param value 要删除的值
   * @returns 是否成功删除
   */
  remove(value: T): boolean {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        this.removeNode(current);
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * 删除指定节点
   * 时间复杂度: O(1)
   * @param node 要删除的节点
   */
  private removeNode(node: DoublyListNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    this.length--;
  }

  /**
   * 获取链表长度
   * 时间复杂度: O(1)
   * @returns 链表长度
   */
  size(): number {
    return this.length;
  }

  /**
   * 检查链表是否为空
   * 时间复杂度: O(1)
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * 清空链表
   * 时间复杂度: O(1)
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * 转换为数组
   * 时间复杂度: O(n)
   * @returns 包含所有元素的数组
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * 字符串表示
   * @returns 链表的字符串表示
   */
  toString(): string {
    return `DoublyLinkedList(${this.toArray().join(" <-> ")})`;
  }

  /**
   * 迭代器支持
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
