/**
 * 快速幂算法实现
 * 《算法导论》第31章 数论算法
 */

/**
 * 快速幂 - 递归版本
 * 计算 base^exponent mod modulus
 * 时间复杂度: O(log n)
 * 空间复杂度: O(log n)
 */
export function fastPowerRecursive(
  base: number,
  exponent: number,
  modulus?: number
): number {
  if (exponent === 0) {
    return 1;
  }

  if (exponent === 1) {
    return modulus ? base % modulus : base;
  }

  if (exponent % 2 === 0) {
    // 偶数指数
    const halfPower = fastPowerRecursive(base, exponent / 2, modulus);
    const result = halfPower * halfPower;
    return modulus ? result % modulus : result;
  } else {
    // 奇数指数
    const result = base * fastPowerRecursive(base, exponent - 1, modulus);
    return modulus ? result % modulus : result;
  }
}

/**
 * 快速幂 - 迭代版本
 * 计算 base^exponent mod modulus
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 */
export function fastPowerIterative(
  base: number,
  exponent: number,
  modulus?: number
): number {
  let result = 1;
  let currentBase = modulus ? base % modulus : base;

  while (exponent > 0) {
    // 如果指数是奇数，将当前底数乘到结果中
    if (exponent % 2 === 1) {
      result = modulus
        ? (result * currentBase) % modulus
        : result * currentBase;
    }

    // 平方底数，指数除以2
    currentBase = modulus
      ? (currentBase * currentBase) % modulus
      : currentBase * currentBase;
    exponent = Math.floor(exponent / 2);
  }

  return result;
}

/**
 * 快速幂 - 二进制方法
 * 使用二进制表示优化计算
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 */
export function fastPowerBinary(
  base: number,
  exponent: number,
  modulus?: number
): number {
  let result = 1;
  let currentBase = modulus ? base % modulus : base;

  while (exponent > 0) {
    // 检查最低位是否为1
    if (exponent & 1) {
      result = modulus
        ? (result * currentBase) % modulus
        : result * currentBase;
    }

    // 右移一位（相当于除以2）
    exponent >>= 1;

    // 底数平方
    currentBase = modulus
      ? (currentBase * currentBase) % modulus
      : currentBase * currentBase;
  }

  return result;
}

/**
 * 矩阵快速幂
 * 用于计算矩阵的幂，常用于斐波那契数列等问题
 */
export type Matrix = number[][];

/**
 * 矩阵乘法
 */
function multiplyMatrix(a: Matrix, b: Matrix, modulus?: number): Matrix {
  const rows = a.length;
  const cols = b[0].length;
  const result: Matrix = Array.from({ length: rows }, () =>
    new Array(cols).fill(0)
  );

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < b.length; k++) {
        result[i][j] += a[i][k] * b[k][j];
        if (modulus) {
          result[i][j] %= modulus;
        }
      }
    }
  }

  return result;
}

/**
 * 矩阵快速幂
 * 时间复杂度: O(n³ log k) 其中n是矩阵维度，k是指数
 */
export function matrixFastPower(
  matrix: Matrix,
  exponent: number,
  modulus?: number
): Matrix {
  if (exponent === 0) {
    // 返回单位矩阵
    const size = matrix.length;
    const identity: Matrix = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
    );
    return identity;
  }

  if (exponent === 1) {
    return matrix;
  }

  if (exponent % 2 === 0) {
    const halfPower = matrixFastPower(matrix, exponent / 2, modulus);
    return multiplyMatrix(halfPower, halfPower, modulus);
  } else {
    const result = matrixFastPower(matrix, exponent - 1, modulus);
    return multiplyMatrix(matrix, result, modulus);
  }
}

/**
 * 使用快速幂计算斐波那契数列
 * F(n) = F(n-1) + F(n-2)
 * 使用矩阵快速幂，时间复杂度降至 O(log n)
 */
export function fibonacciFastPower(n: number, modulus?: number): number {
  if (n <= 1) {
    return n;
  }

  const transformMatrix: Matrix = [
    [1, 1],
    [1, 0],
  ];

  const resultMatrix = matrixFastPower(transformMatrix, n - 1, modulus);
  return resultMatrix[0][0];
}
