/**
 * 树状数组 (Binary Indexed Tree / Fenwick Tree) 实现
 * 高效支持前缀和查询和单点更新，时间复杂度 O(log n)
 */

/**
 * 基础树状数组类
 * 支持前缀和查询和单点更新
 */
export class BinaryIndexedTree {
  private tree: number[];
  private size: number;

  /**
   * 构造函数
   * @param size 数组大小
   */
  constructor(size: number) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0);
  }

  /**
   * 从数组初始化树状数组
   * @param arr 初始数组
   * @returns 新的树状数组实例
   */
  static fromArray(arr: number[]): BinaryIndexedTree {
    const bit = new BinaryIndexedTree(arr.length);
    for (let i = 0; i < arr.length; i++) {
      bit.update(i + 1, arr[i]);
    }
    return bit;
  }

  /**
   * 获取最低有效位
   * @param x 输入数字
   * @returns 最低有效位
   */
  private lowbit(x: number): number {
    return x & -x;
  }

  /**
   * 单点更新：给位置 index 的值增加 delta
   * 时间复杂度: O(log n)
   * @param index 位置 (1-indexed)
   * @param delta 增量
   */
  public update(index: number, delta: number): void {
    if (index < 1 || index > this.size) {
      throw new Error(`Index ${index} out of bounds [1, ${this.size}]`);
    }

    while (index <= this.size) {
      this.tree[index] += delta;
      index += this.lowbit(index);
    }
  }

  /**
   * 前缀和查询：计算 [1, index] 的和
   * 时间复杂度: O(log n)
   * @param index 位置 (1-indexed)
   * @returns 前缀和
   */
  public query(index: number): number {
    if (index < 0) return 0;
    if (index > this.size) index = this.size;

    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= this.lowbit(index);
    }
    return sum;
  }

  /**
   * 区间和查询：计算 [left, right] 的和
   * 时间复杂度: O(log n)
   * @param left 左边界 (1-indexed)
   * @param right 右边界 (1-indexed)
   * @returns 区间和
   */
  public rangeQuery(left: number, right: number): number {
    if (left > right) return 0;
    return this.query(right) - this.query(left - 1);
  }

  /**
   * 设置位置 index 的值为 value
   * @param index 位置 (1-indexed)
   * @param value 新值
   */
  public set(index: number, value: number): void {
    const currentValue = this.get(index);
    this.update(index, value - currentValue);
  }

  /**
   * 获取位置 index 的值
   * @param index 位置 (1-indexed)
   * @returns 该位置的值
   */
  public get(index: number): number {
    return this.rangeQuery(index, index);
  }

  /**
   * 获取数组大小
   * @returns 数组大小
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * 将树状数组转换为普通数组
   * @returns 原始数组
   */
  public toArray(): number[] {
    const result: number[] = [];
    for (let i = 1; i <= this.size; i++) {
      result.push(this.get(i));
    }
    return result;
  }

  /**
   * 清空树状数组
   */
  public clear(): void {
    this.tree.fill(0);
  }

  /**
   * 二分查找第一个前缀和 >= target 的位置
   * 要求数组中的值都非负
   * 时间复杂度: O(log^2 n)
   * @param target 目标值
   * @returns 位置 (1-indexed)，如果不存在返回 -1
   */
  public findFirstPrefix(target: number): number {
    let left = 1,
      right = this.size;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.query(mid) >= target) {
        result = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return result;
  }

  /**
   * 高效二分查找第一个前缀和 >= target 的位置
   * 时间复杂度: O(log n)
   * @param target 目标值
   * @returns 位置 (1-indexed)，如果不存在返回 -1
   */
  public findFirstPrefixFast(target: number): number {
    let pos = 0;
    let sum = 0;

    // 从最高位开始
    let power = 1;
    while (power <= this.size) {
      power <<= 1;
    }
    power >>= 1;

    while (power > 0) {
      if (pos + power <= this.size && sum + this.tree[pos + power] < target) {
        pos += power;
        sum += this.tree[pos];
      }
      power >>= 1;
    }

    return pos + 1 <= this.size ? pos + 1 : -1;
  }
}

/**
 * 二维树状数组
 * 支持二维区域的查询和更新
 */
export class BinaryIndexedTree2D {
  private tree: number[][];
  private rows: number;
  private cols: number;

  /**
   * 构造函数
   * @param rows 行数
   * @param cols 列数
   */
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.tree = Array.from({ length: rows + 1 }, () =>
      new Array(cols + 1).fill(0)
    );
  }

  /**
   * 获取最低有效位
   * @param x 输入数字
   * @returns 最低有效位
   */
  private lowbit(x: number): number {
    return x & -x;
  }

  /**
   * 二维单点更新
   * @param row 行 (1-indexed)
   * @param col 列 (1-indexed)
   * @param delta 增量
   */
  public update(row: number, col: number, delta: number): void {
    if (row < 1 || row > this.rows || col < 1 || col > this.cols) {
      throw new Error(`Position (${row},${col}) out of bounds`);
    }

    for (let i = row; i <= this.rows; i += this.lowbit(i)) {
      for (let j = col; j <= this.cols; j += this.lowbit(j)) {
        this.tree[i][j] += delta;
      }
    }
  }

  /**
   * 二维前缀和查询：计算从 (1,1) 到 (row,col) 的矩形区域和
   * @param row 行 (1-indexed)
   * @param col 列 (1-indexed)
   * @returns 前缀和
   */
  public query(row: number, col: number): number {
    if (row < 0 || col < 0) return 0;
    if (row > this.rows) row = this.rows;
    if (col > this.cols) col = this.cols;

    let sum = 0;
    for (let i = row; i > 0; i -= this.lowbit(i)) {
      for (let j = col; j > 0; j -= this.lowbit(j)) {
        sum += this.tree[i][j];
      }
    }
    return sum;
  }

  /**
   * 二维区域和查询
   * @param row1 左上角行 (1-indexed)
   * @param col1 左上角列 (1-indexed)
   * @param row2 右下角行 (1-indexed)
   * @param col2 右下角列 (1-indexed)
   * @returns 区域和
   */
  public rangeQuery(
    row1: number,
    col1: number,
    row2: number,
    col2: number
  ): number {
    if (row1 > row2 || col1 > col2) return 0;

    return (
      this.query(row2, col2) -
      this.query(row1 - 1, col2) -
      this.query(row2, col1 - 1) +
      this.query(row1 - 1, col1 - 1)
    );
  }

  /**
   * 获取矩阵大小
   * @returns [rows, cols]
   */
  public getSize(): [number, number] {
    return [this.rows, this.cols];
  }
}

/**
 * 差分数组树状数组
 * 支持区间更新和单点查询
 */
export class DifferenceArrayBIT {
  private bit: BinaryIndexedTree;

  /**
   * 构造函数
   * @param size 数组大小
   */
  constructor(size: number) {
    this.bit = new BinaryIndexedTree(size);
  }

  /**
   * 区间更新：给 [left, right] 区间内的所有元素增加 delta
   * @param left 左边界 (1-indexed)
   * @param right 右边界 (1-indexed)
   * @param delta 增量
   */
  public updateRange(left: number, right: number, delta: number): void {
    this.bit.update(left, delta);
    if (right + 1 <= this.bit.getSize()) {
      this.bit.update(right + 1, -delta);
    }
  }

  /**
   * 单点查询：获取位置 index 的值
   * @param index 位置 (1-indexed)
   * @returns 该位置的值
   */
  public query(index: number): number {
    return this.bit.query(index);
  }

  /**
   * 单点更新：设置位置 index 的值为 value
   * @param index 位置 (1-indexed)
   * @param value 新值
   */
  public update(index: number, value: number): void {
    const currentValue = this.query(index);
    const delta = value - currentValue;
    this.updateRange(index, index, delta);
  }

  /**
   * 获取数组大小
   * @returns 数组大小
   */
  public getSize(): number {
    return this.bit.getSize();
  }
}

/**
 * 树状数组工具类
 * 提供演示、测试和性能评估功能
 */
export class BinaryIndexedTreeUtils {
  /**
   * 演示基本操作
   */
  static demonstrateBasicOperations(): void {
    console.log("=== 树状数组基本操作演示 ===");

    const arr = [1, 3, 5, 7, 9, 11];
    console.log("初始数组:", arr);

    const bit = BinaryIndexedTree.fromArray(arr);

    // 前缀和查询
    console.log("\n前缀和查询:");
    for (let i = 1; i <= 6; i++) {
      console.log(`前缀和[1,${i}]:`, bit.query(i));
    }

    // 区间和查询
    console.log("\n区间和查询:");
    console.log("区间和[2,4]:", bit.rangeQuery(2, 4)); // 3+5+7=15
    console.log("区间和[3,6]:", bit.rangeQuery(3, 6)); // 5+7+9+11=32

    // 单点更新
    console.log("\n单点更新:");
    console.log("更新位置3的值为10 (原值5)");
    bit.set(3, 10);
    console.log("新的区间和[2,4]:", bit.rangeQuery(2, 4)); // 3+10+7=20
    console.log("新的前缀和[1,6]:", bit.query(6)); // 1+3+10+7+9+11=41
  }

  /**
   * 演示二维树状数组
   */
  static demonstrate2D(): void {
    console.log("\n=== 二维树状数组演示 ===");

    const bit2d = new BinaryIndexedTree2D(4, 4);

    // 构建一个4x4的矩阵
    const matrix = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];

    console.log("初始矩阵:");
    matrix.forEach((row) => console.log(row.join("\t")));

    // 初始化二维树状数组
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        bit2d.update(i + 1, j + 1, matrix[i][j]);
      }
    }

    // 区域查询
    console.log("\n区域查询:");
    console.log("矩形(1,1)到(2,2)的和:", bit2d.rangeQuery(1, 1, 2, 2)); // 1+2+5+6=14
    console.log("矩形(2,2)到(3,3)的和:", bit2d.rangeQuery(2, 2, 3, 3)); // 6+7+10+11=34
    console.log("矩形(1,1)到(4,4)的和:", bit2d.rangeQuery(1, 1, 4, 4)); // 所有元素的和=136

    // 更新
    console.log("\n更新位置(2,2)增加5:");
    bit2d.update(2, 2, 5);
    console.log("矩形(1,1)到(2,2)的新和:", bit2d.rangeQuery(1, 1, 2, 2)); // 1+2+5+11=19
  }

  /**
   * 演示差分数组树状数组
   */
  static demonstrateDifferenceArray(): void {
    console.log("\n=== 差分数组树状数组演示 ===");

    const diffBit = new DifferenceArrayBIT(6);

    console.log("初始数组: [0, 0, 0, 0, 0, 0]");

    // 区间更新
    console.log("\n区间更新 [2,4] 增加 3:");
    diffBit.updateRange(2, 4, 3);

    console.log(
      "当前数组:",
      Array.from({ length: 6 }, (_, i) => diffBit.query(i + 1))
    );

    console.log("\n区间更新 [1,3] 增加 2:");
    diffBit.updateRange(1, 3, 2);

    console.log(
      "当前数组:",
      Array.from({ length: 6 }, (_, i) => diffBit.query(i + 1))
    );

    console.log("\n区间更新 [4,6] 增加 -1:");
    diffBit.updateRange(4, 6, -1);

    console.log(
      "最终数组:",
      Array.from({ length: 6 }, (_, i) => diffBit.query(i + 1))
    );
  }

  /**
   * 性能测试
   * @param size 测试规模
   */
  static performanceTest(size: number = 100000): void {
    console.log(`\n=== 树状数组性能测试 (n=${size}) ===`);

    // 构建测试
    console.time("构建树状数组");
    const bit = new BinaryIndexedTree(size);
    console.timeEnd("构建树状数组");

    // 初始化数据
    console.time("初始化数据");
    for (let i = 1; i <= size; i++) {
      bit.update(i, i);
    }
    console.timeEnd("初始化数据");

    // 查询性能测试
    const queryCount = 100000;
    console.time(`${queryCount} 次随机前缀和查询`);
    for (let i = 0; i < queryCount; i++) {
      const index = Math.floor(Math.random() * size) + 1;
      bit.query(index);
    }
    console.timeEnd(`${queryCount} 次随机前缀和查询`);

    // 区间查询性能测试
    console.time(`${queryCount} 次随机区间查询`);
    for (let i = 0; i < queryCount; i++) {
      const left = Math.floor(Math.random() * size) + 1;
      const right = Math.floor(Math.random() * (size - left + 1)) + left;
      bit.rangeQuery(left, right);
    }
    console.timeEnd(`${queryCount} 次随机区间查询`);

    // 更新性能测试
    const updateCount = 100000;
    console.time(`${updateCount} 次随机更新`);
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * size) + 1;
      const delta = Math.floor(Math.random() * 100) - 50;
      bit.update(index, delta);
    }
    console.timeEnd(`${updateCount} 次随机更新`);
  }

  /**
   * 正确性验证
   * @param size 测试规模
   */
  static verifyCorrectness(size: number = 1000): void {
    console.log(`\n=== 树状数组正确性验证 (n=${size}) ===`);

    // 生成随机测试数据
    const arr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    const bit = BinaryIndexedTree.fromArray(arr);

    let testsPassed = 0;
    let totalTests = 0;

    // 测试前缀和查询
    for (let i = 0; i < 100; i++) {
      const index = Math.floor(Math.random() * size) + 1;

      const expected = arr.slice(0, index).reduce((sum, val) => sum + val, 0);
      const actual = bit.query(index);

      totalTests++;
      if (expected === actual) {
        testsPassed++;
      } else {
        console.log(
          `前缀和测试失败: index=${index} 期望=${expected}, 实际=${actual}`
        );
      }
    }

    // 测试区间查询
    for (let i = 0; i < 100; i++) {
      const left = Math.floor(Math.random() * size) + 1;
      const right = Math.floor(Math.random() * (size - left + 1)) + left;

      const expected = arr
        .slice(left - 1, right)
        .reduce((sum, val) => sum + val, 0);
      const actual = bit.rangeQuery(left, right);

      totalTests++;
      if (expected === actual) {
        testsPassed++;
      } else {
        console.log(
          `区间查询测试失败: [${left},${right}] 期望=${expected}, 实际=${actual}`
        );
      }
    }

    // 测试更新操作
    for (let i = 0; i < 50; i++) {
      const index = Math.floor(Math.random() * size) + 1;
      const newValue = Math.floor(Math.random() * 100);

      arr[index - 1] = newValue;
      bit.set(index, newValue);

      // 验证更新后的前缀和
      const expected = arr.slice(0, index).reduce((sum, val) => sum + val, 0);
      const actual = bit.query(index);

      totalTests++;
      if (expected === actual) {
        testsPassed++;
      } else {
        console.log(
          `更新后测试失败: index=${index} 期望=${expected}, 实际=${actual}`
        );
      }
    }

    console.log(
      `正确性验证完成: ${testsPassed}/${totalTests} 通过 (${(
        (testsPassed / totalTests) *
        100
      ).toFixed(2)}%)`
    );
  }

  /**
   * 应用示例：逆序对计数
   * @param arr 输入数组
   * @returns 逆序对数量
   */
  static countInversions(arr: number[]): number {
    // 离散化处理
    const sorted = [...new Set(arr)].sort((a, b) => a - b);
    const coordMap = new Map<number, number>();
    sorted.forEach((val, idx) => coordMap.set(val, idx + 1));

    const bit = new BinaryIndexedTree(sorted.length);
    let inversions = 0;

    for (let i = 0; i < arr.length; i++) {
      const coord = coordMap.get(arr[i])!;

      // 计算有多少个比当前元素大的元素在它之前出现
      inversions += bit.query(sorted.length) - bit.query(coord);

      // 将当前元素加入树状数组
      bit.update(coord, 1);
    }

    return inversions;
  }

  /**
   * 演示逆序对计数
   */
  static demonstrateInversions(): void {
    console.log("\n=== 逆序对计数演示 ===");

    const testCases = [
      [1, 3, 2, 5, 4],
      [5, 4, 3, 2, 1],
      [1, 2, 3, 4, 5],
      [2, 3, 8, 6, 1],
    ];

    testCases.forEach((arr, index) => {
      const count = this.countInversions(arr);
      console.log(
        `数组 ${index + 1}: [${arr.join(", ")}] -> 逆序对数量: ${count}`
      );
    });
  }
}
