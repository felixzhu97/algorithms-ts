/**
 * 矩阵运算算法实现
 * 《算法导论》第28章 矩阵运算
 *
 * 包含以下算法：
 * 1. Strassen矩阵乘法算法
 * 2. LU分解
 * 3. 矩阵求逆
 * 4. 行列式计算
 * 5. 线性方程组求解
 */

/**
 * 矩阵类
 */
export class Matrix {
  public data: number[][];
  public rows: number;
  public cols: number;

  constructor(data: number[][] | number, cols?: number) {
    if (typeof data === "number") {
      // 创建零矩阵
      this.rows = data;
      this.cols = cols || data;
      this.data = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
      );
    } else {
      this.data = data.map((row) => [...row]);
      this.rows = data.length;
      this.cols = data[0]?.length || 0;
    }
  }

  /**
   * 获取元素
   */
  get(i: number, j: number): number {
    if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
      throw new Error(`索引超出范围: (${i}, ${j})`);
    }
    return this.data[i][j];
  }

  /**
   * 设置元素
   */
  set(i: number, j: number, value: number): void {
    if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
      throw new Error(`索引超出范围: (${i}, ${j})`);
    }
    this.data[i][j] = value;
  }

  /**
   * 获取子矩阵
   */
  subMatrix(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ): Matrix {
    const subData: number[][] = [];
    for (let i = startRow; i < endRow; i++) {
      subData.push(this.data[i].slice(startCol, endCol));
    }
    return new Matrix(subData);
  }

  /**
   * 设置子矩阵
   */
  setSubMatrix(startRow: number, startCol: number, subMatrix: Matrix): void {
    for (let i = 0; i < subMatrix.rows; i++) {
      for (let j = 0; j < subMatrix.cols; j++) {
        this.set(startRow + i, startCol + j, subMatrix.get(i, j));
      }
    }
  }

  /**
   * 检查是否为方阵
   */
  isSquare(): boolean {
    return this.rows === this.cols;
  }

  /**
   * 检查矩阵尺寸是否兼容乘法
   */
  canMultiply(other: Matrix): boolean {
    return this.cols === other.rows;
  }

  /**
   * 转置矩阵
   */
  transpose(): Matrix {
    const result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(j, i, this.get(i, j));
      }
    }
    return result;
  }

  /**
   * 克隆矩阵
   */
  clone(): Matrix {
    return new Matrix(this.data);
  }

  /**
   * 创建单位矩阵
   */
  static identity(size: number): Matrix {
    const result = new Matrix(size);
    for (let i = 0; i < size; i++) {
      result.set(i, i, 1);
    }
    return result;
  }

  /**
   * 创建随机矩阵
   */
  static random(rows: number, cols: number, min = 0, max = 10): Matrix {
    const result = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result.set(i, j, Math.random() * (max - min) + min);
      }
    }
    return result;
  }

  /**
   * 矩阵相等比较
   */
  equals(other: Matrix, tolerance = 1e-10): boolean {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      return false;
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.abs(this.get(i, j) - other.get(i, j)) > tolerance) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 打印矩阵
   */
  print(precision = 2): void {
    console.log("Matrix:");
    for (let i = 0; i < this.rows; i++) {
      const row = this.data[i].map((val) => val.toFixed(precision)).join("  ");
      console.log(`  [${row}]`);
    }
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return this.data.map((row) => `[${row.join(", ")}]`).join("\n");
  }
}

/**
 * LU分解结果
 */
export interface LUDecomposition {
  L: Matrix; // 下三角矩阵
  U: Matrix; // 上三角矩阵
  P: Matrix; // 置换矩阵
  determinant: number; // 行列式
  isDecomposed: boolean;
}

/**
 * 标准矩阵乘法
 * 时间复杂度: O(n³)
 */
export function standardMatrixMultiply(A: Matrix, B: Matrix): Matrix {
  if (!A.canMultiply(B)) {
    throw new Error(
      `矩阵尺寸不兼容: ${A.rows}×${A.cols} 和 ${B.rows}×${B.cols}`
    );
  }

  const result = new Matrix(A.rows, B.cols);

  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < B.cols; j++) {
      let sum = 0;
      for (let k = 0; k < A.cols; k++) {
        sum += A.get(i, k) * B.get(k, j);
      }
      result.set(i, j, sum);
    }
  }

  return result;
}

/**
 * Strassen矩阵乘法算法
 * 时间复杂度: O(n^log₂7) ≈ O(n^2.807)
 */
export function strassenMatrixMultiply(A: Matrix, B: Matrix): Matrix {
  if (!A.canMultiply(B)) {
    throw new Error(
      `矩阵尺寸不兼容: ${A.rows}×${A.cols} 和 ${B.rows}×${B.cols}`
    );
  }

  // 对于小矩阵，使用标准算法
  if (A.rows <= 64 || A.cols <= 64 || B.cols <= 64) {
    return standardMatrixMultiply(A, B);
  }

  // 确保矩阵是方阵且维数是2的幂
  const maxDim = Math.max(A.rows, A.cols, B.rows, B.cols);
  const paddedSize = Math.pow(2, Math.ceil(Math.log2(maxDim)));

  const paddedA = padMatrix(A, paddedSize, paddedSize);
  const paddedB = padMatrix(B, paddedSize, paddedSize);

  const result = strassenRecursive(paddedA, paddedB);

  // 提取原始大小的结果
  return result.subMatrix(0, A.rows, 0, B.cols);
}

/**
 * Strassen递归实现
 */
function strassenRecursive(A: Matrix, B: Matrix): Matrix {
  const n = A.rows;

  // 基础情况
  if (n <= 64) {
    return standardMatrixMultiply(A, B);
  }

  const half = n / 2;

  // 分割矩阵
  const A11 = A.subMatrix(0, half, 0, half);
  const A12 = A.subMatrix(0, half, half, n);
  const A21 = A.subMatrix(half, n, 0, half);
  const A22 = A.subMatrix(half, n, half, n);

  const B11 = B.subMatrix(0, half, 0, half);
  const B12 = B.subMatrix(0, half, half, n);
  const B21 = B.subMatrix(half, n, 0, half);
  const B22 = B.subMatrix(half, n, half, n);

  // 计算7个乘积
  const M1 = strassenRecursive(matrixAdd(A11, A22), matrixAdd(B11, B22));
  const M2 = strassenRecursive(matrixAdd(A21, A22), B11);
  const M3 = strassenRecursive(A11, matrixSubtract(B12, B22));
  const M4 = strassenRecursive(A22, matrixSubtract(B21, B11));
  const M5 = strassenRecursive(matrixAdd(A11, A12), B22);
  const M6 = strassenRecursive(matrixSubtract(A21, A11), matrixAdd(B11, B12));
  const M7 = strassenRecursive(matrixSubtract(A12, A22), matrixAdd(B21, B22));

  // 计算结果的四个块
  const C11 = matrixAdd(matrixSubtract(matrixAdd(M1, M4), M5), M7);
  const C12 = matrixAdd(M3, M5);
  const C21 = matrixAdd(M2, M4);
  const C22 = matrixAdd(matrixSubtract(matrixAdd(M1, M3), M2), M6);

  // 合并结果
  const result = new Matrix(n);
  result.setSubMatrix(0, 0, C11);
  result.setSubMatrix(0, half, C12);
  result.setSubMatrix(half, 0, C21);
  result.setSubMatrix(half, half, C22);

  return result;
}

/**
 * 矩阵加法
 */
export function matrixAdd(A: Matrix, B: Matrix): Matrix {
  if (A.rows !== B.rows || A.cols !== B.cols) {
    throw new Error("矩阵尺寸不匹配");
  }

  const result = new Matrix(A.rows, A.cols);
  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < A.cols; j++) {
      result.set(i, j, A.get(i, j) + B.get(i, j));
    }
  }
  return result;
}

/**
 * 矩阵减法
 */
export function matrixSubtract(A: Matrix, B: Matrix): Matrix {
  if (A.rows !== B.rows || A.cols !== B.cols) {
    throw new Error("矩阵尺寸不匹配");
  }

  const result = new Matrix(A.rows, A.cols);
  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < A.cols; j++) {
      result.set(i, j, A.get(i, j) - B.get(i, j));
    }
  }
  return result;
}

/**
 * 矩阵数乘
 */
export function matrixScalarMultiply(A: Matrix, scalar: number): Matrix {
  const result = new Matrix(A.rows, A.cols);
  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < A.cols; j++) {
      result.set(i, j, A.get(i, j) * scalar);
    }
  }
  return result;
}

/**
 * 填充矩阵到指定大小
 */
function padMatrix(matrix: Matrix, newRows: number, newCols: number): Matrix {
  const result = new Matrix(newRows, newCols);

  for (let i = 0; i < Math.min(matrix.rows, newRows); i++) {
    for (let j = 0; j < Math.min(matrix.cols, newCols); j++) {
      result.set(i, j, matrix.get(i, j));
    }
  }

  return result;
}

/**
 * LU分解（带部分主元选择）
 * 时间复杂度: O(n³)
 */
export function luDecomposition(A: Matrix): LUDecomposition {
  if (!A.isSquare()) {
    throw new Error("LU分解需要方阵");
  }

  const n = A.rows;
  const L = Matrix.identity(n);
  const U = A.clone();
  const P = Matrix.identity(n);
  let determinant = 1;
  let swapCount = 0;

  for (let k = 0; k < n - 1; k++) {
    // 选择主元
    let maxRow = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(U.get(i, k)) > Math.abs(U.get(maxRow, k))) {
        maxRow = i;
      }
    }

    // 交换行
    if (maxRow !== k) {
      swapRows(U, k, maxRow);
      swapRows(P, k, maxRow);
      if (k > 0) {
        swapRows(L, k, maxRow);
      }
      swapCount++;
    }

    // 检查奇异性
    if (Math.abs(U.get(k, k)) < 1e-15) {
      return {
        L,
        U,
        P,
        determinant: 0,
        isDecomposed: false,
      };
    }

    // 消元
    for (let i = k + 1; i < n; i++) {
      const factor = U.get(i, k) / U.get(k, k);
      L.set(i, k, factor);

      for (let j = k; j < n; j++) {
        U.set(i, j, U.get(i, j) - factor * U.get(k, j));
      }
    }
  }

  // 计算行列式
  for (let i = 0; i < n; i++) {
    determinant *= U.get(i, i);
  }
  determinant *= Math.pow(-1, swapCount);

  return {
    L,
    U,
    P,
    determinant,
    isDecomposed: true,
  };
}

/**
 * 交换矩阵的两行
 */
function swapRows(matrix: Matrix, row1: number, row2: number): void {
  for (let j = 0; j < matrix.cols; j++) {
    const temp = matrix.get(row1, j);
    matrix.set(row1, j, matrix.get(row2, j));
    matrix.set(row2, j, temp);
  }
}

/**
 * 前向替换求解 Ly = b
 */
export function forwardSubstitution(L: Matrix, b: Matrix): Matrix {
  const n = L.rows;
  const y = new Matrix(n, 1);

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L.get(i, j) * y.get(j, 0);
    }
    y.set(i, 0, (b.get(i, 0) - sum) / L.get(i, i));
  }

  return y;
}

/**
 * 回代求解 Ux = y
 */
export function backSubstitution(U: Matrix, y: Matrix): Matrix {
  const n = U.rows;
  const x = new Matrix(n, 1);

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U.get(i, j) * x.get(j, 0);
    }
    x.set(i, 0, (y.get(i, 0) - sum) / U.get(i, i));
  }

  return x;
}

/**
 * 使用LU分解求解线性方程组 Ax = b
 */
export function solveLinearSystem(A: Matrix, b: Matrix): Matrix {
  const lu = luDecomposition(A);

  if (!lu.isDecomposed) {
    throw new Error("矩阵是奇异的，无法求解");
  }

  // 解 PAx = Pb，即 LUx = Pb
  const Pb = standardMatrixMultiply(lu.P, b);

  // 前向替换解 Ly = Pb
  const y = forwardSubstitution(lu.L, Pb);

  // 回代解 Ux = y
  const x = backSubstitution(lu.U, y);

  return x;
}

/**
 * 矩阵求逆
 */
export function matrixInverse(A: Matrix): Matrix {
  if (!A.isSquare()) {
    throw new Error("只有方阵才能求逆");
  }

  const n = A.rows;
  const I = Matrix.identity(n);
  const inverse = new Matrix(n);

  // 对每一列求解 Ax = e_i
  for (let i = 0; i < n; i++) {
    const ei = new Matrix(n, 1);
    ei.set(i, 0, 1);

    const xi = solveLinearSystem(A, ei);

    for (let j = 0; j < n; j++) {
      inverse.set(j, i, xi.get(j, 0));
    }
  }

  return inverse;
}

/**
 * 行列式计算
 */
export function determinant(A: Matrix): number {
  if (!A.isSquare()) {
    throw new Error("只有方阵才有行列式");
  }

  const lu = luDecomposition(A);
  return lu.determinant;
}

/**
 * 矩阵的迹（对角线元素之和）
 */
export function trace(A: Matrix): number {
  if (!A.isSquare()) {
    throw new Error("只有方阵才有迹");
  }

  let sum = 0;
  for (let i = 0; i < A.rows; i++) {
    sum += A.get(i, i);
  }
  return sum;
}

/**
 * 矩阵的Frobenius范数
 */
export function frobeniusNorm(A: Matrix): number {
  let sum = 0;
  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < A.cols; j++) {
      sum += A.get(i, j) ** 2;
    }
  }
  return Math.sqrt(sum);
}

/**
 * 矩阵的1-范数（列和的最大值）
 */
export function oneNorm(A: Matrix): number {
  let maxColSum = 0;
  for (let j = 0; j < A.cols; j++) {
    let colSum = 0;
    for (let i = 0; i < A.rows; i++) {
      colSum += Math.abs(A.get(i, j));
    }
    maxColSum = Math.max(maxColSum, colSum);
  }
  return maxColSum;
}

/**
 * 矩阵的无穷范数（行和的最大值）
 */
export function infinityNorm(A: Matrix): number {
  let maxRowSum = 0;
  for (let i = 0; i < A.rows; i++) {
    let rowSum = 0;
    for (let j = 0; j < A.cols; j++) {
      rowSum += Math.abs(A.get(i, j));
    }
    maxRowSum = Math.max(maxRowSum, rowSum);
  }
  return maxRowSum;
}

/**
 * 矩阵运算工具类
 */
export class MatrixUtils {
  /**
   * 性能测试：比较标准算法和Strassen算法
   */
  static performanceTest(): void {
    console.log("=== 矩阵乘法性能测试 ===\n");

    const sizes = [64, 128, 256, 512];

    for (const size of sizes) {
      console.log(`--- 矩阵大小: ${size}×${size} ---`);

      const A = Matrix.random(size, size, -10, 10);
      const B = Matrix.random(size, size, -10, 10);

      // 标准算法
      const standardStart = performance.now();
      const standardResult = standardMatrixMultiply(A, B);
      const standardTime = performance.now() - standardStart;

      // Strassen算法（仅对较大矩阵测试）
      let strassenTime = 0;
      let strassenResult: Matrix | null = null;

      if (size >= 128) {
        const strassenStart = performance.now();
        strassenResult = strassenMatrixMultiply(A, B);
        strassenTime = performance.now() - strassenStart;
      }

      console.log(`  标准算法: ${standardTime.toFixed(2)}ms`);
      if (strassenResult) {
        console.log(`  Strassen算法: ${strassenTime.toFixed(2)}ms`);
        console.log(`  加速比: ${(standardTime / strassenTime).toFixed(2)}x`);

        // 验证结果一致性
        const isEqual = standardResult.equals(strassenResult, 1e-10);
        console.log(`  结果一致性: ${isEqual ? "✅" : "❌"}`);
      }
      console.log();
    }
  }

  /**
   * LU分解演示
   */
  static demonstrateLU(): void {
    console.log("=== LU分解演示 ===\n");

    const A = new Matrix([
      [2, 1, 1],
      [4, 3, 3],
      [8, 7, 9],
    ]);

    console.log("原矩阵 A:");
    A.print();

    const lu = luDecomposition(A);

    if (lu.isDecomposed) {
      console.log("\n下三角矩阵 L:");
      lu.L.print();

      console.log("\n上三角矩阵 U:");
      lu.U.print();

      console.log("\n置换矩阵 P:");
      lu.P.print();

      console.log(`\n行列式: ${lu.determinant.toFixed(6)}`);

      // 验证 PA = LU
      const PA = standardMatrixMultiply(lu.P, A);
      const LU = standardMatrixMultiply(lu.L, lu.U);

      console.log("\n验证 PA = LU:");
      console.log(`PA 等于 LU: ${PA.equals(LU, 1e-10) ? "✅" : "❌"}`);

      // 求解线性方程组
      const b = new Matrix([[5], [10], [24]]);
      console.log("\n求解线性方程组 Ax = b，其中 b =");
      b.print();

      const x = solveLinearSystem(A, b);
      console.log("\n解 x =");
      x.print();

      // 验证解
      const Ax = standardMatrixMultiply(A, x);
      console.log("\n验证 Ax = b:");
      console.log(`Ax 等于 b: ${Ax.equals(b, 1e-10) ? "✅" : "❌"}`);
    } else {
      console.log("矩阵是奇异的，无法进行LU分解");
    }
  }

  /**
   * 矩阵运算综合演示
   */
  static demonstrate(): void {
    console.log("=== 矩阵运算综合演示 ===\n");

    // 创建测试矩阵
    const A = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 10],
    ]);

    const B = new Matrix([
      [1, 0, 2],
      [2, 1, 0],
      [0, 1, 3],
    ]);

    console.log("矩阵 A:");
    A.print();

    console.log("\n矩阵 B:");
    B.print();

    // 基本运算
    console.log("\n--- 基本运算 ---");

    const sum = matrixAdd(A, B);
    console.log("\nA + B:");
    sum.print();

    const diff = matrixSubtract(A, B);
    console.log("\nA - B:");
    diff.print();

    const product = standardMatrixMultiply(A, B);
    console.log("\nA × B (标准算法):");
    product.print();

    const productStrassen = strassenMatrixMultiply(A, B);
    console.log("\nA × B (Strassen算法):");
    productStrassen.print();

    console.log(
      `\n乘法结果一致性: ${
        product.equals(productStrassen, 1e-10) ? "✅" : "❌"
      }`
    );

    // 矩阵属性
    console.log("\n--- 矩阵属性 ---");
    console.log(`A的行列式: ${determinant(A).toFixed(6)}`);
    console.log(`A的迹: ${trace(A).toFixed(6)}`);
    console.log(`A的Frobenius范数: ${frobeniusNorm(A).toFixed(6)}`);
    console.log(`A的1-范数: ${oneNorm(A).toFixed(6)}`);
    console.log(`A的无穷范数: ${infinityNorm(A).toFixed(6)}`);

    // 矩阵求逆
    try {
      console.log("\n--- 矩阵求逆 ---");
      const AInv = matrixInverse(A);
      console.log("\nA的逆矩阵:");
      AInv.print();

      // 验证 A × A^(-1) = I
      const identity = standardMatrixMultiply(A, AInv);
      const I = Matrix.identity(3);
      console.log(
        `\nA × A^(-1) = I: ${identity.equals(I, 1e-10) ? "✅" : "❌"}`
      );
    } catch (error) {
      console.log(`\n矩阵求逆失败: ${error}`);
    }

    // LU分解演示
    MatrixUtils.demonstrateLU();
  }

  /**
   * 验证矩阵算法的正确性
   */
  static validateAlgorithms(): void {
    console.log("=== 矩阵算法正确性验证 ===\n");

    const testCases = [
      { size: 32, name: "小矩阵" },
      { size: 64, name: "中等矩阵" },
      { size: 128, name: "大矩阵" },
    ];

    for (const testCase of testCases) {
      console.log(
        `--- ${testCase.name} (${testCase.size}×${testCase.size}) ---`
      );

      const A = Matrix.random(testCase.size, testCase.size, -5, 5);
      const B = Matrix.random(testCase.size, testCase.size, -5, 5);

      // 验证乘法算法
      const standard = standardMatrixMultiply(A, B);
      const strassen = strassenMatrixMultiply(A, B);
      const multiplicationCorrect = standard.equals(strassen, 1e-10);
      console.log(`  乘法算法一致性: ${multiplicationCorrect ? "✅" : "❌"}`);

      // 验证LU分解
      const lu = luDecomposition(A);
      if (lu.isDecomposed) {
        const PA = standardMatrixMultiply(lu.P, A);
        const LU = standardMatrixMultiply(lu.L, lu.U);
        const luCorrect = PA.equals(LU, 1e-10);
        console.log(`  LU分解正确性: ${luCorrect ? "✅" : "❌"}`);

        // 验证行列式
        const detFromLU = lu.determinant;
        const detDirect = determinant(A);
        const detCorrect = Math.abs(detFromLU - detDirect) < 1e-10;
        console.log(`  行列式计算一致性: ${detCorrect ? "✅" : "❌"}`);
      } else {
        console.log("  LU分解: 矩阵奇异，跳过验证");
      }

      console.log();
    }
  }
}
