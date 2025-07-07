/**
 * 性能测试工具
 */

/**
 * 性能计时器
 */
export class PerformanceTimer {
  private startTime: number = 0;

  /**
   * 开始计时
   */
  start(): void {
    this.startTime = performance.now();
  }

  /**
   * 结束计时并返回耗时（毫秒）
   */
  end(): number {
    return performance.now() - this.startTime;
  }

  /**
   * 测量函数执行时间
   */
  static measure<T>(fn: () => T): { result: T; time: number } {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  }

  /**
   * 多次执行并返回平均时间
   */
  static benchmark<T>(
    fn: () => T,
    iterations: number = 10
  ): {
    averageTime: number;
    minTime: number;
    maxTime: number;
    lastResult: T;
  } {
    const times: number[] = [];
    let lastResult: T;

    for (let i = 0; i < iterations; i++) {
      const { result, time } = this.measure(fn);
      times.push(time);
      lastResult = result;
    }

    return {
      averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      lastResult: lastResult!,
    };
  }
}

/**
 * 格式化时间
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds < 1) {
    return `${(milliseconds * 1000).toFixed(2)}μs`;
  } else if (milliseconds < 1000) {
    return `${milliseconds.toFixed(2)}ms`;
  } else {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  }
}

/**
 * 格式化文件大小
 */
export function formatSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * 内存使用情况（Node.js 环境）
 */
export function getMemoryUsage(): {
  heapUsed: string;
  heapTotal: string;
} | null {
  if (typeof process !== "undefined" && process.memoryUsage) {
    const memUsage = process.memoryUsage();
    return {
      heapUsed: formatSize(memUsage.heapUsed),
      heapTotal: formatSize(memUsage.heapTotal),
    };
  }
  return null;
}
