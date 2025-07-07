/**
 * 快速傅里叶变换算法实现
 * 《算法导论》第30章 多项式与快速傅里叶变换
 *
 * 包含以下算法：
 * 1. 快速傅里叶变换 (FFT)
 * 2. 快速傅里叶逆变换 (IFFT)
 * 3. 多项式乘法
 * 4. 大整数乘法
 * 5. 卷积运算
 */

/**
 * 复数类
 */
export class Complex {
  public real: number;
  public imag: number;

  constructor(real: number = 0, imag: number = 0) {
    this.real = real;
    this.imag = imag;
  }

  /**
   * 复数加法
   */
  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  /**
   * 复数减法
   */
  subtract(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  /**
   * 复数乘法
   */
  multiply(other: Complex): Complex {
    const real = this.real * other.real - this.imag * other.imag;
    const imag = this.real * other.imag + this.imag * other.real;
    return new Complex(real, imag);
  }

  /**
   * 复数除法
   */
  divide(other: Complex): Complex {
    const denominator = other.real * other.real + other.imag * other.imag;
    if (Math.abs(denominator) < 1e-15) {
      throw new Error("除数不能为零");
    }

    const real =
      (this.real * other.real + this.imag * other.imag) / denominator;
    const imag =
      (this.imag * other.real - this.real * other.imag) / denominator;
    return new Complex(real, imag);
  }

  /**
   * 复数的模
   */
  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  /**
   * 复数的幅角
   */
  phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  /**
   * 复数的共轭
   */
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  /**
   * 复数的字符串表示
   */
  toString(): string {
    if (Math.abs(this.imag) < 1e-15) {
      return this.real.toFixed(6);
    } else if (Math.abs(this.real) < 1e-15) {
      return `${this.imag.toFixed(6)}i`;
    } else {
      const sign = this.imag >= 0 ? "+" : "-";
      return `${this.real.toFixed(6)} ${sign} ${Math.abs(this.imag).toFixed(
        6
      )}i`;
    }
  }

  /**
   * 从极坐标创建复数
   */
  static fromPolar(magnitude: number, phase: number): Complex {
    return new Complex(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }

  /**
   * 欧拉公式：e^(iθ) = cos(θ) + i*sin(θ)
   */
  static euler(theta: number): Complex {
    return new Complex(Math.cos(theta), Math.sin(theta));
  }

  /**
   * 复数相等比较
   */
  equals(other: Complex, tolerance = 1e-10): boolean {
    return (
      Math.abs(this.real - other.real) < tolerance &&
      Math.abs(this.imag - other.imag) < tolerance
    );
  }

  /**
   * 克隆复数
   */
  clone(): Complex {
    return new Complex(this.real, this.imag);
  }
}

/**
 * 多项式类
 */
export class Polynomial {
  public coefficients: number[];

  constructor(coefficients: number[]) {
    this.coefficients = [...coefficients];
    this.removeLeadingZeros();
  }

  /**
   * 获取多项式的度
   */
  degree(): number {
    return this.coefficients.length - 1;
  }

  /**
   * 计算多项式在某点的值
   */
  evaluate(x: number): number {
    let result = 0;
    let power = 1;

    for (const coeff of this.coefficients) {
      result += coeff * power;
      power *= x;
    }

    return result;
  }

  /**
   * 使用Horner方法计算多项式值
   */
  evaluateHorner(x: number): number {
    if (this.coefficients.length === 0) return 0;

    let result = this.coefficients[this.coefficients.length - 1];
    for (let i = this.coefficients.length - 2; i >= 0; i--) {
      result = result * x + this.coefficients[i];
    }

    return result;
  }

  /**
   * 多项式加法
   */
  add(other: Polynomial): Polynomial {
    const maxLength = Math.max(
      this.coefficients.length,
      other.coefficients.length
    );
    const result: number[] = [];

    for (let i = 0; i < maxLength; i++) {
      const a = i < this.coefficients.length ? this.coefficients[i] : 0;
      const b = i < other.coefficients.length ? other.coefficients[i] : 0;
      result.push(a + b);
    }

    return new Polynomial(result);
  }

  /**
   * 多项式减法
   */
  subtract(other: Polynomial): Polynomial {
    const maxLength = Math.max(
      this.coefficients.length,
      other.coefficients.length
    );
    const result: number[] = [];

    for (let i = 0; i < maxLength; i++) {
      const a = i < this.coefficients.length ? this.coefficients[i] : 0;
      const b = i < other.coefficients.length ? other.coefficients[i] : 0;
      result.push(a - b);
    }

    return new Polynomial(result);
  }

  /**
   * 朴素多项式乘法 O(n²)
   */
  multiplyNaive(other: Polynomial): Polynomial {
    if (this.coefficients.length === 0 || other.coefficients.length === 0) {
      return new Polynomial([]);
    }

    const resultLength =
      this.coefficients.length + other.coefficients.length - 1;
    const result = new Array(resultLength).fill(0);

    for (let i = 0; i < this.coefficients.length; i++) {
      for (let j = 0; j < other.coefficients.length; j++) {
        result[i + j] += this.coefficients[i] * other.coefficients[j];
      }
    }

    return new Polynomial(result);
  }

  /**
   * 移除前导零
   */
  private removeLeadingZeros(): void {
    while (
      this.coefficients.length > 1 &&
      Math.abs(this.coefficients[this.coefficients.length - 1]) < 1e-15
    ) {
      this.coefficients.pop();
    }

    if (this.coefficients.length === 0) {
      this.coefficients = [0];
    }
  }

  /**
   * 多项式的字符串表示
   */
  toString(): string {
    if (this.coefficients.length === 0) return "0";

    const terms: string[] = [];

    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      const coeff = this.coefficients[i];
      if (Math.abs(coeff) < 1e-15) continue;

      let term = "";

      if (i === 0) {
        term = coeff.toString();
      } else if (i === 1) {
        if (Math.abs(coeff - 1) < 1e-15) {
          term = "x";
        } else if (Math.abs(coeff + 1) < 1e-15) {
          term = "-x";
        } else {
          term = `${coeff}x`;
        }
      } else {
        if (Math.abs(coeff - 1) < 1e-15) {
          term = `x^${i}`;
        } else if (Math.abs(coeff + 1) < 1e-15) {
          term = `-x^${i}`;
        } else {
          term = `${coeff}x^${i}`;
        }
      }

      if (terms.length > 0 && coeff > 0) {
        term = "+" + term;
      }

      terms.push(term);
    }

    return terms.length > 0 ? terms.join("") : "0";
  }
}

/**
 * 快速傅里叶变换 (FFT)
 * 时间复杂度: O(n log n)
 */
export function fft(input: Complex[]): Complex[] {
  const n = input.length;

  // 基础情况
  if (n <= 1) {
    return [...input];
  }

  // 确保n是2的幂
  if ((n & (n - 1)) !== 0) {
    throw new Error("FFT要求输入长度为2的幂");
  }

  // 分治：分离奇偶位置的元素
  const even: Complex[] = [];
  const odd: Complex[] = [];

  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      even.push(input[i]);
    } else {
      odd.push(input[i]);
    }
  }

  // 递归计算
  const evenFFT = fft(even);
  const oddFFT = fft(odd);

  // 合并结果
  const result = new Array(n);
  const halfN = n / 2;

  for (let k = 0; k < halfN; k++) {
    // 计算单位根: ω_n^k = e^(-2πik/n)
    const angle = (-2 * Math.PI * k) / n;
    const twiddle = Complex.euler(angle);

    const oddPart = twiddle.multiply(oddFFT[k]);

    result[k] = evenFFT[k].add(oddPart);
    result[k + halfN] = evenFFT[k].subtract(oddPart);
  }

  return result;
}

/**
 * 快速傅里叶逆变换 (IFFT)
 * 时间复杂度: O(n log n)
 */
export function ifft(input: Complex[]): Complex[] {
  const n = input.length;

  // 对输入取共轭
  const conjugated = input.map((c) => c.conjugate());

  // 执行FFT
  const fftResult = fft(conjugated);

  // 对结果取共轭并除以n
  return fftResult.map((c) => c.conjugate().divide(new Complex(n, 0)));
}

/**
 * 将数组长度补齐到最近的2的幂
 */
function padToPowerOfTwo(arr: number[]): number[] {
  const n = arr.length;
  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(n)));

  const result = [...arr];
  while (result.length < powerOfTwo) {
    result.push(0);
  }

  return result;
}

/**
 * 使用FFT进行多项式乘法
 * 时间复杂度: O(n log n)
 */
export function polynomialMultiplyFFT(a: number[], b: number[]): number[] {
  if (a.length === 0 || b.length === 0) {
    return [];
  }

  // 结果多项式的度数
  const resultDegree = a.length + b.length - 1;

  // 将数组长度补齐到至少resultDegree，且为2的幂
  const paddedLength = Math.pow(2, Math.ceil(Math.log2(resultDegree)));

  const paddedA = [...a];
  const paddedB = [...b];

  while (paddedA.length < paddedLength) paddedA.push(0);
  while (paddedB.length < paddedLength) paddedB.push(0);

  // 转换为复数数组
  const complexA = paddedA.map((x) => new Complex(x, 0));
  const complexB = paddedB.map((x) => new Complex(x, 0));

  // 执行FFT
  const fftA = fft(complexA);
  const fftB = fft(complexB);

  // 点乘
  const fftProduct = fftA.map((a, i) => a.multiply(fftB[i]));

  // 逆FFT
  const ifftResult = ifft(fftProduct);

  // 提取实部并舍入到最近的整数
  const result = ifftResult
    .slice(0, resultDegree)
    .map((c) => Math.round(c.real));

  return result;
}

/**
 * 多项式乘法（封装类）
 */
export function polynomialMultiply(p1: Polynomial, p2: Polynomial): Polynomial {
  const result = polynomialMultiplyFFT(p1.coefficients, p2.coefficients);
  return new Polynomial(result);
}

/**
 * 大整数乘法（使用FFT）
 */
export function bigIntegerMultiply(a: string, b: string): string {
  // 将字符串转换为数字数组（低位在前）
  const digitsA = a
    .split("")
    .reverse()
    .map((d) => parseInt(d, 10));
  const digitsB = b
    .split("")
    .reverse()
    .map((d) => parseInt(d, 10));

  // 使用FFT进行乘法
  const product = polynomialMultiplyFFT(digitsA, digitsB);

  // 处理进位
  let carry = 0;
  for (let i = 0; i < product.length; i++) {
    const sum = product[i] + carry;
    product[i] = sum % 10;
    carry = Math.floor(sum / 10);
  }

  while (carry > 0) {
    product.push(carry % 10);
    carry = Math.floor(carry / 10);
  }

  // 移除前导零并转换回字符串
  while (product.length > 1 && product[product.length - 1] === 0) {
    product.pop();
  }

  return product.reverse().join("");
}

/**
 * 离散卷积（使用FFT）
 */
export function convolution(signal1: number[], signal2: number[]): number[] {
  return polynomialMultiplyFFT(signal1, signal2);
}

/**
 * 循环卷积
 */
export function circularConvolution(
  signal1: number[],
  signal2: number[]
): number[] {
  const n = Math.max(signal1.length, signal2.length);

  // 将两个信号补齐到相同长度
  const paddedSignal1 = [...signal1];
  const paddedSignal2 = [...signal2];

  while (paddedSignal1.length < n) paddedSignal1.push(0);
  while (paddedSignal2.length < n) paddedSignal2.push(0);

  // 使用FFT计算
  const result = polynomialMultiplyFFT(paddedSignal1, paddedSignal2);

  // 对于循环卷积，将结果模n
  const circularResult = new Array(n).fill(0);
  for (let i = 0; i < result.length; i++) {
    circularResult[i % n] += result[i];
  }

  return circularResult;
}

/**
 * 数论变换 (Number Theoretic Transform, NTT)
 * 用于整数运算，避免浮点误差
 */
export class NumberTheoreticTransform {
  private static readonly MOD = 998244353; // 常用的NTT模数
  private static readonly ROOT = 3; // 原根

  /**
   * 快速幂模运算
   */
  private static modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base %= mod;

    while (exp > 0) {
      if (exp & 1) {
        result = (result * base) % mod;
      }
      base = (base * base) % mod;
      exp >>= 1;
    }

    return result;
  }

  /**
   * 数论变换
   */
  static ntt(input: number[]): number[] {
    const n = input.length;
    const MOD = NumberTheoreticTransform.MOD;
    const ROOT = NumberTheoreticTransform.ROOT;

    if ((n & (n - 1)) !== 0) {
      throw new Error("NTT要求输入长度为2的幂");
    }

    const result = [...input];

    // 位逆序排列
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) {
        j ^= bit;
      }
      j ^= bit;

      if (i < j) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    // 蝶形运算
    for (let len = 2; len <= n; len <<= 1) {
      const w = NumberTheoreticTransform.modPow(ROOT, (MOD - 1) / len, MOD);

      for (let i = 0; i < n; i += len) {
        let wn = 1;

        for (let j = 0; j < len / 2; j++) {
          const u = result[i + j];
          const v = (result[i + j + len / 2] * wn) % MOD;

          result[i + j] = (u + v) % MOD;
          result[i + j + len / 2] = (u - v + MOD) % MOD;

          wn = (wn * w) % MOD;
        }
      }
    }

    return result;
  }

  /**
   * 数论逆变换
   */
  static intt(input: number[]): number[] {
    const n = input.length;
    const MOD = NumberTheoreticTransform.MOD;
    const ROOT = NumberTheoreticTransform.ROOT;

    // 使用逆根进行变换
    const invRoot = NumberTheoreticTransform.modPow(ROOT, MOD - 2, MOD);
    const result = [...input];

    // 位逆序排列
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) {
        j ^= bit;
      }
      j ^= bit;

      if (i < j) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    // 蝶形运算
    for (let len = 2; len <= n; len <<= 1) {
      const w = NumberTheoreticTransform.modPow(invRoot, (MOD - 1) / len, MOD);

      for (let i = 0; i < n; i += len) {
        let wn = 1;

        for (let j = 0; j < len / 2; j++) {
          const u = result[i + j];
          const v = (result[i + j + len / 2] * wn) % MOD;

          result[i + j] = (u + v) % MOD;
          result[i + j + len / 2] = (u - v + MOD) % MOD;

          wn = (wn * w) % MOD;
        }
      }
    }

    // 除以n
    const invN = NumberTheoreticTransform.modPow(n, MOD - 2, MOD);
    return result.map((x) => (x * invN) % MOD);
  }

  /**
   * 使用NTT进行多项式乘法
   */
  static polynomialMultiplyNTT(a: number[], b: number[]): number[] {
    if (a.length === 0 || b.length === 0) {
      return [];
    }

    const resultLength = a.length + b.length - 1;
    const paddedLength = Math.pow(2, Math.ceil(Math.log2(resultLength)));

    const paddedA = [...a];
    const paddedB = [...b];

    while (paddedA.length < paddedLength) paddedA.push(0);
    while (paddedB.length < paddedLength) paddedB.push(0);

    const nttA = NumberTheoreticTransform.ntt(paddedA);
    const nttB = NumberTheoreticTransform.ntt(paddedB);

    const nttProduct = nttA.map(
      (a, i) => (a * nttB[i]) % NumberTheoreticTransform.MOD
    );

    const result = NumberTheoreticTransform.intt(nttProduct);

    return result.slice(0, resultLength);
  }
}

/**
 * FFT工具类
 */
export class FFTUtils {
  /**
   * 生成测试用多项式
   */
  static generateTestPolynomial(degree: number, maxCoeff = 10): Polynomial {
    const coefficients: number[] = [];
    for (let i = 0; i <= degree; i++) {
      coefficients.push(Math.floor(Math.random() * maxCoeff * 2) - maxCoeff);
    }
    return new Polynomial(coefficients);
  }

  /**
   * 验证FFT的正确性
   */
  static validateFFT(): void {
    console.log("=== FFT正确性验证 ===\n");

    const sizes = [4, 8, 16, 32];

    for (const size of sizes) {
      console.log(`--- 长度: ${size} ---`);

      // 生成随机复数数组
      const input = Array.from(
        { length: size },
        () => new Complex(Math.random() * 10 - 5, Math.random() * 10 - 5)
      );

      // 执行FFT和IFFT
      const fftResult = fft(input);
      const ifftResult = ifft(fftResult);

      // 验证FFT -> IFFT是否恢复原始输入
      let maxError = 0;
      for (let i = 0; i < size; i++) {
        const error = input[i].subtract(ifftResult[i]).magnitude();
        maxError = Math.max(maxError, error);
      }

      console.log(`  最大误差: ${maxError.toFixed(10)}`);
      console.log(`  验证结果: ${maxError < 1e-10 ? "✅" : "❌"}`);
    }
  }

  /**
   * 多项式乘法性能测试
   */
  static performanceTest(): void {
    console.log("\n=== 多项式乘法性能测试 ===\n");

    const degrees = [50, 100, 200, 500];

    for (const degree of degrees) {
      console.log(`--- 多项式度数: ${degree} ---`);

      const p1 = FFTUtils.generateTestPolynomial(degree);
      const p2 = FFTUtils.generateTestPolynomial(degree);

      // 朴素算法
      const naiveStart = performance.now();
      const naiveResult = p1.multiplyNaive(p2);
      const naiveTime = performance.now() - naiveStart;

      // FFT算法
      const fftStart = performance.now();
      const fftResult = polynomialMultiply(p1, p2);
      const fftTime = performance.now() - fftStart;

      // 验证结果一致性
      const isEqual =
        naiveResult.coefficients.length === fftResult.coefficients.length &&
        naiveResult.coefficients.every(
          (coeff, i) => Math.abs(coeff - fftResult.coefficients[i]) < 1e-10
        );

      console.log(`  朴素算法: ${naiveTime.toFixed(2)}ms`);
      console.log(`  FFT算法: ${fftTime.toFixed(2)}ms`);
      console.log(`  加速比: ${(naiveTime / fftTime).toFixed(2)}x`);
      console.log(`  结果一致性: ${isEqual ? "✅" : "❌"}`);
      console.log();
    }
  }

  /**
   * 大整数乘法演示
   */
  static demonstrateBigIntegerMultiply(): void {
    console.log("=== 大整数乘法演示 ===\n");

    const testCases = [
      { a: "123456789", b: "987654321" },
      { a: "12345678901234567890", b: "98765432109876543210" },
      { a: "999999999999999999", b: "999999999999999999" },
    ];

    for (const testCase of testCases) {
      console.log(`${testCase.a} × ${testCase.b}`);

      // 使用JavaScript的BigInt作为参考
      const expected = (BigInt(testCase.a) * BigInt(testCase.b)).toString();

      // 使用FFT算法
      const fftResult = bigIntegerMultiply(testCase.a, testCase.b);

      console.log(`期望结果: ${expected}`);
      console.log(`FFT结果:  ${fftResult}`);
      console.log(`验证: ${expected === fftResult ? "✅" : "❌"}`);
      console.log();
    }
  }

  /**
   * 卷积运算演示
   */
  static demonstrateConvolution(): void {
    console.log("=== 卷积运算演示 ===\n");

    const signal1 = [1, 2, 3, 4];
    const signal2 = [0.5, 1, 0.5];

    console.log(`信号1: [${signal1.join(", ")}]`);
    console.log(`信号2: [${signal2.join(", ")}]`);

    const linearConv = convolution(signal1, signal2);
    const circularConv = circularConvolution(signal1, signal2);

    console.log(
      `线性卷积: [${linearConv.map((x) => x.toFixed(2)).join(", ")}]`
    );
    console.log(
      `循环卷积: [${circularConv.map((x) => x.toFixed(2)).join(", ")}]`
    );
  }

  /**
   * 综合演示
   */
  static demonstrate(): void {
    console.log("=== FFT和多项式运算综合演示 ===\n");

    // 创建测试多项式
    const p1 = new Polynomial([1, 2, 3]); // 1 + 2x + 3x²
    const p2 = new Polynomial([4, 5, 6]); // 4 + 5x + 6x²

    console.log("多项式P1:", p1.toString());
    console.log("多项式P2:", p2.toString());

    // 多项式运算
    console.log("\n--- 多项式运算 ---");
    console.log("P1 + P2:", p1.add(p2).toString());
    console.log("P1 - P2:", p1.subtract(p2).toString());
    console.log("P1 × P2 (朴素):", p1.multiplyNaive(p2).toString());
    console.log("P1 × P2 (FFT):", polynomialMultiply(p1, p2).toString());

    // 多项式求值
    console.log("\n--- 多项式求值 ---");
    const x = 2;
    console.log(`P1(${x}) = ${p1.evaluate(x)}`);
    console.log(`P1(${x}) (Horner) = ${p1.evaluateHorner(x)}`);

    // 复数运算演示
    console.log("\n--- 复数运算 ---");
    const c1 = new Complex(3, 4);
    const c2 = new Complex(1, 2);

    console.log(`c1 = ${c1.toString()}`);
    console.log(`c2 = ${c2.toString()}`);
    console.log(`c1 + c2 = ${c1.add(c2).toString()}`);
    console.log(`c1 × c2 = ${c1.multiply(c2).toString()}`);
    console.log(`|c1| = ${c1.magnitude().toFixed(4)}`);
    console.log(`arg(c1) = ${c1.phase().toFixed(4)}`);

    // FFT验证
    FFTUtils.validateFFT();

    // 性能测试
    FFTUtils.performanceTest();

    // 大整数乘法演示
    FFTUtils.demonstrateBigIntegerMultiply();

    // 卷积演示
    FFTUtils.demonstrateConvolution();
  }
}
