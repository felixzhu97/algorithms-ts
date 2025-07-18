/**
 * 分治算法模块
 * 统一导出所有分治算法
 */

// 最大子数组问题
export {
  MaxSubarrayResult,
  findMaximumSubarray,
  findMaximumSubarrayKadane,
} from "./maximum-subarray";

// 快速幂算法
export {
  fastPowerRecursive,
  fastPowerIterative,
  fastPowerBinary,
  matrixFastPower,
  fibonacciFastPower,
} from "./fast-power";

// 矩阵运算
export {
  Matrix,
  standardMatrixMultiply,
  strassenMatrixMultiply,
  matrixAdd,
  matrixSubtract,
  matrixScalarMultiply,
  luDecomposition,
  forwardSubstitution,
  backSubstitution,
  solveLinearSystem,
  matrixInverse,
  determinant,
  trace,
  frobeniusNorm,
  oneNorm,
  infinityNorm,
  MatrixUtils,
  type LUDecomposition,
} from "./matrix-operations";

// 快速傅里叶变换
export {
  Complex,
  Polynomial,
  fft,
  ifft,
  polynomialMultiplyFFT,
  polynomialMultiply,
  bigIntegerMultiply,
  convolution,
  circularConvolution,
  NumberTheoreticTransform,
  FFTUtils,
} from "./fft";

// 计算几何学
export {
  Point2D,
  LineSegment,
  Polygon,
  grahamScan,
  jarvisMarch,
  segmentsIntersect,
  closestPair,
  ComputationalGeometry,
} from "./computational-geometry";
