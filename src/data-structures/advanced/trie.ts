/**
 * 字典树 (Trie / Prefix Tree) 实现
 * 高效支持字符串的插入、查找、删除和前缀匹配
 */

/**
 * 字典树节点
 */
class TrieNode {
  public children: Map<string, TrieNode>;
  public isEndOfWord: boolean;
  public count: number; // 以该节点为结尾的单词数量
  public prefixCount: number; // 经过该节点的单词数量

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.count = 0;
    this.prefixCount = 0;
  }
}

/**
 * 字典树类
 */
export class Trie {
  private root: TrieNode;
  private size: number;

  /**
   * 构造函数
   */
  constructor() {
    this.root = new TrieNode();
    this.size = 0;
  }

  /**
   * 插入单词
   * 时间复杂度: O(m)，m为单词长度
   * @param word 要插入的单词
   */
  public insert(word: string): void {
    if (!word) return;

    let current = this.root;
    current.prefixCount++;

    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      current.prefixCount++;
    }

    if (!current.isEndOfWord) {
      current.isEndOfWord = true;
      this.size++;
    }
    current.count++;
  }

  /**
   * 查找单词是否存在
   * 时间复杂度: O(m)，m为单词长度
   * @param word 要查找的单词
   * @returns 是否存在
   */
  public search(word: string): boolean {
    const node = this.getNode(word);
    return node !== null && node.isEndOfWord;
  }

  /**
   * 检查是否存在以给定前缀开头的单词
   * 时间复杂度: O(m)，m为前缀长度
   * @param prefix 前缀
   * @returns 是否存在
   */
  public startsWith(prefix: string): boolean {
    return this.getNode(prefix) !== null;
  }

  /**
   * 删除单词
   * 时间复杂度: O(m)，m为单词长度
   * @param word 要删除的单词
   * @returns 是否成功删除
   */
  public delete(word: string): boolean {
    if (!this.search(word)) {
      return false;
    }

    this.deleteHelper(this.root, word, 0);
    this.size--;
    return true;
  }

  /**
   * 删除单词的递归辅助函数
   * @param node 当前节点
   * @param word 要删除的单词
   * @param index 当前字符索引
   * @returns 是否应该删除当前节点
   */
  private deleteHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      // 到达单词末尾
      if (!node.isEndOfWord) {
        return false;
      }

      node.isEndOfWord = false;
      node.count--;
      node.prefixCount--;

      // 如果没有子节点且不是其他单词的结尾，可以删除
      return node.children.size === 0 && node.count === 0;
    }

    const char = word[index];
    const childNode = node.children.get(char);

    if (!childNode) {
      return false;
    }

    const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
    }

    node.prefixCount--;

    // 如果当前节点不是单词结尾且没有子节点，可以删除
    return !node.isEndOfWord && node.children.size === 0;
  }

  /**
   * 获取指定前缀对应的节点
   * @param prefix 前缀
   * @returns 节点或null
   */
  private getNode(prefix: string): TrieNode | null {
    let current = this.root;

    for (const char of prefix) {
      if (!current.children.has(char)) {
        return null;
      }
      current = current.children.get(char)!;
    }

    return current;
  }

  /**
   * 获取所有以给定前缀开头的单词
   * @param prefix 前缀
   * @returns 单词列表
   */
  public getWordsWithPrefix(prefix: string): string[] {
    const result: string[] = [];
    const prefixNode = this.getNode(prefix);

    if (prefixNode) {
      this.dfsCollectWords(prefixNode, prefix, result);
    }

    return result;
  }

  /**
   * DFS收集以当前节点为根的所有单词
   * @param node 当前节点
   * @param currentWord 当前构建的单词
   * @param result 结果数组
   */
  private dfsCollectWords(
    node: TrieNode,
    currentWord: string,
    result: string[]
  ): void {
    if (node.isEndOfWord) {
      // 如果有重复的单词，根据count添加多次
      for (let i = 0; i < node.count; i++) {
        result.push(currentWord);
      }
    }

    for (const [char, childNode] of node.children) {
      this.dfsCollectWords(childNode, currentWord + char, result);
    }
  }

  /**
   * 获取所有单词
   * @returns 所有单词的列表
   */
  public getAllWords(): string[] {
    return this.getWordsWithPrefix("");
  }

  /**
   * 获取字典树中单词的数量
   * @returns 单词数量
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * 检查字典树是否为空
   * @returns 是否为空
   */
  public isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 清空字典树
   */
  public clear(): void {
    this.root = new TrieNode();
    this.size = 0;
  }

  /**
   * 获取具有给定前缀的单词数量
   * @param prefix 前缀
   * @returns 单词数量
   */
  public countWordsWithPrefix(prefix: string): number {
    const prefixNode = this.getNode(prefix);
    return prefixNode ? prefixNode.prefixCount : 0;
  }

  /**
   * 获取单词在字典树中的出现次数
   * @param word 单词
   * @returns 出现次数
   */
  public getWordCount(word: string): number {
    const node = this.getNode(word);
    return node && node.isEndOfWord ? node.count : 0;
  }

  /**
   * 查找最长公共前缀
   * @returns 最长公共前缀
   */
  public getLongestCommonPrefix(): string {
    let current = this.root;
    let prefix = "";

    while (current.children.size === 1 && !current.isEndOfWord) {
      const entry = current.children.entries().next();
      if (entry.done) break;
      const [char, nextNode] = entry.value;
      prefix += char;
      current = nextNode;
    }

    return prefix;
  }

  /**
   * 获取字典树的高度（最长路径长度）
   * @returns 高度
   */
  public getHeight(): number {
    return this.getHeightHelper(this.root);
  }

  /**
   * 计算高度的递归辅助函数
   * @param node 当前节点
   * @returns 高度
   */
  private getHeightHelper(node: TrieNode): number {
    if (node.children.size === 0) {
      return 0;
    }

    let maxHeight = 0;
    for (const childNode of node.children.values()) {
      maxHeight = Math.max(maxHeight, this.getHeightHelper(childNode));
    }

    return maxHeight + 1;
  }

  /**
   * 获取节点总数
   * @returns 节点数量
   */
  public getNodeCount(): number {
    return this.getNodeCountHelper(this.root);
  }

  /**
   * 计算节点数的递归辅助函数
   * @param node 当前节点
   * @returns 节点数量
   */
  private getNodeCountHelper(node: TrieNode): number {
    let count = 1; // 当前节点
    for (const childNode of node.children.values()) {
      count += this.getNodeCountHelper(childNode);
    }
    return count;
  }

  /**
   * 模糊搜索（支持通配符'?'）
   * @param pattern 搜索模式，'?'匹配任意单个字符
   * @returns 匹配的单词列表
   */
  public wildcardSearch(pattern: string): string[] {
    const result: string[] = [];
    this.wildcardSearchHelper(this.root, pattern, 0, "", result);
    return result;
  }

  /**
   * 模糊搜索的递归辅助函数
   * @param node 当前节点
   * @param pattern 搜索模式
   * @param index 当前模式字符索引
   * @param currentWord 当前构建的单词
   * @param result 结果数组
   */
  private wildcardSearchHelper(
    node: TrieNode,
    pattern: string,
    index: number,
    currentWord: string,
    result: string[]
  ): void {
    if (index === pattern.length) {
      if (node.isEndOfWord) {
        result.push(currentWord);
      }
      return;
    }

    const char = pattern[index];

    if (char === "?") {
      // 通配符，匹配任意字符
      for (const [childChar, childNode] of node.children) {
        this.wildcardSearchHelper(
          childNode,
          pattern,
          index + 1,
          currentWord + childChar,
          result
        );
      }
    } else {
      // 普通字符
      if (node.children.has(char)) {
        this.wildcardSearchHelper(
          node.children.get(char)!,
          pattern,
          index + 1,
          currentWord + char,
          result
        );
      }
    }
  }

  /**
   * 获取编辑距离小于等于k的所有单词
   * @param target 目标单词
   * @param maxDistance 最大编辑距离
   * @returns 匹配的单词及其编辑距离
   */
  public fuzzySearch(
    target: string,
    maxDistance: number
  ): Array<{ word: string; distance: number }> {
    const result: Array<{ word: string; distance: number }> = [];
    const currentRow = Array.from({ length: target.length + 1 }, (_, i) => i);

    this.fuzzySearchHelper(
      this.root,
      "",
      target,
      currentRow,
      maxDistance,
      result
    );
    return result;
  }

  /**
   * 模糊搜索的递归辅助函数
   */
  private fuzzySearchHelper(
    node: TrieNode,
    currentWord: string,
    target: string,
    previousRow: number[],
    maxDistance: number,
    result: Array<{ word: string; distance: number }>
  ): void {
    const columns = target.length + 1;
    const currentRow = [previousRow[0] + 1];

    // 计算当前行
    for (let col = 1; col < columns; col++) {
      const insertCost = currentRow[col - 1] + 1;
      const deleteCost = previousRow[col] + 1;
      let replaceCost = previousRow[col - 1];

      if (target[col - 1] !== currentWord[currentWord.length - 1]) {
        replaceCost++;
      }

      currentRow.push(Math.min(insertCost, deleteCost, replaceCost));
    }

    // 如果是单词结尾且编辑距离在范围内，添加到结果
    if (node.isEndOfWord && currentRow[columns - 1] <= maxDistance) {
      result.push({ word: currentWord, distance: currentRow[columns - 1] });
    }

    // 如果当前行的最小值大于最大距离，剪枝
    if (Math.min(...currentRow) <= maxDistance) {
      for (const [char, childNode] of node.children) {
        this.fuzzySearchHelper(
          childNode,
          currentWord + char,
          target,
          currentRow,
          maxDistance,
          result
        );
      }
    }
  }

  /**
   * 序列化字典树为JSON字符串
   * @returns JSON字符串
   */
  public serialize(): string {
    return JSON.stringify(this.serializeNode(this.root));
  }

  /**
   * 序列化节点的递归辅助函数
   * @param node 当前节点
   * @returns 序列化后的节点对象
   */
  private serializeNode(node: TrieNode): any {
    const obj: any = {
      isEndOfWord: node.isEndOfWord,
      count: node.count,
      prefixCount: node.prefixCount,
      children: {},
    };

    for (const [char, childNode] of node.children) {
      obj.children[char] = this.serializeNode(childNode);
    }

    return obj;
  }

  /**
   * 从JSON字符串反序列化字典树
   * @param data JSON字符串
   * @returns 新的字典树实例
   */
  static deserialize(data: string): Trie {
    const trie = new Trie();
    const obj = JSON.parse(data);
    trie.root = trie.deserializeNode(obj);
    trie.size = trie.calculateSize();
    return trie;
  }

  /**
   * 反序列化节点的递归辅助函数
   * @param obj 节点对象
   * @returns 反序列化后的节点
   */
  private deserializeNode(obj: any): TrieNode {
    const node = new TrieNode();
    node.isEndOfWord = obj.isEndOfWord;
    node.count = obj.count;
    node.prefixCount = obj.prefixCount;

    for (const char in obj.children) {
      node.children.set(char, this.deserializeNode(obj.children[char]));
    }

    return node;
  }

  /**
   * 重新计算字典树大小
   * @returns 单词数量
   */
  private calculateSize(): number {
    return this.calculateSizeHelper(this.root);
  }

  /**
   * 计算大小的递归辅助函数
   * @param node 当前节点
   * @returns 单词数量
   */
  private calculateSizeHelper(node: TrieNode): number {
    let count = node.isEndOfWord ? 1 : 0;
    for (const childNode of node.children.values()) {
      count += this.calculateSizeHelper(childNode);
    }
    return count;
  }
}

/**
 * 字典树工具类
 * 提供演示、测试和性能评估功能
 */
export class TrieUtils {
  /**
   * 演示基本操作
   */
  static demonstrateBasicOperations(): void {
    console.log("=== 字典树基本操作演示 ===");

    const trie = new Trie();
    const words = ["cat", "car", "card", "care", "careful", "cars", "carry"];

    console.log("插入单词:", words.join(", "));
    words.forEach((word) => trie.insert(word));

    console.log("\n字典树统计:");
    console.log("单词数量:", trie.getSize());
    console.log("节点数量:", trie.getNodeCount());
    console.log("树高度:", trie.getHeight());
    console.log("最长公共前缀:", trie.getLongestCommonPrefix());

    // 搜索测试
    console.log("\n搜索测试:");
    const testWords = ["car", "card", "care", "cat", "dog"];
    testWords.forEach((word) => {
      console.log(`'${word}' 存在: ${trie.search(word)}`);
    });

    // 前缀测试
    console.log("\n前缀测试:");
    const prefixes = ["ca", "car", "care", "x"];
    prefixes.forEach((prefix) => {
      console.log(`前缀 '${prefix}' 存在: ${trie.startsWith(prefix)}`);
      console.log(
        `以 '${prefix}' 开头的单词: [${trie
          .getWordsWithPrefix(prefix)
          .join(", ")}]`
      );
    });
  }

  /**
   * 演示高级功能
   */
  static demonstrateAdvancedFeatures(): void {
    console.log("\n=== 字典树高级功能演示 ===");

    const trie = new Trie();
    const words = ["hello", "help", "helpful", "world", "word", "work"];
    words.forEach((word) => trie.insert(word));

    // 模糊搜索
    console.log("模糊搜索 (通配符 '?'):");
    console.log("模式 'he?p': ", trie.wildcardSearch("he?p"));
    console.log("模式 'w??d': ", trie.wildcardSearch("w??d"));
    console.log("模式 'wo?k': ", trie.wildcardSearch("wo?k"));

    // 编辑距离搜索
    console.log("\n编辑距离搜索:");
    const fuzzyResults = trie.fuzzySearch("help", 2);
    fuzzyResults.forEach((result) => {
      console.log(`'${result.word}' 距离: ${result.distance}`);
    });

    // 删除操作
    console.log("\n删除操作:");
    console.log("删除 'help':", trie.delete("help"));
    console.log("删除后的单词:", trie.getAllWords());
    console.log("删除不存在的 'hello123':", trie.delete("hello123"));
  }

  /**
   * 演示自动补全功能
   */
  static demonstrateAutoComplete(): void {
    console.log("\n=== 自动补全演示 ===");

    const trie = new Trie();
    const dictionary = [
      "apple",
      "application",
      "apply",
      "appreciate",
      "approach",
      "banana",
      "band",
      "bank",
      "bar",
      "base",
      "cat",
      "car",
      "card",
      "care",
      "carry",
    ];

    dictionary.forEach((word) => trie.insert(word));

    const queries = ["app", "ba", "car"];
    queries.forEach((query) => {
      const suggestions = trie.getWordsWithPrefix(query);
      console.log(`输入 '${query}' 的建议: [${suggestions.join(", ")}]`);
    });
  }

  /**
   * 性能测试
   * @param wordCount 单词数量
   */
  static performanceTest(wordCount: number = 10000): void {
    console.log(`\n=== 字典树性能测试 (${wordCount} 个单词) ===`);

    // 生成测试单词
    const words = this.generateRandomWords(wordCount, 3, 10);

    const trie = new Trie();

    // 插入性能测试
    console.time("插入所有单词");
    words.forEach((word) => trie.insert(word));
    console.timeEnd("插入所有单词");

    console.log("字典树统计:");
    console.log("单词数量:", trie.getSize());
    console.log("节点数量:", trie.getNodeCount());
    console.log("树高度:", trie.getHeight());

    // 搜索性能测试
    const searchCount = 1000;
    const searchWords = words.slice(0, searchCount);

    console.time(`搜索 ${searchCount} 个单词`);
    searchWords.forEach((word) => trie.search(word));
    console.timeEnd(`搜索 ${searchCount} 个单词`);

    // 前缀搜索性能测试
    const prefixes = words.slice(0, 100).map((word) => word.substring(0, 3));

    console.time("100 次前缀搜索");
    prefixes.forEach((prefix) => trie.getWordsWithPrefix(prefix));
    console.timeEnd("100 次前缀搜索");

    // 删除性能测试
    const deleteWords = words.slice(0, searchCount);

    console.time(`删除 ${searchCount} 个单词`);
    deleteWords.forEach((word) => trie.delete(word));
    console.timeEnd(`删除 ${searchCount} 个单词`);

    console.log("删除后的单词数量:", trie.getSize());
  }

  /**
   * 生成随机单词用于测试
   * @param count 单词数量
   * @param minLength 最小长度
   * @param maxLength 最大长度
   * @returns 随机单词数组
   */
  private static generateRandomWords(
    count: number,
    minLength: number,
    maxLength: number
  ): string[] {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const words = new Set<string>();

    while (words.size < count) {
      const length =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      let word = "";
      for (let i = 0; i < length; i++) {
        word += chars[Math.floor(Math.random() * chars.length)];
      }
      words.add(word);
    }

    return Array.from(words);
  }

  /**
   * 正确性验证
   */
  static verifyCorrectness(): void {
    console.log("\n=== 字典树正确性验证 ===");

    const trie = new Trie();
    const testWords = [
      "test",
      "testing",
      "tester",
      "tea",
      "ted",
      "ten",
      "i",
      "in",
      "inn",
    ];

    let testsPassed = 0;
    let totalTests = 0;

    // 测试插入和搜索
    testWords.forEach((word) => {
      trie.insert(word);
      totalTests++;
      if (trie.search(word)) {
        testsPassed++;
      } else {
        console.log(`插入搜索失败: ${word}`);
      }
    });

    // 测试不存在的单词
    const nonExistentWords = ["tes", "testing123", "hello"];
    nonExistentWords.forEach((word) => {
      totalTests++;
      if (!trie.search(word)) {
        testsPassed++;
      } else {
        console.log(`错误搜索到不存在的单词: ${word}`);
      }
    });

    // 测试前缀
    const prefixTests = [
      { prefix: "te", shouldExist: true },
      { prefix: "test", shouldExist: true },
      { prefix: "xyz", shouldExist: false },
    ];

    prefixTests.forEach((test) => {
      totalTests++;
      if (trie.startsWith(test.prefix) === test.shouldExist) {
        testsPassed++;
      } else {
        console.log(`前缀测试失败: ${test.prefix}`);
      }
    });

    // 测试删除
    const deleteWord = "test";
    totalTests++;
    if (trie.delete(deleteWord) && !trie.search(deleteWord)) {
      testsPassed++;
    } else {
      console.log(`删除测试失败: ${deleteWord}`);
    }

    console.log(
      `正确性验证完成: ${testsPassed}/${totalTests} 通过 (${(
        (testsPassed / totalTests) *
        100
      ).toFixed(2)}%)`
    );
  }
}
