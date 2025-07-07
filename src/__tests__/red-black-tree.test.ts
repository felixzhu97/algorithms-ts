/**
 * 红黑树测试
 * 《算法导论》第13章 红黑树
 */

import {
  RedBlackTree,
  RBTreeNode,
} from "../data-structures/trees/red-black-tree";
import { RBColor } from "../types";

describe("红黑树节点 (RBTreeNode)", () => {
  test("应该正确创建节点", () => {
    const node = new RBTreeNode(10);
    expect(node.value).toBe(10);
    expect(node.color).toBe(RBColor.RED); // 默认为红色
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
    expect(node.parent).toBeNull();
  });

  test("应该正确创建黑色节点", () => {
    const node = new RBTreeNode(10, RBColor.BLACK);
    expect(node.value).toBe(10);
    expect(node.color).toBe(RBColor.BLACK);
  });

  test("应该正确判断节点关系", () => {
    const root = new RBTreeNode(10, RBColor.BLACK);
    const left = new RBTreeNode(5);
    const right = new RBTreeNode(15);

    root.left = left;
    root.right = right;
    left.parent = root;
    right.parent = root;

    expect(root.isRoot()).toBe(true);
    expect(root.isLeaf()).toBe(false);

    expect(left.isLeftChild()).toBe(true);
    expect(left.isRightChild()).toBe(false);
    expect(left.isRoot()).toBe(false);
    expect(left.isLeaf()).toBe(true);

    expect(right.isRightChild()).toBe(true);
    expect(right.isLeftChild()).toBe(false);
    expect(right.getSibling()).toBe(left);
    expect(left.getSibling()).toBe(right);
  });

  test("应该正确获取祖父和叔父节点", () => {
    const grandparent = new RBTreeNode(50, RBColor.BLACK);
    const parent = new RBTreeNode(30);
    const uncle = new RBTreeNode(70);
    const child = new RBTreeNode(20);

    grandparent.left = parent;
    grandparent.right = uncle;
    parent.parent = grandparent;
    uncle.parent = grandparent;

    parent.left = child;
    child.parent = parent;

    expect(child.getGrandparent()).toBe(grandparent);
    expect(child.getUncle()).toBe(uncle);
  });

  test("应该正确判断和操作颜色", () => {
    const redNode = new RBTreeNode(10, RBColor.RED);
    const blackNode = new RBTreeNode(20, RBColor.BLACK);

    expect(redNode.isRed()).toBe(true);
    expect(redNode.isBlack()).toBe(false);
    expect(blackNode.isRed()).toBe(false);
    expect(blackNode.isBlack()).toBe(true);

    redNode.flipColor();
    expect(redNode.isBlack()).toBe(true);

    blackNode.setColor(RBColor.RED);
    expect(blackNode.isRed()).toBe(true);
  });
});

describe("红黑树 (RedBlackTree)", () => {
  let rbt: RedBlackTree<number>;

  beforeEach(() => {
    rbt = new RedBlackTree<number>();
  });

  describe("基本操作", () => {
    test("应该正确初始化空树", () => {
      expect(rbt.isEmpty()).toBe(true);
      expect(rbt.getSize()).toBe(0);
      expect(rbt.getRoot()).toBeNull();
    });

    test("应该正确插入单个元素", () => {
      expect(rbt.insert(10)).toBe(true);
      expect(rbt.isEmpty()).toBe(false);
      expect(rbt.getSize()).toBe(1);
      expect(rbt.getRoot()?.value).toBe(10);
      expect(rbt.getRoot()?.color).toBe(RBColor.BLACK); // 根节点必须是黑色
    });

    test("应该拒绝插入重复元素", () => {
      rbt.insert(10);
      expect(rbt.insert(10)).toBe(false);
      expect(rbt.getSize()).toBe(1);
    });

    test("应该正确插入多个元素", () => {
      const values = [50, 30, 70, 20, 40, 60, 80];
      values.forEach((val) => expect(rbt.insert(val)).toBe(true));
      expect(rbt.getSize()).toBe(7);
    });

    test("应该正确清空树", () => {
      [50, 30, 70].forEach((val) => rbt.insert(val));
      rbt.clear();
      expect(rbt.isEmpty()).toBe(true);
      expect(rbt.getSize()).toBe(0);
      expect(rbt.getRoot()).toBeNull();
    });
  });

  describe("红黑树性质验证", () => {
    test("插入后应该维持红黑树性质", () => {
      const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
      values.forEach((val) => rbt.insert(val));

      expect(rbt.isValidRedBlackTree()).toBe(true);
      expect(rbt.getRoot()?.color).toBe(RBColor.BLACK); // 根节点是黑色

      // 中序遍历应该得到排序序列
      const inorder = rbt.inorderTraversal();
      const sorted = [...values].sort((a, b) => a - b);
      expect(inorder).toEqual(sorted);
    });

    test("删除后应该维持红黑树性质", () => {
      const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
      values.forEach((val) => rbt.insert(val));

      // 删除不同类型的节点
      const toDelete = [10, 25, 30, 50]; // 叶子节点、有一个子节点、有两个子节点、根节点
      toDelete.forEach((val) => {
        expect(rbt.delete(val)).toBe(true);
        expect(rbt.isValidRedBlackTree()).toBe(true);
      });

      expect(rbt.getSize()).toBe(7);
    });

    test("应该正确计算黑高度", () => {
      // 插入一些值
      [50, 30, 70, 20, 40].forEach((val) => rbt.insert(val));

      expect(() => rbt.blackHeight()).not.toThrow();
      expect(rbt.blackHeight()).toBeGreaterThanOrEqual(1);
    });

    test("应该处理各种插入模式", () => {
      // 测试不同的插入模式
      const patterns = [
        [1, 2, 3, 4, 5], // 递增序列
        [5, 4, 3, 2, 1], // 递减序列
        [3, 1, 5, 2, 4], // 随机序列
      ];

      patterns.forEach((pattern) => {
        const testRbt = new RedBlackTree<number>();
        pattern.forEach((val) => testRbt.insert(val));

        expect(testRbt.isValidRedBlackTree()).toBe(true);
        expect(testRbt.getSize()).toBe(pattern.length);

        const inorder = testRbt.inorderTraversal();
        const sorted = [...pattern].sort((a, b) => a - b);
        expect(inorder).toEqual(sorted);
      });
    });
  });

  describe("搜索操作", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => rbt.insert(val));
    });

    test("应该正确搜索存在的元素", () => {
      expect(rbt.search(50)?.value).toBe(50);
      expect(rbt.search(30)?.value).toBe(30);
      expect(rbt.search(80)?.value).toBe(80);
    });

    test("应该正确搜索不存在的元素", () => {
      expect(rbt.search(100)).toBeNull();
      expect(rbt.search(25)).toBeNull();
      expect(rbt.search(0)).toBeNull();
    });

    test("contains方法应该正确工作", () => {
      expect(rbt.contains(50)).toBe(true);
      expect(rbt.contains(30)).toBe(true);
      expect(rbt.contains(100)).toBe(false);
      expect(rbt.contains(25)).toBe(false);
    });
  });

  describe("删除操作", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach((val) =>
        rbt.insert(val)
      );
    });

    test("应该正确删除叶子节点", () => {
      expect(rbt.delete(10)).toBe(true);
      expect(rbt.contains(10)).toBe(false);
      expect(rbt.getSize()).toBe(10);
      expect(rbt.isValidRedBlackTree()).toBe(true);
    });

    test("应该正确删除有一个子节点的节点", () => {
      expect(rbt.delete(25)).toBe(true);
      expect(rbt.contains(25)).toBe(false);
      expect(rbt.getSize()).toBe(10);
      expect(rbt.isValidRedBlackTree()).toBe(true);
    });

    test("应该正确删除有两个子节点的节点", () => {
      expect(rbt.delete(30)).toBe(true);
      expect(rbt.contains(30)).toBe(false);
      expect(rbt.getSize()).toBe(10);
      expect(rbt.isValidRedBlackTree()).toBe(true);
    });

    test("应该正确删除根节点", () => {
      expect(rbt.delete(50)).toBe(true);
      expect(rbt.contains(50)).toBe(false);
      expect(rbt.getSize()).toBe(10);
      expect(rbt.isValidRedBlackTree()).toBe(true);
    });

    test("删除不存在的元素应该返回false", () => {
      expect(rbt.delete(100)).toBe(false);
      expect(rbt.getSize()).toBe(11); // 保持原大小
    });

    test("删除所有元素", () => {
      const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];

      values.forEach((val) => {
        expect(rbt.delete(val)).toBe(true);
        expect(rbt.isValidRedBlackTree()).toBe(true);
      });

      expect(rbt.isEmpty()).toBe(true);
      expect(rbt.getSize()).toBe(0);
    });
  });

  describe("最小值和最大值", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => rbt.insert(val));
    });

    test("应该正确找到最小值", () => {
      expect(rbt.min()).toBe(20);
    });

    test("应该正确找到最大值", () => {
      expect(rbt.max()).toBe(80);
    });

    test("空树应该抛出错误", () => {
      const emptyRbt = new RedBlackTree<number>();
      expect(() => emptyRbt.min()).toThrow("Tree is empty");
      expect(() => emptyRbt.max()).toThrow("Tree is empty");
    });
  });

  describe("遍历操作", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => rbt.insert(val));
    });

    test("中序遍历应该返回排序序列", () => {
      const inorder = rbt.inorderTraversal();
      expect(inorder).toEqual([20, 30, 40, 50, 60, 70, 80]);
    });

    test("前序遍历应该正确", () => {
      const preorder = rbt.preorderTraversal();
      expect(preorder).toHaveLength(7);
      expect(preorder[0]).toBe(rbt.getRoot()?.value); // 第一个应该是根节点
    });

    test("后序遍历应该正确", () => {
      const postorder = rbt.postorderTraversal();
      expect(postorder).toHaveLength(7);
      expect(postorder[postorder.length - 1]).toBe(rbt.getRoot()?.value); // 最后一个应该是根节点
    });

    test("层序遍历应该正确", () => {
      const levelorder = rbt.levelOrderTraversal();
      expect(levelorder).toHaveLength(7);
      expect(levelorder[0]).toBe(rbt.getRoot()?.value); // 第一个应该是根节点
    });

    test("空树的遍历应该返回空数组", () => {
      const emptyRbt = new RedBlackTree<number>();
      expect(emptyRbt.inorderTraversal()).toEqual([]);
      expect(emptyRbt.preorderTraversal()).toEqual([]);
      expect(emptyRbt.postorderTraversal()).toEqual([]);
      expect(emptyRbt.levelOrderTraversal()).toEqual([]);
    });
  });

  describe("树的属性", () => {
    test("应该正确计算树的高度", () => {
      expect(rbt.height()).toBe(-1); // 空树高度为-1

      rbt.insert(50);
      expect(rbt.height()).toBe(0); // 只有根节点

      [30, 70].forEach((val) => rbt.insert(val));
      expect(rbt.height()).toBeGreaterThanOrEqual(1);

      [20, 40, 60, 80].forEach((val) => rbt.insert(val));
      expect(rbt.height()).toBeGreaterThanOrEqual(2);
    });

    test("红黑树的高度应该保持在O(log n)", () => {
      const n = 1000;
      for (let i = 0; i < n; i++) {
        rbt.insert(i);
      }

      const height = rbt.height();
      const logN = Math.log2(n);

      // 红黑树的高度不应该超过 2 * log2(n + 1)
      expect(height).toBeLessThanOrEqual(2 * Math.log2(n + 1));
      console.log(
        `红黑树高度 (${n}个节点): ${height}, 2*log2(n+1): ${
          2 * Math.log2(n + 1)
        }`
      );
    });
  });

  describe("颜色信息", () => {
    test("应该正确获取节点颜色信息", () => {
      [50, 30, 70, 20, 40].forEach((val) => rbt.insert(val));

      const nodesWithColors = rbt.getNodesWithColors();
      expect(nodesWithColors).toHaveLength(5);

      // 根节点应该是黑色
      const rootValue = rbt.getRoot()?.value;
      const rootInfo = nodesWithColors.find((node) => node.value === rootValue);
      expect(rootInfo?.color).toBe(RBColor.BLACK);
    });
  });

  describe("从排序数组构建", () => {
    test("应该从排序数组构建红黑树", () => {
      const sortedArray = [10, 20, 30, 40, 50, 60, 70];
      const balancedRbt = RedBlackTree.fromSortedArray(sortedArray);

      expect(balancedRbt.getSize()).toBe(7);
      expect(balancedRbt.inorderTraversal()).toEqual(sortedArray);
      expect(balancedRbt.isValidRedBlackTree()).toBe(true);
    });

    test("应该处理空数组", () => {
      const emptyRbt = RedBlackTree.fromSortedArray([]);
      expect(emptyRbt.isEmpty()).toBe(true);
    });

    test("应该处理单元素数组", () => {
      const singleRbt = RedBlackTree.fromSortedArray([42]);
      expect(singleRbt.getSize()).toBe(1);
      expect(singleRbt.getRoot()?.value).toBe(42);
      expect(singleRbt.getRoot()?.color).toBe(RBColor.BLACK);
    });
  });

  describe("工具方法", () => {
    beforeEach(() => {
      [50, 30, 70, 20, 40].forEach((val) => rbt.insert(val));
    });

    test("toArray方法应该返回排序数组", () => {
      expect(rbt.toArray()).toEqual([20, 30, 40, 50, 70]);
    });

    test("toString方法应该正确工作", () => {
      expect(rbt.toString()).toBe("RedBlackTree([20, 30, 40, 50, 70])");

      const emptyRbt = new RedBlackTree<number>();
      expect(emptyRbt.toString()).toBe("RedBlackTree(empty)");
    });

    test("printTree方法应该不抛出错误", () => {
      expect(() => rbt.printTree()).not.toThrow();

      const emptyRbt = new RedBlackTree<number>();
      expect(() => emptyRbt.printTree()).not.toThrow();
    });
  });

  describe("自定义比较函数", () => {
    test("应该支持自定义比较函数", () => {
      // 逆序比较函数
      const reverseRbt = new RedBlackTree<number>((a, b) => b - a);

      [50, 30, 70, 20, 40].forEach((val) => reverseRbt.insert(val));

      // 中序遍历应该得到逆序序列
      expect(reverseRbt.inorderTraversal()).toEqual([70, 50, 40, 30, 20]);
      expect(reverseRbt.isValidRedBlackTree()).toBe(true);
    });

    test("应该支持对象比较", () => {
      interface Person {
        name: string;
        age: number;
      }

      const personRbt = new RedBlackTree<Person>((a, b) => a.age - b.age);

      const people = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
        { name: "Charlie", age: 35 },
        { name: "David", age: 20 },
      ];

      people.forEach((person) => personRbt.insert(person));

      const ageOrder = personRbt.inorderTraversal().map((p) => p.age);
      expect(ageOrder).toEqual([20, 25, 30, 35]);
      expect(personRbt.isValidRedBlackTree()).toBe(true);
    });
  });

  describe("压力测试", () => {
    test("随机插入和删除大量数据", () => {
      const values = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 1000)
      );

      // 插入所有值
      values.forEach((val) => rbt.insert(val));
      expect(rbt.isValidRedBlackTree()).toBe(true);

      // 删除一半的值
      const toDelete = values.slice(0, values.length / 2);
      toDelete.forEach((val) => rbt.delete(val));
      expect(rbt.isValidRedBlackTree()).toBe(true);

      // 验证剩余元素
      const remaining = values.slice(values.length / 2);
      remaining.forEach((val) => {
        if (!toDelete.includes(val)) {
          expect(rbt.contains(val)).toBe(true);
        }
      });
    });

    test("性能测试：大数据量操作", () => {
      const size = 10000;
      console.log(`\n=== 红黑树性能测试 (${size}个元素) ===`);

      const start = Date.now();

      // 插入
      for (let i = 0; i < size; i++) {
        rbt.insert(i);
      }
      const insertTime = Date.now() - start;

      // 搜索
      const searchStart = Date.now();
      for (let i = 0; i < 1000; i++) {
        const randomValue = Math.floor(Math.random() * size);
        expect(rbt.contains(randomValue)).toBe(true);
      }
      const searchTime = Date.now() - searchStart;

      // 删除
      const deleteStart = Date.now();
      for (let i = 0; i < 1000; i++) {
        rbt.delete(i);
      }
      const deleteTime = Date.now() - deleteStart;

      console.log(`插入${size}个元素耗时: ${insertTime}ms`);
      console.log(`搜索1000次耗时: ${searchTime}ms`);
      console.log(`删除1000个元素耗时: ${deleteTime}ms`);
      console.log(`最终树高度: ${rbt.height()}`);
      console.log(`最终黑高度: ${rbt.blackHeight()}`);

      expect(rbt.getSize()).toBe(size - 1000);
      expect(rbt.isValidRedBlackTree()).toBe(true);
    });
  });

  describe("边界情况", () => {
    test("应该处理极端情况", () => {
      // 单个元素
      rbt.insert(42);
      expect(rbt.isValidRedBlackTree()).toBe(true);
      expect(rbt.delete(42)).toBe(true);
      expect(rbt.isEmpty()).toBe(true);

      // 两个元素
      rbt.insert(10);
      rbt.insert(20);
      expect(rbt.isValidRedBlackTree()).toBe(true);

      // 三个元素（触发旋转）
      rbt.insert(30);
      expect(rbt.isValidRedBlackTree()).toBe(true);
    });

    test("应该正确处理重复删除", () => {
      rbt.insert(10);
      expect(rbt.delete(10)).toBe(true);
      expect(rbt.delete(10)).toBe(false); // 第二次删除应该失败
    });
  });

  describe("与二叉搜索树比较", () => {
    test("红黑树应该比普通BST更平衡", () => {
      // 插入有序序列，这会让普通BST退化成链表
      const sortedValues = Array.from({ length: 100 }, (_, i) => i);

      sortedValues.forEach((val) => rbt.insert(val));

      const height = rbt.height();
      const worstCaseBSTHeight = sortedValues.length - 1; // 链表高度

      // 红黑树的高度应该远小于退化BST的高度
      expect(height).toBeLessThan(worstCaseBSTHeight / 2);
      expect(rbt.isValidRedBlackTree()).toBe(true);

      console.log(`红黑树高度: ${height}, 退化BST高度: ${worstCaseBSTHeight}`);
    });
  });
});
