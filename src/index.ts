/**
 * 《算法导论》TypeScript 实现
 * 主入口文件
 */

// 导入算法和数据结构（用于内部使用）
import { Stack } from "./data-structures/basic/stack";
import { Queue } from "./data-structures/basic/queue";
import { LinkedList } from "./data-structures/basic/linked-list";
import { insertionSort } from "./algorithms/sorting/insertion-sort";
import { mergeSort } from "./algorithms/sorting/merge-sort";
import {
  quickSort,
  randomizedQuickSort,
  threeWayQuickSort,
} from "./algorithms/sorting/quick-sort";
import { heapSort } from "./algorithms/sorting/heap-sort";

// 数据结构导出
export { Stack } from "./data-structures/basic/stack";
export { Queue, Deque } from "./data-structures/basic/queue";
export {
  LinkedList,
  DoublyLinkedList,
  ListNode,
  DoublyListNode,
} from "./data-structures/basic/linked-list";
export {
  Heap,
  MaxHeap,
  MinHeap,
  PriorityQueue,
} from "./data-structures/trees/heap";

// 排序算法
export {
  insertionSort,
  binaryInsertionSort,
  insertionSortInPlace,
} from "./algorithms/sorting/insertion-sort";

export {
  mergeSort,
  mergeSortBottomUp,
  kWayMergeSort,
} from "./algorithms/sorting/merge-sort";

export {
  quickSort,
  quickSortHoare,
  randomizedQuickSort,
  threeWayQuickSort,
  iterativeQuickSort,
} from "./algorithms/sorting/quick-sort";

export {
  heapSort,
  heapSortWithHeapClass,
  heapSortInPlace,
  findTopK,
  findTopKEfficient,
} from "./algorithms/sorting/heap-sort";

export {
  countingSort,
  radixSort,
  bucketSort,
  bucketSortInteger,
  radixSortString,
} from "./algorithms/sorting/linear-sorts";

// 类型定义
export * from "./types";

/**
 * 算法性能测试和演示
 */
export class AlgorithmDemo {
  /**
   * 生成随机数组用于测试
   */
  static generateRandomArray(
    size: number,
    min: number = 0,
    max: number = 1000
  ): number[] {
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
  }

  /**
   * 生成已排序数组
   */
  static generateSortedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }

  /**
   * 生成逆序数组
   */
  static generateReversedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => size - i - 1);
  }

  /**
   * 生成包含重复元素的数组
   */
  static generateArrayWithDuplicates(
    size: number,
    uniqueElements: number = 10
  ): number[] {
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * uniqueElements));
    }
    return arr;
  }

  /**
   * 验证数组是否已正确排序
   */
  static isSorted<T>(
    arr: T[],
    compareFn: (a: T, b: T) => number = (a, b) => (a as any) - (b as any)
  ): boolean {
    for (let i = 1; i < arr.length; i++) {
      if (compareFn(arr[i - 1], arr[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * 测量算法执行时间
   */
  static measureTime<T>(fn: () => T): { result: T; timeMs: number } {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return {
      result,
      timeMs: end - start,
    };
  }

  /**
   * 运行排序算法比较测试
   */
  static runSortingComparison(arraySize: number = 1000): void {
    console.log(`\n=== 排序算法性能比较 (数组大小: ${arraySize}) ===\n`);

    // 生成测试数据
    const testArrays = {
      random: this.generateRandomArray(arraySize),
      sorted: this.generateSortedArray(arraySize),
      reversed: this.generateReversedArray(arraySize),
      duplicates: this.generateArrayWithDuplicates(arraySize, 50),
    };

    const algorithms = [
      { name: "插入排序", fn: insertionSort },
      { name: "归并排序", fn: mergeSort },
      { name: "快速排序", fn: quickSort },
      { name: "堆排序", fn: heapSort },
      { name: "随机快速排序", fn: randomizedQuickSort },
      { name: "三路快速排序", fn: threeWayQuickSort },
    ];

    Object.entries(testArrays).forEach(([testType, testArray]) => {
      console.log(`\n--- ${testType} 数组测试 ---`);

      algorithms.forEach(({ name, fn }) => {
        const { result: sortResult, timeMs } = this.measureTime(() =>
          fn(testArray)
        );
        const isCorrect = this.isSorted(sortResult.sorted);

        console.log(`${name}:`);
        console.log(`  时间: ${timeMs.toFixed(2)}ms`);
        console.log(`  比较次数: ${sortResult.comparisons}`);
        console.log(`  交换次数: ${sortResult.swaps}`);
        console.log(`  结果正确: ${isCorrect ? "✅" : "❌"}`);
        console.log("");
      });
    });
  }

  /**
   * 演示数据结构的基本操作
   */
  static demonstrateDataStructures(): void {
    console.log("\n=== 数据结构演示 ===\n");

    // 栈演示
    console.log("--- 栈 (Stack) ---");
    const stack = new Stack<number>();
    [1, 2, 3, 4, 5].forEach((item) => stack.push(item));
    console.log(`栈内容: ${stack.toString()}`);
    console.log(`弹出: ${stack.pop()}`);
    console.log(`栈顶: ${stack.peek()}`);
    console.log(`栈大小: ${stack.size()}\n`);

    // 队列演示
    console.log("--- 队列 (Queue) ---");
    const queue = new Queue<string>();
    ["A", "B", "C", "D"].forEach((item) => queue.enqueue(item));
    console.log(`队列内容: ${queue.toString()}`);
    console.log(`出队: ${queue.dequeue()}`);
    console.log(`队首: ${queue.front()}`);
    console.log(`队列大小: ${queue.size()}\n`);

    // 链表演示
    console.log("--- 链表 (LinkedList) ---");
    const list = new LinkedList<number>();
    [10, 20, 30, 40].forEach((item) => list.append(item));
    console.log(`链表内容: ${list.toString()}`);
    list.prepend(5);
    console.log(`前插5后: ${list.toString()}`);
    list.remove(20);
    console.log(`删除20后: ${list.toString()}`);
    list.reverse();
    console.log(`反转后: ${list.toString()}\n`);
  }
}
