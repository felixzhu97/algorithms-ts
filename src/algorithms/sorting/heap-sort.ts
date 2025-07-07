import { CompareFn, defaultCompare, SortResult } from "../../types";
import { MaxHeap } from "../../data-structures/trees/heap";

/**
 * 堆排序
 * 《算法导论》第6章 堆排序
 *
 * 堆排序是一种选择排序，它利用堆这种数据结构来设计的一种排序算法。
 * 堆排序的基本思想是将待排序的序列构造成一个大顶堆，此时，整个序列的最大值就是堆顶的根节点。
 * 将它移走（其实就是将其与堆数组的末尾元素交换），然后将剩余的n-1个序列重新构造成一个堆，
 * 这样就会得到n个元素的次小值。如此反复执行，便能得到一个有序序列了。
 *
 * 时间复杂度：
 * - 最佳情况：O(n log n)
 * - 平均情况：O(n log n)
 * - 最坏情况：O(n log n)
 * 空间复杂度：O(1) - 原地排序
 *
 * 稳定性：不稳定排序
 * 适用场景：对时间复杂度要求稳定，空间复杂度要求较高的场景
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数，默认为数字比较
 * @returns 排序结果包含统计信息
 */
export function heapSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  const result = [...arr];
  let comparisons = 0;
  let swaps = 0;

  if (result.length <= 1) {
    return {
      sorted: result,
      comparisons,
      swaps,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
    };
  }

  /**
   * 获取父节点索引
   */
  function getParent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  /**
   * 获取左子节点索引
   */
  function getLeftChild(i: number): number {
    return 2 * i + 1;
  }

  /**
   * 获取右子节点索引
   */
  function getRightChild(i: number): number {
    return 2 * i + 2;
  }

  /**
   * 交换数组中的两个元素
   */
  function swap(i: number, j: number): void {
    if (i !== j) {
      [result[i], result[j]] = [result[j], result[i]];
      swaps++;
    }
  }

  /**
   * 堆化操作（维护最大堆性质）
   * @param heapSize 堆的大小
   * @param i 要堆化的节点索引
   */
  function maxHeapify(heapSize: number, i: number): void {
    const left = getLeftChild(i);
    const right = getRightChild(i);
    let largest = i;

    // 找到当前节点、左子节点、右子节点中的最大值
    if (left < heapSize) {
      comparisons++;
      if (compareFn(result[left], result[largest]) > 0) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparisons++;
      if (compareFn(result[right], result[largest]) > 0) {
        largest = right;
      }
    }

    // 如果最大值不是当前节点，则交换并继续堆化
    if (largest !== i) {
      swap(i, largest);
      maxHeapify(heapSize, largest);
    }
  }

  /**
   * 构建最大堆
   * 从最后一个非叶子节点开始，自底向上进行堆化
   */
  function buildMaxHeap(): void {
    const lastParent = Math.floor((result.length - 2) / 2);
    for (let i = lastParent; i >= 0; i--) {
      maxHeapify(result.length, i);
    }
  }

  // 第一步：构建最大堆
  buildMaxHeap();

  // 第二步：逐一取出堆顶元素，放到数组末尾
  for (let i = result.length - 1; i > 0; i--) {
    // 将堆顶元素（最大值）与当前未排序部分的最后一个元素交换
    swap(0, i);

    // 调整堆，使剩余元素重新满足最大堆性质
    maxHeapify(i, 0);
  }

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
  };
}

/**
 * 使用堆数据结构的堆排序（非原地排序）
 * 这种实现更直观，但需要额外的空间
 *
 * @param arr 要排序的数组
 * @param compareFn 比较函数
 * @returns 排序结果
 */
export function heapSortWithHeapClass<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): SortResult<T> {
  if (arr.length <= 1) {
    return {
      sorted: [...arr],
      comparisons: 0,
      swaps: 0,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
    };
  }

  const heap = new MaxHeap(compareFn);
  const result: T[] = [];
  let comparisons = 0;
  let swaps = 0;

  // 将所有元素插入堆中
  for (const item of arr) {
    heap.insert(item);
  }

  // 依次取出堆顶元素（最大值），由于我们要得到升序数组，
  // 所以需要将最大值放在结果数组的末尾
  while (!heap.isEmpty()) {
    result.unshift(heap.extract());
    swaps++; // 计算插入操作
  }

  return {
    sorted: result,
    comparisons,
    swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  };
}

/**
 * 原地堆排序（修改原数组）
 *
 * @param arr 要排序的数组（会被修改）
 * @param compareFn 比较函数
 */
export function heapSortInPlace<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): void {
  if (arr.length <= 1) return;

  /**
   * 堆化操作
   */
  function maxHeapify(heapSize: number, i: number): void {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < heapSize && compareFn(arr[left], arr[largest]) > 0) {
      largest = left;
    }

    if (right < heapSize && compareFn(arr[right], arr[largest]) > 0) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      maxHeapify(heapSize, largest);
    }
  }

  /**
   * 构建最大堆
   */
  function buildMaxHeap(): void {
    const lastParent = Math.floor((arr.length - 2) / 2);
    for (let i = lastParent; i >= 0; i--) {
      maxHeapify(arr.length, i);
    }
  }

  // 构建最大堆
  buildMaxHeap();

  // 堆排序
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    maxHeapify(i, 0);
  }
}

/**
 * 堆排序的变体：Top-K 问题
 * 找到数组中最大的k个元素
 *
 * @param arr 输入数组
 * @param k 要找的元素个数
 * @param compareFn 比较函数
 * @returns 最大的k个元素（按降序排列）
 */
export function findTopK<T>(
  arr: T[],
  k: number,
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): T[] {
  if (k <= 0 || arr.length === 0) return [];
  if (k >= arr.length) {
    return heapSort(arr, compareFn).sorted.reverse(); // 降序
  }

  const heap = new MaxHeap(compareFn);

  // 将所有元素加入堆
  for (const item of arr) {
    heap.insert(item);
  }

  // 取出前k个最大元素
  const result: T[] = [];
  for (let i = 0; i < k && !heap.isEmpty(); i++) {
    result.push(heap.extract());
  }

  return result;
}

/**
 * 堆排序的另一种变体：使用最小堆找最大的k个元素
 * 这种方法在k << n时更高效
 *
 * @param arr 输入数组
 * @param k 要找的元素个数
 * @param compareFn 比较函数
 * @returns 最大的k个元素
 */
export function findTopKEfficient<T>(
  arr: T[],
  k: number,
  compareFn: CompareFn<T> = defaultCompare as CompareFn<T>
): T[] {
  if (k <= 0 || arr.length === 0) return [];
  if (k >= arr.length) {
    return heapSort(arr, compareFn).sorted.reverse();
  }

  // 使用最小堆，反转比较函数
  const minHeapCompareFn: CompareFn<T> = (a, b) => -compareFn(a, b);
  const heap = new MaxHeap(minHeapCompareFn); // 实际上是最小堆

  // 处理前k个元素
  for (let i = 0; i < k; i++) {
    heap.insert(arr[i]);
  }

  // 处理剩余元素
  for (let i = k; i < arr.length; i++) {
    if (compareFn(arr[i], heap.peek()!) > 0) {
      heap.extract();
      heap.insert(arr[i]);
    }
  }

  // 取出所有元素并排序
  const result: T[] = [];
  while (!heap.isEmpty()) {
    result.push(heap.extract());
  }

  return result.reverse(); // 转为降序
}
