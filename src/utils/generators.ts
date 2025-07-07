/**
 * 测试数据生成器
 */

import { Edge, WeightedEdge } from "../types";

/**
 * 随机数生成器
 */
export class RandomGenerator {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  /**
   * 生成随机整数 [min, max]
   */
  nextInt(min: number, max: number): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return Math.floor((this.seed / 233280) * (max - min + 1)) + min;
  }

  /**
   * 生成随机浮点数 [0, 1)
   */
  nextFloat(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * 随机打乱数组
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * 数组生成器
 */
export class ArrayGenerator {
  /**
   * 生成随机整数数组
   */
  static randomIntegers(
    size: number,
    min: number = 0,
    max: number = 1000,
    seed?: number
  ): number[] {
    const generator = new RandomGenerator(seed);
    return Array.from({ length: size }, () => generator.nextInt(min, max));
  }

  /**
   * 生成有序数组
   */
  static sorted(size: number, min: number = 0, max: number = 1000): number[] {
    const step = (max - min) / size;
    return Array.from({ length: size }, (_, i) => Math.floor(min + i * step));
  }

  /**
   * 生成逆序数组
   */
  static reversed(size: number, min: number = 0, max: number = 1000): number[] {
    return this.sorted(size, min, max).reverse();
  }

  /**
   * 生成几乎有序的数组（只有少量元素乱序）
   */
  static nearlySorted(
    size: number,
    swapCount: number = 10,
    seed?: number
  ): number[] {
    const array = this.sorted(size);
    const generator = new RandomGenerator(seed);

    for (let i = 0; i < swapCount; i++) {
      const idx1 = generator.nextInt(0, size - 1);
      const idx2 = generator.nextInt(0, size - 1);
      [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
    }

    return array;
  }

  /**
   * 生成包含重复元素的数组
   */
  static withDuplicates(
    size: number,
    uniqueCount: number = 10,
    seed?: number
  ): number[] {
    const generator = new RandomGenerator(seed);
    const uniqueValues = Array.from({ length: uniqueCount }, (_, i) => i);

    return Array.from(
      { length: size },
      () => uniqueValues[generator.nextInt(0, uniqueCount - 1)]
    );
  }
}

/**
 * 图生成器
 */
export class GraphGenerator {
  /**
   * 生成随机无向图
   */
  static randomUndirected(
    vertices: number,
    density: number = 0.5,
    seed?: number
  ): Edge[] {
    const generator = new RandomGenerator(seed);
    const edges: Edge[] = [];

    for (let i = 0; i < vertices; i++) {
      for (let j = i + 1; j < vertices; j++) {
        if (generator.nextFloat() < density) {
          edges.push({ from: i, to: j });
        }
      }
    }

    return edges;
  }

  /**
   * 生成随机有向图
   */
  static randomDirected(
    vertices: number,
    density: number = 0.3,
    seed?: number
  ): Edge[] {
    const generator = new RandomGenerator(seed);
    const edges: Edge[] = [];

    for (let i = 0; i < vertices; i++) {
      for (let j = 0; j < vertices; j++) {
        if (i !== j && generator.nextFloat() < density) {
          edges.push({ from: i, to: j });
        }
      }
    }

    return edges;
  }

  /**
   * 生成随机加权图
   */
  static randomWeighted(
    vertices: number,
    density: number = 0.5,
    minWeight: number = 1,
    maxWeight: number = 100,
    directed: boolean = false,
    seed?: number
  ): WeightedEdge[] {
    const generator = new RandomGenerator(seed);
    const edges: WeightedEdge[] = [];

    for (let i = 0; i < vertices; i++) {
      const start = directed ? 0 : i + 1;
      for (let j = start; j < vertices; j++) {
        if (i !== j && generator.nextFloat() < density) {
          const weight = generator.nextInt(minWeight, maxWeight);
          edges.push({ from: i, to: j, weight });

          if (!directed && i !== j) {
            edges.push({ from: j, to: i, weight });
          }
        }
      }
    }

    return edges;
  }

  /**
   * 生成连通图
   */
  static connected(
    vertices: number,
    extraEdges: number = 0,
    seed?: number
  ): Edge[] {
    const generator = new RandomGenerator(seed);
    const edges: Edge[] = [];

    // 首先创建一个生成树确保连通性
    const vertices_array = Array.from({ length: vertices }, (_, i) => i);
    const shuffled = generator.shuffle(vertices_array);

    for (let i = 0; i < vertices - 1; i++) {
      edges.push({ from: shuffled[i], to: shuffled[i + 1] });
    }

    // 添加额外的边
    for (let i = 0; i < extraEdges; i++) {
      const from = generator.nextInt(0, vertices - 1);
      const to = generator.nextInt(0, vertices - 1);

      if (from !== to) {
        // 避免重复边
        const exists = edges.some(
          (edge) =>
            (edge.from === from && edge.to === to) ||
            (edge.from === to && edge.to === from)
        );

        if (!exists) {
          edges.push({ from, to });
        }
      }
    }

    return edges;
  }

  /**
   * 生成完全图
   */
  static complete(vertices: number, directed: boolean = false): Edge[] {
    const edges: Edge[] = [];

    for (let i = 0; i < vertices; i++) {
      for (let j = directed ? 0 : i + 1; j < vertices; j++) {
        if (i !== j) {
          edges.push({ from: i, to: j });
        }
      }
    }

    return edges;
  }

  /**
   * 生成二分图
   */
  static bipartite(
    leftSize: number,
    rightSize: number,
    density: number = 0.5,
    seed?: number
  ): Edge[] {
    const generator = new RandomGenerator(seed);
    const edges: Edge[] = [];

    for (let i = 0; i < leftSize; i++) {
      for (let j = leftSize; j < leftSize + rightSize; j++) {
        if (generator.nextFloat() < density) {
          edges.push({ from: i, to: j });
        }
      }
    }

    return edges;
  }
}

/**
 * 字符串生成器
 */
export class StringGenerator {
  /**
   * 生成随机字符串
   */
  static random(
    length: number,
    alphabet: string = "abcdefghijklmnopqrstuvwxyz",
    seed?: number
  ): string {
    const generator = new RandomGenerator(seed);
    return Array.from(
      { length },
      () => alphabet[generator.nextInt(0, alphabet.length - 1)]
    ).join("");
  }

  /**
   * 生成DNA序列
   */
  static dnaSequence(length: number, seed?: number): string {
    return this.random(length, "ATCG", seed);
  }

  /**
   * 生成具有模式的字符串
   */
  static withPattern(
    pattern: string,
    repeatCount: number,
    noise: number = 0,
    seed?: number
  ): string {
    const generator = new RandomGenerator(seed);
    let result = pattern.repeat(repeatCount);

    // 添加噪声
    if (noise > 0) {
      const chars = result.split("");
      const noiseCount = Math.floor(chars.length * noise);

      for (let i = 0; i < noiseCount; i++) {
        const index = generator.nextInt(0, chars.length - 1);
        const newChar = String.fromCharCode(generator.nextInt(97, 122)); // a-z
        chars[index] = newChar;
      }

      result = chars.join("");
    }

    return result;
  }
}
