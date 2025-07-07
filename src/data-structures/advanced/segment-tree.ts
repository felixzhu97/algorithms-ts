/**
 * 线段树 (Segment Tree) 实现
 * 支持区间查询和区间更新操作，时间复杂度 O(log n)
 */

/**
 * 线段树节点
 */
class SegmentTreeNode {
  public left: SegmentTreeNode | null = null;
  public right: SegmentTreeNode | null = null;
  public value: number = 0;
  public lazy: number = 0; // 懒惰标记，用于区间更新

  constructor(public start: number, public end: number, value: number = 0) {
    this.value = value;
  }
}

/**
 * 线段树类
 * 支持区间和查询、区间最大值/最小值查询、区间更新等操作
 */
export class SegmentTree {
  private root: SegmentTreeNode | null = null;
  private operation: "sum" | "max" | "min";
  private defaultValue: number;

  /**
   * 构造函数
   * @param arr 初始数组
   * @param operation 支持的操作类型 ('sum', 'max', 'min')
   */
  constructor(arr: number[], operation: "sum" | "max" | "min" = "sum") {
    this.operation = operation;
    this.defaultValue =
      operation === "sum" ? 0 : operation === "max" ? -Infinity : Infinity;
    this.root = this.build(arr, 0, arr.length - 1);
  }

  /**
   * 构建线段树
   * @param arr 数组
   * @param start 起始索引
   * @param end 结束索引
   * @returns 线段树节点
   */
  private build(arr: number[], start: number, end: number): SegmentTreeNode {
    const node = new SegmentTreeNode(start, end);

    if (start === end) {
      node.value = arr[start];
      return node;
    }

    const mid = Math.floor((start + end) / 2);
    node.left = this.build(arr, start, mid);
    node.right = this.build(arr, mid + 1, end);

    node.value = this.combine(node.left.value, node.right.value);
    return node;
  }

  /**
   * 合并两个值
   * @param leftValue 左子树值
   * @param rightValue 右子树值
   * @returns 合并后的值
   */
  private combine(leftValue: number, rightValue: number): number {
    switch (this.operation) {
      case "sum":
        return leftValue + rightValue;
      case "max":
        return Math.max(leftValue, rightValue);
      case "min":
        return Math.min(leftValue, rightValue);
      default:
        return leftValue + rightValue;
    }
  }

  /**
   * 推送懒惰标记
   * @param node 当前节点
   */
  private pushDown(node: SegmentTreeNode): void {
    if (node.lazy !== 0 && node.left && node.right) {
      // 更新子节点的值
      if (this.operation === "sum") {
        node.left.value += node.lazy * (node.left.end - node.left.start + 1);
        node.right.value += node.lazy * (node.right.end - node.right.start + 1);
      } else {
        node.left.value += node.lazy;
        node.right.value += node.lazy;
      }

      // 传播懒惰标记
      node.left.lazy += node.lazy;
      node.right.lazy += node.lazy;

      // 清除当前节点的懒惰标记
      node.lazy = 0;
    }
  }

  /**
   * 单点更新
   * @param index 更新位置
   * @param value 新值
   */
  public update(index: number, value: number): void {
    this.updatePoint(this.root!, index, value);
  }

  /**
   * 单点更新的递归实现
   * @param node 当前节点
   * @param index 更新位置
   * @param value 新值
   */
  private updatePoint(
    node: SegmentTreeNode,
    index: number,
    value: number
  ): void {
    if (node.start === node.end) {
      node.value = value;
      return;
    }

    this.pushDown(node);

    const mid = Math.floor((node.start + node.end) / 2);
    if (index <= mid) {
      this.updatePoint(node.left!, index, value);
    } else {
      this.updatePoint(node.right!, index, value);
    }

    node.value = this.combine(node.left!.value, node.right!.value);
  }

  /**
   * 区间更新
   * @param left 左边界
   * @param right 右边界
   * @param delta 增量值
   */
  public updateRange(left: number, right: number, delta: number): void {
    this.updateRangeHelper(this.root!, left, right, delta);
  }

  /**
   * 区间更新的递归实现
   * @param node 当前节点
   * @param left 左边界
   * @param right 右边界
   * @param delta 增量值
   */
  private updateRangeHelper(
    node: SegmentTreeNode,
    left: number,
    right: number,
    delta: number
  ): void {
    // 如果当前区间完全在更新区间内
    if (left <= node.start && node.end <= right) {
      if (this.operation === "sum") {
        node.value += delta * (node.end - node.start + 1);
      } else {
        node.value += delta;
      }
      node.lazy += delta;
      return;
    }

    // 如果当前区间与更新区间没有交集
    if (right < node.start || left > node.end) {
      return;
    }

    // 部分重叠，继续递归
    this.pushDown(node);

    const mid = Math.floor((node.start + node.end) / 2);
    if (left <= mid) {
      this.updateRangeHelper(node.left!, left, right, delta);
    }
    if (right > mid) {
      this.updateRangeHelper(node.right!, left, right, delta);
    }

    node.value = this.combine(node.left!.value, node.right!.value);
  }

  /**
   * 区间查询
   * @param left 左边界
   * @param right 右边界
   * @returns 查询结果
   */
  public query(left: number, right: number): number {
    return this.queryRange(this.root!, left, right);
  }

  /**
   * 区间查询的递归实现
   * @param node 当前节点
   * @param left 左边界
   * @param right 右边界
   * @returns 查询结果
   */
  private queryRange(
    node: SegmentTreeNode,
    left: number,
    right: number
  ): number {
    // 如果当前区间完全在查询区间内
    if (left <= node.start && node.end <= right) {
      return node.value;
    }

    // 如果当前区间与查询区间没有交集
    if (right < node.start || left > node.end) {
      return this.defaultValue;
    }

    // 部分重叠，继续递归
    this.pushDown(node);

    const mid = Math.floor((node.start + node.end) / 2);
    let leftResult = this.defaultValue;
    let rightResult = this.defaultValue;

    if (left <= mid) {
      leftResult = this.queryRange(node.left!, left, right);
    }
    if (right > mid) {
      rightResult = this.queryRange(node.right!, left, right);
    }

    return this.combine(leftResult, rightResult);
  }

  /**
   * 获取指定位置的值
   * @param index 位置索引
   * @returns 该位置的值
   */
  public get(index: number): number {
    return this.query(index, index);
  }

  /**
   * 获取树的高度
   * @returns 树的高度
   */
  public getHeight(): number {
    return this.calculateHeight(this.root!);
  }

  /**
   * 计算树的高度
   * @param node 当前节点
   * @returns 高度
   */
  private calculateHeight(node: SegmentTreeNode): number {
    if (!node.left && !node.right) {
      return 1;
    }

    let leftHeight = 0;
    let rightHeight = 0;

    if (node.left) {
      leftHeight = this.calculateHeight(node.left);
    }
    if (node.right) {
      rightHeight = this.calculateHeight(node.right);
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  /**
   * 获取树的节点数量
   * @returns 节点数量
   */
  public getNodeCount(): number {
    return this.countNodes(this.root!);
  }

  /**
   * 计算节点数量
   * @param node 当前节点
   * @returns 节点数量
   */
  private countNodes(node: SegmentTreeNode): number {
    if (!node) return 0;
    return 1 + this.countNodes(node.left!) + this.countNodes(node.right!);
  }

  /**
   * 打印线段树结构（用于调试）
   * @returns 树的字符串表示
   */
  public toString(): string {
    const result: string[] = [];
    this.printTree(this.root!, 0, result);
    return result.join("\n");
  }

  /**
   * 递归打印树结构
   * @param node 当前节点
   * @param depth 深度
   * @param result 结果数组
   */
  private printTree(
    node: SegmentTreeNode,
    depth: number,
    result: string[]
  ): void {
    if (!node) return;

    const indent = "  ".repeat(depth);
    result.push(
      `${indent}[${node.start},${node.end}] = ${node.value}${
        node.lazy !== 0 ? ` (lazy: ${node.lazy})` : ""
      }`
    );

    if (node.left) {
      this.printTree(node.left, depth + 1, result);
    }
    if (node.right) {
      this.printTree(node.right, depth + 1, result);
    }
  }
}

/**
 * 线段树工具类
 * 提供演示、测试和性能评估功能
 */
export class SegmentTreeUtils {
  /**
   * 演示线段树的基本操作
   */
  static demonstrateBasicOperations(): void {
    console.log("=== 线段树基本操作演示 ===");

    const arr = [1, 3, 5, 7, 9, 11];
    console.log("初始数组:", arr);

    // 创建求和线段树
    const sumTree = new SegmentTree(arr, "sum");
    console.log("\n创建求和线段树:");
    console.log("区间 [0,5] 的和:", sumTree.query(0, 5)); // 36
    console.log("区间 [1,3] 的和:", sumTree.query(1, 3)); // 15

    // 单点更新
    console.log("\n更新位置 2 的值为 6:");
    sumTree.update(2, 6);
    console.log("区间 [0,5] 的和:", sumTree.query(0, 5)); // 37
    console.log("区间 [1,3] 的和:", sumTree.query(1, 3)); // 16

    // 区间更新
    console.log("\n区间 [1,3] 每个元素增加 2:");
    sumTree.updateRange(1, 3, 2);
    console.log("区间 [0,5] 的和:", sumTree.query(0, 5)); // 43
    console.log("区间 [1,3] 的和:", sumTree.query(1, 3)); // 22

    // 创建最大值线段树
    const maxTree = new SegmentTree(arr, "max");
    console.log("\n创建最大值线段树:");
    console.log("区间 [0,5] 的最大值:", maxTree.query(0, 5)); // 11
    console.log("区间 [1,3] 的最大值:", maxTree.query(1, 3)); // 7

    maxTree.update(2, 10);
    console.log("更新位置 2 的值为 10:");
    console.log("区间 [1,3] 的最大值:", maxTree.query(1, 3)); // 10
  }

  /**
   * 演示线段树在区间操作中的应用
   */
  static demonstrateRangeOperations(): void {
    console.log("\n=== 线段树区间操作演示 ===");

    const arr = [2, 4, 6, 8, 10];
    const tree = new SegmentTree(arr, "sum");

    console.log("初始数组:", arr);
    console.log("初始总和:", tree.query(0, 4));

    // 多次区间更新
    console.log("\n执行多次区间更新:");
    tree.updateRange(0, 2, 1); // 前三个元素+1
    console.log("区间 [0,2] 每个元素 +1, 新的总和:", tree.query(0, 4));

    tree.updateRange(2, 4, 2); // 后三个元素+2
    console.log("区间 [2,4] 每个元素 +2, 新的总和:", tree.query(0, 4));

    tree.updateRange(1, 3, -1); // 中间三个元素-1
    console.log("区间 [1,3] 每个元素 -1, 新的总和:", tree.query(0, 4));

    // 查询各个区间
    console.log("\n查询各个区间:");
    for (let i = 0; i < 5; i++) {
      for (let j = i; j < 5; j++) {
        console.log(`区间 [${i},${j}] 的和:`, tree.query(i, j));
      }
    }
  }

  /**
   * 性能测试
   * @param size 测试规模
   */
  static performanceTest(size: number = 100000): void {
    console.log(`\n=== 线段树性能测试 (n=${size}) ===`);

    // 生成测试数据
    const arr = Array.from({ length: size }, (_, i) => i + 1);

    // 构建时间
    console.time("构建线段树");
    const tree = new SegmentTree(arr, "sum");
    console.timeEnd("构建线段树");

    console.log("树的高度:", tree.getHeight());
    console.log("节点数量:", tree.getNodeCount());

    // 查询性能测试
    const queryCount = 1000;
    console.time(`${queryCount} 次随机区间查询`);
    for (let i = 0; i < queryCount; i++) {
      const left = Math.floor(Math.random() * size);
      const right = Math.floor(Math.random() * (size - left)) + left;
      tree.query(left, right);
    }
    console.timeEnd(`${queryCount} 次随机区间查询`);

    // 更新性能测试
    const updateCount = 1000;
    console.time(`${updateCount} 次随机单点更新`);
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * size);
      const value = Math.floor(Math.random() * 1000);
      tree.update(index, value);
    }
    console.timeEnd(`${updateCount} 次随机单点更新`);

    // 区间更新性能测试
    const rangeUpdateCount = 1000;
    console.time(`${rangeUpdateCount} 次随机区间更新`);
    for (let i = 0; i < rangeUpdateCount; i++) {
      const left = Math.floor(Math.random() * size);
      const right = Math.floor(Math.random() * (size - left)) + left;
      const delta = Math.floor(Math.random() * 10) - 5;
      tree.updateRange(left, right, delta);
    }
    console.timeEnd(`${rangeUpdateCount} 次随机区间更新`);
  }

  /**
   * 验证线段树的正确性
   * @param size 测试规模
   */
  static verifyCorrectness(size: number = 1000): void {
    console.log(`\n=== 线段树正确性验证 (n=${size}) ===`);

    // 生成随机测试数据
    const arr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    const tree = new SegmentTree(arr, "sum");

    let testsPassed = 0;
    let totalTests = 0;

    // 测试初始查询
    for (let i = 0; i < 100; i++) {
      const left = Math.floor(Math.random() * size);
      const right = Math.floor(Math.random() * (size - left)) + left;

      const expected = arr
        .slice(left, right + 1)
        .reduce((sum, val) => sum + val, 0);
      const actual = tree.query(left, right);

      totalTests++;
      if (expected === actual) {
        testsPassed++;
      } else {
        console.log(
          `测试失败: 区间[${left},${right}] 期望=${expected}, 实际=${actual}`
        );
      }
    }

    // 测试单点更新后的查询
    for (let i = 0; i < 50; i++) {
      const index = Math.floor(Math.random() * size);
      const newValue = Math.floor(Math.random() * 100);

      arr[index] = newValue;
      tree.update(index, newValue);

      // 随机查询几个区间验证
      for (let j = 0; j < 5; j++) {
        const left = Math.floor(Math.random() * size);
        const right = Math.floor(Math.random() * (size - left)) + left;

        const expected = arr
          .slice(left, right + 1)
          .reduce((sum, val) => sum + val, 0);
        const actual = tree.query(left, right);

        totalTests++;
        if (expected === actual) {
          testsPassed++;
        } else {
          console.log(
            `更新后测试失败: 区间[${left},${right}] 期望=${expected}, 实际=${actual}`
          );
        }
      }
    }

    console.log(
      `正确性验证完成: ${testsPassed}/${totalTests} 通过 (${(
        (testsPassed / totalTests) *
        100
      ).toFixed(2)}%)`
    );
  }
}
