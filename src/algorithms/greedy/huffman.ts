/**
 * 霍夫曼编码算法
 * 《算法导论》第16章 贪心算法
 */

import { Heap } from "../../data-structures/trees/heap";
import { HuffmanNode, HuffmanResult } from "../../types";

/**
 * 霍夫曼编码
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
export function huffmanCoding(text: string): HuffmanResult {
  if (text.length === 0) {
    return {
      codes: new Map(),
      tree: { frequency: 0, isLeaf: true },
      encodedText: "",
      compressionRatio: 0,
    };
  }

  // 统计字符频率
  const frequencyMap = new Map<string, number>();
  for (const char of text) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }

  // 特殊情况：只有一个字符
  if (frequencyMap.size === 1) {
    const char = Array.from(frequencyMap.keys())[0];
    const codes = new Map([[char, "0"]]);

    return {
      codes,
      tree: { char, frequency: frequencyMap.get(char)!, isLeaf: true },
      encodedText: "0".repeat(text.length),
      compressionRatio: (text.length * 8) / text.length,
    };
  }

  // 创建优先队列（最小堆）
  const pq = new Heap<HuffmanNode>((a, b) => a.frequency - b.frequency);

  // 为每个字符创建叶子节点
  for (const [char, frequency] of frequencyMap) {
    pq.insert({
      char,
      frequency,
      isLeaf: true,
    });
  }

  // 构建霍夫曼树
  while (pq.size() > 1) {
    const left = pq.extract()!;
    const right = pq.extract()!;

    const mergedNode: HuffmanNode = {
      frequency: left.frequency + right.frequency,
      left,
      right,
      isLeaf: false,
    };

    pq.insert(mergedNode);
  }

  const root = pq.extract()!;

  // 生成编码表
  const codes = new Map<string, string>();

  function generateCodes(node: HuffmanNode, code: string = ""): void {
    if (node.isLeaf && node.char) {
      codes.set(node.char, code || "0"); // 单字符情况
    } else {
      if (node.left) generateCodes(node.left, code + "0");
      if (node.right) generateCodes(node.right, code + "1");
    }
  }

  generateCodes(root);

  // 编码文本
  const encodedText = text
    .split("")
    .map((char) => codes.get(char)!)
    .join("");

  // 计算压缩比
  const originalBits = text.length * 8; // 假设原始字符用8位表示
  const compressedBits = encodedText.length;
  const compressionRatio = originalBits / compressedBits;

  return {
    codes,
    tree: root,
    encodedText,
    compressionRatio,
  };
}

/**
 * 霍夫曼解码
 */
export function huffmanDecoding(
  encodedText: string,
  tree: HuffmanNode
): string {
  if (!encodedText || tree.isLeaf) {
    return tree.char ? tree.char.repeat(encodedText.length) : "";
  }

  let result = "";
  let current = tree;

  for (const bit of encodedText) {
    if (bit === "0") {
      current = current.left!;
    } else {
      current = current.right!;
    }

    if (current.isLeaf) {
      result += current.char!;
      current = tree;
    }
  }

  return result;
}
