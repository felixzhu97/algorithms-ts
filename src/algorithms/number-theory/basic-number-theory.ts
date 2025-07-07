/**
 * 基础数论算法实现
 * 《算法导论》第31章 数论算法
 */

/**
 * 欧几里得算法求最大公约数
 * 时间复杂度: O(log min(a, b))
 */
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * 递归版本的欧几里得算法
 */
export function gcdRecursive(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcdRecursive(b, a % b);
}

/**
 * 扩展欧几里得算法
 * 求解 ax + by = gcd(a, b) 的整数解
 */
export interface ExtendedGCDResult {
  gcd: number;
  x: number;
  y: number;
}

export function extendedGCD(a: number, b: number): ExtendedGCDResult {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }

  const result = extendedGCD(b, a % b);
  const x = result.y;
  const y = result.x - Math.floor(a / b) * result.y;

  return { gcd: result.gcd, x, y };
}

/**
 * 计算最小公倍数
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * 计算模逆元
 * 求 a 在模 m 下的逆元，即求 x 使得 ax ≡ 1 (mod m)
 */
export function modularInverse(a: number, m: number): number | null {
  const result = extendedGCD(a, m);
  if (result.gcd !== 1) {
    return null; // 不存在模逆元
  }
  return ((result.x % m) + m) % m;
}

/**
 * 模幂运算
 * 计算 (base^exponent) mod modulus
 * 时间复杂度: O(log exponent)
 */
export function modularExponentiation(
  base: number,
  exponent: number,
  modulus: number
): number {
  if (modulus === 1) return 0;

  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}

/**
 * 素性检测 - 试除法
 * 时间复杂度: O(√n)
 */
export function isPrimeTrial(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
  }

  return true;
}

/**
 * 埃拉托色尼筛法
 * 生成 n 以内的所有素数
 * 时间复杂度: O(n log log n)
 */
export function sieveOfEratosthenes(n: number): number[] {
  if (n < 2) return [];

  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  return primes;
}

/**
 * Miller-Rabin 素性检测
 * 概率性算法，错误率约为 4^(-k)
 */
export function millerRabinTest(n: number, k: number = 5): boolean {
  if (n === 2 || n === 3) return true;
  if (n < 2 || n % 2 === 0) return false;

  // 将 n-1 写成 d * 2^r 的形式
  let d = n - 1;
  let r = 0;
  while (d % 2 === 0) {
    d /= 2;
    r++;
  }

  // 进行 k 轮测试
  for (let i = 0; i < k; i++) {
    const a = 2 + Math.floor(Math.random() * (n - 4));
    let x = modularExponentiation(a, d, n);

    if (x === 1 || x === n - 1) continue;

    let composite = true;
    for (let j = 0; j < r - 1; j++) {
      x = modularExponentiation(x, 2, n);
      if (x === n - 1) {
        composite = false;
        break;
      }
    }

    if (composite) return false;
  }

  return true;
}

/**
 * 计算欧拉函数 φ(n)
 * φ(n) 表示小于等于 n 且与 n 互质的正整数个数
 */
export function eulerTotient(n: number): number {
  let result = n;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      // i 是 n 的质因子
      while (n % i === 0) {
        n /= i;
      }
      result -= result / i;
    }
  }

  if (n > 1) {
    result -= result / n;
  }

  return Math.floor(result);
}

/**
 * 中国剩余定理
 * 求解同余方程组的解
 */
export function chineseRemainderTheorem(
  remainders: number[],
  moduli: number[]
): number | null {
  if (remainders.length !== moduli.length) {
    throw new Error("余数和模数数组长度不匹配");
  }

  // 检查模数是否两两互质
  for (let i = 0; i < moduli.length; i++) {
    for (let j = i + 1; j < moduli.length; j++) {
      if (gcd(moduli[i], moduli[j]) !== 1) {
        return null; // 模数不互质，无解
      }
    }
  }

  const n = moduli.length;
  const M = moduli.reduce((a, b) => a * b, 1);
  let x = 0;

  for (let i = 0; i < n; i++) {
    const Mi = M / moduli[i];
    const yi = modularInverse(Mi, moduli[i]);

    if (yi === null) {
      return null; // 无法找到模逆元
    }

    x = (x + remainders[i] * Mi * yi) % M;
  }

  return (x + M) % M;
}
