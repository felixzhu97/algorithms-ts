/**
 * 二叉搜索树测试
 * 《算法导论》第12章 二叉搜索树
 */

import {
  BinarySearchTree,
  BSTNode,
} from "../data-structures/trees/binary-search-tree";

describe("二叉搜索树节点 (BSTNode)", () => {
  test("应该正确创建节点", () => {
    const node = new BSTNode(10);
    expect(node.value).toBe(10);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
    expect(node.parent).toBeNull();
  });

  test("应该正确判断节点类型", () => {
    const root = new BSTNode(10);
    const left = new BSTNode(5);
    const right = new BSTNode(15);

    root.left = left;
    root.right = right;
    left.parent = root;
    right.parent = root;

    expect(root.isRoot()).toBe(true);
    expect(root.isLeaf()).toBe(false);
    expect(root.getChildrenCount()).toBe(2);

    expect(left.isLeftChild()).toBe(true);
    expect(left.isRightChild()).toBe(false);
    expect(left.isLeaf()).toBe(true);
    expect(left.getChildrenCount()).toBe(0);

    expect(right.isRightChild()).toBe(true);
    expect(right.isLeftChild()).toBe(false);
  });
});

describe("二叉搜索树 (BinarySearchTree)", () => {
  let bst: BinarySearchTree<number>;

  beforeEach(() => {
    bst = new BinarySearchTree<number>();
  });

  describe("基本操作", () => {
    test("应该正确初始化空树", () => {
      expect(bst.isEmpty()).toBe(true);
      expect(bst.size()).toBe(0);
      expect(bst.getRoot()).toBeNull();
    });

    test("应该正确插入单个元素", () => {
      expect(bst.insert(10)).toBe(true);
      expect(bst.isEmpty()).toBe(false);
      expect(bst.size()).toBe(1);
      expect(bst.getRoot()?.value).toBe(10);
    });

    test("应该拒绝插入重复元素", () => {
      bst.insert(10);
      expect(bst.insert(10)).toBe(false);
      expect(bst.size()).toBe(1);
    });

    test("应该正确插入多个元素", () => {
      const values = [50, 30, 70, 20, 40, 60, 80];
      values.forEach((val) => expect(bst.insert(val)).toBe(true));
      expect(bst.size()).toBe(7);
    });

    test("应该正确清空树", () => {
      [50, 30, 70].forEach((val) => bst.insert(val));
      bst.clear();
      expect(bst.isEmpty()).toBe(true);
      expect(bst.size()).toBe(0);
      expect(bst.getRoot()).toBeNull();
    });
  });

  describe("搜索操作", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    test("应该正确搜索存在的元素（递归版本）", () => {
      expect(bst.search(50)?.value).toBe(50);
      expect(bst.search(30)?.value).toBe(30);
      expect(bst.search(80)?.value).toBe(80);
    });

    test("应该正确搜索不存在的元素（递归版本）", () => {
      expect(bst.search(100)).toBeNull();
      expect(bst.search(25)).toBeNull();
      expect(bst.search(0)).toBeNull();
    });

    test("应该正确搜索存在的元素（迭代版本）", () => {
      expect(bst.searchIterative(50)?.value).toBe(50);
      expect(bst.searchIterative(30)?.value).toBe(30);
      expect(bst.searchIterative(80)?.value).toBe(80);
    });

    test("应该正确搜索不存在的元素（迭代版本）", () => {
      expect(bst.searchIterative(100)).toBeNull();
      expect(bst.searchIterative(25)).toBeNull();
      expect(bst.searchIterative(0)).toBeNull();
    });

    test("递归和迭代搜索应该返回相同结果", () => {
      const testValues = [50, 30, 70, 100, 25, 0];
      testValues.forEach((val) => {
        const recursiveResult = bst.search(val);
        const iterativeResult = bst.searchIterative(val);
        expect(recursiveResult?.value).toBe(iterativeResult?.value);
      });
    });

    test("contains方法应该正确工作", () => {
      expect(bst.contains(50)).toBe(true);
      expect(bst.contains(30)).toBe(true);
      expect(bst.contains(100)).toBe(false);
      expect(bst.contains(25)).toBe(false);
    });
  });

  describe("插入操作（详细测试）", () => {
    test("递归和迭代插入应该产生相同结果", () => {
      const bst1 = new BinarySearchTree<number>();
      const bst2 = new BinarySearchTree<number>();
      const values = [50, 30, 70, 20, 40, 60, 80];

      // 使用递归插入
      values.forEach((val) => bst1.insert(val));

      // 使用迭代插入
      values.forEach((val) => bst2.insertIterative(val));

      expect(bst1.inorderTraversal()).toEqual(bst2.inorderTraversal());
      expect(bst1.size()).toBe(bst2.size());
    });

    test("应该维护BST性质", () => {
      const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
      values.forEach((val) => bst.insert(val));

      expect(bst.isValidBST()).toBe(true);

      // 中序遍历应该得到排序序列
      const inorder = bst.inorderTraversal();
      const sorted = [...values].sort((a, b) => a - b);
      expect(inorder).toEqual(sorted);
    });
  });

  describe("删除操作", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach((val) =>
        bst.insert(val)
      );
    });

    test("应该正确删除叶子节点", () => {
      expect(bst.delete(10)).toBe(true);
      expect(bst.contains(10)).toBe(false);
      expect(bst.size()).toBe(10);
      expect(bst.isValidBST()).toBe(true);
    });

    test("应该正确删除只有一个子节点的节点", () => {
      expect(bst.delete(25)).toBe(true);
      expect(bst.contains(25)).toBe(false);
      expect(bst.size()).toBe(10);
      expect(bst.isValidBST()).toBe(true);
    });

    test("应该正确删除有两个子节点的节点", () => {
      expect(bst.delete(30)).toBe(true);
      expect(bst.contains(30)).toBe(false);
      expect(bst.size()).toBe(10);
      expect(bst.isValidBST()).toBe(true);
    });

    test("应该正确删除根节点", () => {
      expect(bst.delete(50)).toBe(true);
      expect(bst.contains(50)).toBe(false);
      expect(bst.size()).toBe(10);
      expect(bst.isValidBST()).toBe(true);
    });

    test("删除不存在的元素应该返回false", () => {
      expect(bst.delete(100)).toBe(false);
      expect(bst.size()).toBe(11); // 保持原大小
    });

    test("删除后应该维护BST性质", () => {
      const toDelete = [10, 25, 30, 50];
      toDelete.forEach((val) => bst.delete(val));

      expect(bst.isValidBST()).toBe(true);

      // 验证剩余元素
      const remaining = [70, 20, 40, 60, 80, 35, 45];
      const inorder = bst.inorderTraversal();
      expect(inorder).toEqual(remaining.sort((a, b) => a - b));
    });
  });

  describe("最小值和最大值", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    test("应该正确找到最小值", () => {
      expect(bst.minimum().value).toBe(20);
    });

    test("应该正确找到最大值", () => {
      expect(bst.maximum().value).toBe(80);
    });

    test("应该正确找到子树的最小值", () => {
      const node70 = bst.search(70)!;
      expect(bst.minimum(node70).value).toBe(60);
    });

    test("应该正确找到子树的最大值", () => {
      const node30 = bst.search(30)!;
      expect(bst.maximum(node30).value).toBe(40);
    });

    test("空树应该抛出错误", () => {
      const emptyBst = new BinarySearchTree<number>();
      expect(() => emptyBst.minimum()).toThrow("Tree is empty");
      expect(() => emptyBst.maximum()).toThrow("Tree is empty");
    });
  });

  describe("前驱和后继", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80, 35, 45].forEach((val) => bst.insert(val));
    });

    test("应该正确找到后继节点", () => {
      expect(bst.successor(bst.search(30)!)?.value).toBe(35);
      expect(bst.successor(bst.search(35)!)?.value).toBe(40);
      expect(bst.successor(bst.search(45)!)?.value).toBe(50);
      expect(bst.successor(bst.search(80)!)).toBeNull(); // 最大值没有后继
    });

    test("应该正确找到前驱节点", () => {
      expect(bst.predecessor(bst.search(50)!)?.value).toBe(45);
      expect(bst.predecessor(bst.search(40)!)?.value).toBe(35);
      expect(bst.predecessor(bst.search(35)!)?.value).toBe(30);
      expect(bst.predecessor(bst.search(20)!)).toBeNull(); // 最小值没有前驱
    });
  });

  describe("遍历操作", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    test("中序遍历应该返回排序序列", () => {
      const inorder = bst.inorderTraversal();
      expect(inorder).toEqual([20, 30, 40, 50, 60, 70, 80]);
    });

    test("前序遍历应该正确", () => {
      const preorder = bst.preorderTraversal();
      expect(preorder).toEqual([50, 30, 20, 40, 70, 60, 80]);
    });

    test("后序遍历应该正确", () => {
      const postorder = bst.postorderTraversal();
      expect(postorder).toEqual([20, 40, 30, 60, 80, 70, 50]);
    });

    test("层序遍历应该正确", () => {
      const levelorder = bst.levelOrderTraversal();
      expect(levelorder).toEqual([50, 30, 70, 20, 40, 60, 80]);
    });

    test("空树的遍历应该返回空数组", () => {
      const emptyBst = new BinarySearchTree<number>();
      expect(emptyBst.inorderTraversal()).toEqual([]);
      expect(emptyBst.preorderTraversal()).toEqual([]);
      expect(emptyBst.postorderTraversal()).toEqual([]);
      expect(emptyBst.levelOrderTraversal()).toEqual([]);
    });
  });

  describe("树的属性", () => {
    test("应该正确计算树的高度", () => {
      expect(bst.height()).toBe(-1); // 空树高度为-1

      bst.insert(50);
      expect(bst.height()).toBe(0); // 只有根节点

      [30, 70].forEach((val) => bst.insert(val));
      expect(bst.height()).toBe(1);

      [20, 40, 60, 80].forEach((val) => bst.insert(val));
      expect(bst.height()).toBe(2);
    });

    test("应该正确验证BST性质", () => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
      expect(bst.isValidBST()).toBe(true);

      // 人为破坏BST性质（仅用于测试）
      const root = bst.getRoot()!;
      const originalValue = root.left!.value;
      root.left!.value = 100; // 左子树的值大于根节点
      expect(bst.isValidBST()).toBe(false);

      // 恢复
      root.left!.value = originalValue;
      expect(bst.isValidBST()).toBe(true);
    });
  });

  describe("范围查询", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach((val) =>
        bst.insert(val)
      );
    });

    test("应该正确执行范围查询", () => {
      expect(bst.rangeQuery(25, 50)).toEqual([25, 30, 35, 40, 45, 50]);
      expect(bst.rangeQuery(30, 60)).toEqual([30, 35, 40, 45, 50, 60]);
      expect(bst.rangeQuery(100, 200)).toEqual([]);
      expect(bst.rangeQuery(0, 5)).toEqual([]);
    });
  });

  describe("从排序数组构建平衡BST", () => {
    test("应该从排序数组构建平衡BST", () => {
      const sortedArray = [10, 20, 30, 40, 50, 60, 70];
      const balancedBst = BinarySearchTree.fromSortedArray(sortedArray);

      expect(balancedBst.size()).toBe(7);
      expect(balancedBst.inorderTraversal()).toEqual(sortedArray);
      expect(balancedBst.isValidBST()).toBe(true);

      // 验证是否相对平衡（高度应该接近log(n)）
      expect(balancedBst.height()).toBeLessThanOrEqual(3); // log2(7) ≈ 2.8
    });

    test("应该处理空数组", () => {
      const emptyBst = BinarySearchTree.fromSortedArray([]);
      expect(emptyBst.isEmpty()).toBe(true);
    });

    test("应该处理单元素数组", () => {
      const singleBst = BinarySearchTree.fromSortedArray([42]);
      expect(singleBst.size()).toBe(1);
      expect(singleBst.getRoot()?.value).toBe(42);
    });
  });

  describe("工具方法", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40].forEach((val) => bst.insert(val));
    });

    test("toArray方法应该返回排序数组", () => {
      expect(bst.toArray()).toEqual([20, 30, 40, 50, 70]);
    });

    test("toString方法应该正确工作", () => {
      expect(bst.toString()).toBe("BST([20, 30, 40, 50, 70])");

      const emptyBst = new BinarySearchTree<number>();
      expect(emptyBst.toString()).toBe("BST(empty)");
    });

    test("printTree方法应该不抛出错误", () => {
      expect(() => bst.printTree()).not.toThrow();

      const emptyBst = new BinarySearchTree<number>();
      expect(() => emptyBst.printTree()).not.toThrow();
    });
  });

  describe("自定义比较函数", () => {
    test("应该支持自定义比较函数", () => {
      // 逆序比较函数
      const reverseBst = new BinarySearchTree<number>((a, b) => b - a);

      [50, 30, 70, 20, 40].forEach((val) => reverseBst.insert(val));

      // 中序遍历应该得到逆序序列
      expect(reverseBst.inorderTraversal()).toEqual([70, 50, 40, 30, 20]);
      expect(reverseBst.isValidBST()).toBe(true);
    });

    test("应该支持对象比较", () => {
      interface Person {
        name: string;
        age: number;
      }

      const personBst = new BinarySearchTree<Person>((a, b) => a.age - b.age);

      const people = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
        { name: "Charlie", age: 35 },
        { name: "David", age: 20 },
      ];

      people.forEach((person) => personBst.insert(person));

      const ageOrder = personBst.inorderTraversal().map((p) => p.age);
      expect(ageOrder).toEqual([20, 25, 30, 35]);
    });
  });

  describe("性能测试", () => {
    test("大数据量插入和搜索性能", () => {
      const largeSize = 10000;
      const values = Array.from({ length: largeSize }, (_, i) => i);

      // 随机打乱数组
      for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
      }

      const start = Date.now();

      // 插入所有值
      values.forEach((val) => bst.insert(val));

      // 搜索所有值
      values.forEach((val) => {
        expect(bst.contains(val)).toBe(true);
      });

      const duration = Date.now() - start;

      expect(bst.size()).toBe(largeSize);
      expect(bst.isValidBST()).toBe(true);

      console.log(`BST ${largeSize} 个元素的插入和搜索耗时: ${duration}ms`);
      console.log(`树高度: ${bst.height()}`);
    });
  });
});
