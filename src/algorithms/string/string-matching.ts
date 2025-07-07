/**
 * 字符串匹配算法实现
 * 《算法导论》第32章 字符串算法
 */

/**
 * 朴素字符串匹配算法
 * 时间复杂度: O(nm) 其中n是文本长度，m是模式长度
 * 空间复杂度: O(1)
 */
export function naiveStringMatching(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) {
      matches.push(i);
    }
  }

  return matches;
}

/**
 * Rabin-Karp 字符串匹配算法
 * 使用滚动哈希技术
 * 平均时间复杂度: O(n + m)
 * 最坏时间复杂度: O(nm)
 */
export function rabinKarpMatching(
  text: string,
  pattern: string,
  prime: number = 101
): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  const d = 256; // 字符集大小

  if (m > n) return matches;

  let patternHash = 0;
  let textHash = 0;
  let h = 1;

  // 计算 h = d^(m-1) mod prime
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % prime;
  }

  // 计算模式和文本第一个窗口的哈希值
  for (let i = 0; i < m; i++) {
    patternHash = (d * patternHash + pattern.charCodeAt(i)) % prime;
    textHash = (d * textHash + text.charCodeAt(i)) % prime;
  }

  // 滑动窗口
  for (let i = 0; i <= n - m; i++) {
    // 检查哈希值是否相等
    if (patternHash === textHash) {
      // 验证字符是否完全匹配
      let j = 0;
      while (j < m && text[i + j] === pattern[j]) {
        j++;
      }
      if (j === m) {
        matches.push(i);
      }
    }

    // 计算下一个窗口的哈希值
    if (i < n - m) {
      textHash =
        (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) %
        prime;

      // 确保哈希值为正数
      if (textHash < 0) {
        textHash += prime;
      }
    }
  }

  return matches;
}

/**
 * 计算KMP算法的失效函数（部分匹配表）
 */
function computeKMPFailureFunction(pattern: string): number[] {
  const m = pattern.length;
  const failure = new Array(m).fill(0);
  let k = 0;

  for (let q = 1; q < m; q++) {
    while (k > 0 && pattern[k] !== pattern[q]) {
      k = failure[k - 1];
    }
    if (pattern[k] === pattern[q]) {
      k++;
    }
    failure[q] = k;
  }

  return failure;
}

/**
 * KMP (Knuth-Morris-Pratt) 字符串匹配算法
 * 时间复杂度: O(n + m)
 * 空间复杂度: O(m)
 */
export function kmpMatching(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return matches;

  const failure = computeKMPFailureFunction(pattern);
  let q = 0;

  for (let i = 0; i < n; i++) {
    while (q > 0 && pattern[q] !== text[i]) {
      q = failure[q - 1];
    }
    if (pattern[q] === text[i]) {
      q++;
    }
    if (q === m) {
      matches.push(i - m + 1);
      q = failure[q - 1];
    }
  }

  return matches;
}

/**
 * Boyer-Moore 算法的坏字符启发式
 */
function computeBadCharacterHeuristic(pattern: string): Map<string, number> {
  const badChar = new Map<string, number>();
  const m = pattern.length;

  for (let i = 0; i < m; i++) {
    badChar.set(pattern[i], i);
  }

  return badChar;
}

/**
 * Boyer-Moore 字符串匹配算法（简化版，仅使用坏字符启发式）
 * 平均时间复杂度: O(n/m)
 * 最坏时间复杂度: O(nm)
 */
export function boyerMooreMatching(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return matches;

  const badChar = computeBadCharacterHeuristic(pattern);
  let s = 0; // 偏移量

  while (s <= n - m) {
    let j = m - 1;

    // 从模式的右端开始匹配
    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
    }

    if (j < 0) {
      // 找到匹配
      matches.push(s);

      // 移动模式
      const nextChar = s + m < n ? text[s + m] : "";
      const shift = badChar.get(nextChar);
      s += m - (shift !== undefined ? shift : -1);
    } else {
      // 使用坏字符启发式移动模式
      const badCharIndex = badChar.get(text[s + j]);
      s += Math.max(1, j - (badCharIndex !== undefined ? badCharIndex : -1));
    }
  }

  return matches;
}
