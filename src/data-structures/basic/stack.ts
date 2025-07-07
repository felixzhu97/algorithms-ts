/**
 * 栈的实现
 * 《算法导论》第10章 基本数据结构
 *
 * 栈是一种后进先出(LIFO)的数据结构
 * 支持两个基本操作：push(入栈)和pop(出栈)
 */
export class Stack<T> {
  private items: T[] = [];

  /**
   * 入栈操作
   * 时间复杂度: O(1)
   * @param item 要入栈的元素
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * 出栈操作
   * 时间复杂度: O(1)
   * @returns 栈顶元素，如果栈为空则返回undefined
   */
  pop(): T | undefined {
    if (this.isEmpty()) {
      throw new Error("Stack underflow");
    }
    return this.items.pop();
  }

  /**
   * 查看栈顶元素但不移除
   * 时间复杂度: O(1)
   * @returns 栈顶元素，如果栈为空则返回undefined
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * 检查栈是否为空
   * 时间复杂度: O(1)
   * @returns 栈是否为空
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 获取栈的大小
   * 时间复杂度: O(1)
   * @returns 栈中元素的数量
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空栈
   * 时间复杂度: O(1)
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 将栈转换为数组
   * 时间复杂度: O(n)
   * @returns 栈中所有元素的数组（栈底在前，栈顶在后）
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * 栈的字符串表示
   * @returns 栈的字符串表示
   */
  toString(): string {
    return `Stack(${this.items.join(", ")})`;
  }
}
