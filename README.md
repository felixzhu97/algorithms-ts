# 算法导论 TypeScript 实现

这是《算法导论》(Introduction to Algorithms) 第三版的完整 TypeScript 实现。

## 📖 项目简介

本项目实现了《算法导论》中的主要算法和数据结构，使用现代 TypeScript 编写，包含完整的类型定义、测试用例和性能分析。

## 🏗️ 项目结构

```
src/
├── algorithms/           # 算法实现
│   ├── sorting/         # 排序算法
│   ├── searching/       # 搜索算法
│   ├── graph/           # 图算法
│   ├── dynamic-programming/  # 动态规划
│   ├── greedy/          # 贪心算法
│   ├── divide-conquer/  # 分治算法
│   ├── string/          # 字符串算法
│   └── number-theory/   # 数论算法
├── data-structures/     # 数据结构
│   ├── basic/           # 基础数据结构
│   ├── trees/           # 树结构
│   ├── graphs/          # 图结构
│   └── advanced/        # 高级数据结构
├── utils/               # 工具函数
└── types/               # 类型定义
```

## 📚 实现的算法

### 排序算法

- [x] 插入排序 (Insertion Sort)
- [x] 归并排序 (Merge Sort)
- [x] 堆排序 (Heap Sort)
- [x] 快速排序 (Quick Sort)
- [x] 计数排序 (Counting Sort)
- [x] 基数排序 (Radix Sort)
- [x] 桶排序 (Bucket Sort)

### 数据结构

- [x] 栈 (Stack)
- [x] 队列 (Queue)
- [x] 链表 (Linked List)
- [x] 二叉搜索树 (Binary Search Tree)
- [x] 红黑树 (Red-Black Tree)
- [x] 堆 (Heap)
- [x] 哈希表 (Hash Table)

### 图算法

- [x] 广度优先搜索 (BFS)
- [x] 深度优先搜索 (DFS)
- [x] 拓扑排序 (Topological Sort)
- [x] 最短路径 (Dijkstra, Bellman-Ford, Floyd-Warshall)
- [x] 最小生成树 (Kruskal, Prim)

### 动态规划

- [x] 矩阵链乘法
- [x] 最长公共子序列
- [x] 背包问题
- [x] 编辑距离

### 字符串算法

- [x] KMP 算法
- [x] Rabin-Karp 算法
- [x] 后缀数组

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 编译项目

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 运行示例

```bash
npm run dev
```

## 📊 性能分析

每个算法都包含详细的时间复杂度和空间复杂度分析，以及性能基准测试。

## 🧪 测试

所有算法都配备了完整的单元测试，确保正确性和边界条件处理。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！
