/**
 * 计算几何学算法实现
 * 《算法导论》第33章 计算几何学
 *
 * 包含以下算法：
 * 1. 凸包算法 - Graham扫描、Jarvis步进（Gift Wrapping）
 * 2. 线段相交检测
 * 3. 多边形面积计算
 * 4. 点在多边形内判断
 * 5. 最近点对问题
 * 6. 线段相交扫描算法
 */

/**
 * 二维点类
 */
export class Point2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * 计算到另一点的距离
   */
  distanceTo(other: Point2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 计算到另一点的平方距离（避免开方运算）
   */
  squaredDistanceTo(other: Point2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  }

  /**
   * 计算向量的叉积
   */
  crossProduct(p1: Point2D, p2: Point2D): number {
    return (
      (p1.x - this.x) * (p2.y - this.y) - (p1.y - this.y) * (p2.x - this.x)
    );
  }

  /**
   * 计算向量的点积
   */
  dotProduct(p1: Point2D, p2: Point2D): number {
    return (
      (p1.x - this.x) * (p2.x - this.x) + (p1.y - this.y) * (p2.y - this.y)
    );
  }

  /**
   * 计算到另一点的角度
   */
  angleTo(other: Point2D): number {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  /**
   * 点的字符串表示
   */
  toString(): string {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  /**
   * 点的相等比较
   */
  equals(other: Point2D, tolerance = 1e-10): boolean {
    return (
      Math.abs(this.x - other.x) < tolerance &&
      Math.abs(this.y - other.y) < tolerance
    );
  }

  /**
   * 克隆点
   */
  clone(): Point2D {
    return new Point2D(this.x, this.y);
  }
}

/**
 * 线段类
 */
export class LineSegment {
  public start: Point2D;
  public end: Point2D;

  constructor(start: Point2D, end: Point2D) {
    this.start = start;
    this.end = end;
  }

  /**
   * 获取线段长度
   */
  length(): number {
    return this.start.distanceTo(this.end);
  }

  /**
   * 获取线段的中点
   */
  midpoint(): Point2D {
    return new Point2D(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
  }

  /**
   * 检查点是否在线段上
   */
  containsPoint(point: Point2D, tolerance = 1e-10): boolean {
    // 检查点是否在线段的边界框内
    const minX = Math.min(this.start.x, this.end.x) - tolerance;
    const maxX = Math.max(this.start.x, this.end.x) + tolerance;
    const minY = Math.min(this.start.y, this.end.y) - tolerance;
    const maxY = Math.max(this.start.y, this.end.y) + tolerance;

    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
      return false;
    }

    // 检查点是否在线段上（叉积为0）
    const crossProduct = this.start.crossProduct(this.end, point);
    return Math.abs(crossProduct) < tolerance;
  }

  /**
   * 线段的字符串表示
   */
  toString(): string {
    return `[${this.start.toString()} -> ${this.end.toString()}]`;
  }
}

/**
 * 多边形类
 */
export class Polygon {
  public vertices: Point2D[];

  constructor(vertices: Point2D[]) {
    this.vertices = [...vertices];
  }

  /**
   * 计算多边形面积（使用鞋带公式）
   */
  area(): number {
    let area = 0;
    const n = this.vertices.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += this.vertices[i].x * this.vertices[j].y;
      area -= this.vertices[j].x * this.vertices[i].y;
    }

    return Math.abs(area) / 2;
  }

  /**
   * 计算多边形周长
   */
  perimeter(): number {
    let perimeter = 0;
    const n = this.vertices.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      perimeter += this.vertices[i].distanceTo(this.vertices[j]);
    }

    return perimeter;
  }

  /**
   * 检查多边形是否为凸多边形
   */
  isConvex(): boolean {
    const n = this.vertices.length;
    if (n < 3) return false;

    let sign = 0;
    for (let i = 0; i < n; i++) {
      const p1 = this.vertices[i];
      const p2 = this.vertices[(i + 1) % n];
      const p3 = this.vertices[(i + 2) % n];

      const crossProduct = p1.crossProduct(p2, p3);

      if (Math.abs(crossProduct) > 1e-10) {
        const currentSign = crossProduct > 0 ? 1 : -1;
        if (sign === 0) {
          sign = currentSign;
        } else if (sign !== currentSign) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 检查点是否在多边形内部（射线法）
   */
  containsPoint(point: Point2D): boolean {
    let intersectionCount = 0;
    const n = this.vertices.length;

    for (let i = 0; i < n; i++) {
      const v1 = this.vertices[i];
      const v2 = this.vertices[(i + 1) % n];

      // 检查水平射线是否与边相交
      if (
        v1.y > point.y !== v2.y > point.y &&
        point.x < ((v2.x - v1.x) * (point.y - v1.y)) / (v2.y - v1.y) + v1.x
      ) {
        intersectionCount++;
      }
    }

    return intersectionCount % 2 === 1;
  }

  /**
   * 获取多边形的边界框
   */
  getBoundingBox(): { minX: number; maxX: number; minY: number; maxY: number } {
    if (this.vertices.length === 0) {
      throw new Error("空多边形没有边界框");
    }

    let minX = this.vertices[0].x;
    let maxX = this.vertices[0].x;
    let minY = this.vertices[0].y;
    let maxY = this.vertices[0].y;

    for (const vertex of this.vertices) {
      minX = Math.min(minX, vertex.x);
      maxX = Math.max(maxX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxY = Math.max(maxY, vertex.y);
    }

    return { minX, maxX, minY, maxY };
  }
}

/**
 * 计算三个点的方向
 * @returns 0: 共线, 1: 顺时针, 2: 逆时针
 */
export function orientation(p: Point2D, q: Point2D, r: Point2D): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (Math.abs(val) < 1e-10) return 0; // 共线
  return val > 0 ? 1 : 2; // 顺时针或逆时针
}

/**
 * 检查两线段是否相交
 */
export function segmentsIntersect(
  seg1: LineSegment,
  seg2: LineSegment
): boolean {
  const p1 = seg1.start;
  const q1 = seg1.end;
  const p2 = seg2.start;
  const q2 = seg2.end;

  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  // 一般情况
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // 特殊情况：点共线且在线段上
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false;
}

/**
 * 检查点q是否在线段pr上
 */
function onSegment(p: Point2D, q: Point2D, r: Point2D): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

/**
 * 计算两线段的交点
 */
export function segmentIntersection(
  seg1: LineSegment,
  seg2: LineSegment
): Point2D | null {
  const x1 = seg1.start.x,
    y1 = seg1.start.y;
  const x2 = seg1.end.x,
    y2 = seg1.end.y;
  const x3 = seg2.start.x,
    y3 = seg2.start.y;
  const x4 = seg2.end.x,
    y4 = seg2.end.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (Math.abs(denom) < 1e-10) {
    return null; // 平行或共线
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return new Point2D(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
  }

  return null;
}

/**
 * Graham扫描凸包算法
 * 时间复杂度: O(n log n)
 */
export function grahamScan(points: Point2D[]): Point2D[] {
  if (points.length < 3) {
    throw new Error("至少需要3个点才能构成凸包");
  }

  // 找到最底部的点（y坐标最小，如果相等则x坐标最小）
  let bottom = points[0];
  let bottomIndex = 0;

  for (let i = 1; i < points.length; i++) {
    if (
      points[i].y < bottom.y ||
      (points[i].y === bottom.y && points[i].x < bottom.x)
    ) {
      bottom = points[i];
      bottomIndex = i;
    }
  }

  // 将底部点移到数组开头
  [points[0], points[bottomIndex]] = [points[bottomIndex], points[0]];

  // 按极角排序
  const sortedPoints = [points[0]].concat(
    points.slice(1).sort((a, b) => {
      const angleA = bottom.angleTo(a);
      const angleB = bottom.angleTo(b);

      if (Math.abs(angleA - angleB) < 1e-10) {
        // 角度相同时，按距离排序
        return bottom.squaredDistanceTo(a) - bottom.squaredDistanceTo(b);
      }

      return angleA - angleB;
    })
  );

  // Graham扫描
  const hull: Point2D[] = [];

  for (const point of sortedPoints) {
    // 移除不构成左转的点
    while (hull.length >= 2) {
      const crossProduct = hull[hull.length - 2].crossProduct(
        hull[hull.length - 1],
        point
      );

      if (crossProduct <= 0) {
        hull.pop();
      } else {
        break;
      }
    }

    hull.push(point);
  }

  return hull;
}

/**
 * Jarvis步进（Gift Wrapping）凸包算法
 * 时间复杂度: O(nh)，其中h是凸包上的点数
 */
export function jarvisMarch(points: Point2D[]): Point2D[] {
  if (points.length < 3) {
    throw new Error("至少需要3个点才能构成凸包");
  }

  const hull: Point2D[] = [];

  // 找到最左边的点
  let leftmost = points[0];
  for (const point of points) {
    if (
      point.x < leftmost.x ||
      (point.x === leftmost.x && point.y < leftmost.y)
    ) {
      leftmost = point;
    }
  }

  let current = leftmost;

  do {
    hull.push(current);

    // 找到相对于当前点的下一个凸包点
    let next = points[0];

    for (const candidate of points) {
      if (candidate === current) continue;

      if (next === current || orientation(current, candidate, next) === 2) {
        next = candidate;
      }
    }

    current = next;
  } while (current !== leftmost);

  return hull;
}

/**
 * 最近点对问题（分治算法）
 * 时间复杂度: O(n log n)
 */
export function closestPair(points: Point2D[]): {
  pair: [Point2D, Point2D];
  distance: number;
} {
  if (points.length < 2) {
    throw new Error("至少需要2个点");
  }

  // 预处理：按x坐标排序
  const sortedByX = [...points].sort((a, b) => a.x - b.x);
  const sortedByY = [...points].sort((a, b) => a.y - b.y);

  const result = closestPairRec(sortedByX, sortedByY);

  return {
    pair: result.pair,
    distance: result.distance,
  };
}

/**
 * 最近点对递归实现
 */
function closestPairRec(
  pointsByX: Point2D[],
  pointsByY: Point2D[]
): { pair: [Point2D, Point2D]; distance: number } {
  const n = pointsByX.length;

  // 基础情况：暴力解决小规模问题
  if (n <= 3) {
    return bruteForceClosestPair(pointsByX);
  }

  // 分治
  const mid = Math.floor(n / 2);
  const midPoint = pointsByX[mid];

  const leftByX = pointsByX.slice(0, mid);
  const rightByX = pointsByX.slice(mid);

  const leftByY: Point2D[] = [];
  const rightByY: Point2D[] = [];

  for (const point of pointsByY) {
    if (point.x <= midPoint.x) {
      leftByY.push(point);
    } else {
      rightByY.push(point);
    }
  }

  const leftResult = closestPairRec(leftByX, leftByY);
  const rightResult = closestPairRec(rightByX, rightByY);

  // 找到较小的距离
  let minDistance = leftResult.distance;
  let closestPair = leftResult.pair;

  if (rightResult.distance < minDistance) {
    minDistance = rightResult.distance;
    closestPair = rightResult.pair;
  }

  // 检查跨越中线的点对
  const strip: Point2D[] = [];
  for (const point of pointsByY) {
    if (Math.abs(point.x - midPoint.x) < minDistance) {
      strip.push(point);
    }
  }

  const stripResult = stripClosest(strip, minDistance);
  if (stripResult && stripResult.distance < minDistance) {
    return stripResult;
  }

  return { pair: closestPair, distance: minDistance };
}

/**
 * 暴力解决最近点对问题
 */
function bruteForceClosestPair(points: Point2D[]): {
  pair: [Point2D, Point2D];
  distance: number;
} {
  let minDistance = Infinity;
  let closestPair: [Point2D, Point2D] = [points[0], points[1]];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = points[i].distanceTo(points[j]);
      if (distance < minDistance) {
        minDistance = distance;
        closestPair = [points[i], points[j]];
      }
    }
  }

  return { pair: closestPair, distance: minDistance };
}

/**
 * 在带状区域中找最近点对
 */
function stripClosest(
  strip: Point2D[],
  minDistance: number
): { pair: [Point2D, Point2D]; distance: number } | null {
  let result: { pair: [Point2D, Point2D]; distance: number } | null = null;

  for (let i = 0; i < strip.length; i++) {
    for (
      let j = i + 1;
      j < strip.length && strip[j].y - strip[i].y < minDistance;
      j++
    ) {
      const distance = strip[i].distanceTo(strip[j]);
      if (distance < minDistance) {
        minDistance = distance;
        result = { pair: [strip[i], strip[j]], distance };
      }
    }
  }

  return result;
}

/**
 * 计算几何工具类
 */
export class ComputationalGeometry {
  /**
   * 生成随机点集
   */
  static generateRandomPoints(
    count: number,
    bounds: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    }
  ): Point2D[] {
    const points: Point2D[] = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
      const y = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;
      points.push(new Point2D(x, y));
    }

    return points;
  }

  /**
   * 生成圆上的点
   */
  static generateCirclePoints(
    center: Point2D,
    radius: number,
    count: number
  ): Point2D[] {
    const points: Point2D[] = [];
    const angleStep = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      points.push(new Point2D(x, y));
    }

    return points;
  }

  /**
   * 性能测试：比较凸包算法
   */
  static performanceTest(): void {
    console.log("=== 凸包算法性能测试 ===\n");

    const sizes = [100, 500, 1000, 2000];
    const bounds = { minX: 0, maxX: 100, minY: 0, maxY: 100 };

    for (const size of sizes) {
      console.log(`--- 点数: ${size} ---`);

      const points = ComputationalGeometry.generateRandomPoints(size, bounds);

      // Graham扫描
      const grahamStart = performance.now();
      const grahamHull = grahamScan(points);
      const grahamTime = performance.now() - grahamStart;

      // Jarvis步进
      const jarvisStart = performance.now();
      const jarvisHull = jarvisMarch(points);
      const jarvisTime = performance.now() - jarvisStart;

      console.log(
        `  Graham扫描: ${grahamTime.toFixed(2)}ms (凸包点数: ${
          grahamHull.length
        })`
      );
      console.log(
        `  Jarvis步进: ${jarvisTime.toFixed(2)}ms (凸包点数: ${
          jarvisHull.length
        })`
      );

      // 验证结果一致性（点数应该相同）
      console.log(
        `  结果一致性: ${grahamHull.length === jarvisHull.length ? "✅" : "❌"}`
      );
      console.log();
    }
  }

  /**
   * 最近点对性能测试
   */
  static closestPairPerformanceTest(): void {
    console.log("=== 最近点对算法性能测试 ===\n");

    const sizes = [100, 500, 1000];
    const bounds = { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };

    for (const size of sizes) {
      console.log(`--- 点数: ${size} ---`);

      const points = ComputationalGeometry.generateRandomPoints(size, bounds);

      // 分治算法
      const divideStart = performance.now();
      const divideResult = closestPair(points);
      const divideTime = performance.now() - divideStart;

      // 暴力算法（仅对小规模测试）
      let bruteTime = 0;
      let bruteResult: { pair: [Point2D, Point2D]; distance: number } | null =
        null;

      if (size <= 1000) {
        const bruteStart = performance.now();
        bruteResult = bruteForceClosestPair(points);
        bruteTime = performance.now() - bruteStart;
      }

      console.log(
        `  分治算法: ${divideTime.toFixed(
          2
        )}ms (距离: ${divideResult.distance.toFixed(4)})`
      );

      if (bruteResult) {
        console.log(
          `  暴力算法: ${bruteTime.toFixed(
            2
          )}ms (距离: ${bruteResult.distance.toFixed(4)})`
        );
        console.log(`  加速比: ${(bruteTime / divideTime).toFixed(2)}x`);

        const distanceMatch =
          Math.abs(divideResult.distance - bruteResult.distance) < 1e-10;
        console.log(`  结果一致性: ${distanceMatch ? "✅" : "❌"}`);
      }

      console.log();
    }
  }

  /**
   * 线段相交测试
   */
  static segmentIntersectionTest(): void {
    console.log("=== 线段相交测试 ===\n");

    const testCases = [
      {
        seg1: new LineSegment(new Point2D(0, 0), new Point2D(4, 4)),
        seg2: new LineSegment(new Point2D(0, 4), new Point2D(4, 0)),
        expected: true,
        description: "相交的对角线",
      },
      {
        seg1: new LineSegment(new Point2D(0, 0), new Point2D(2, 0)),
        seg2: new LineSegment(new Point2D(3, 0), new Point2D(5, 0)),
        expected: false,
        description: "同一直线上不相交的线段",
      },
      {
        seg1: new LineSegment(new Point2D(0, 0), new Point2D(2, 2)),
        seg2: new LineSegment(new Point2D(1, 1), new Point2D(3, 3)),
        expected: true,
        description: "重叠的线段",
      },
      {
        seg1: new LineSegment(new Point2D(0, 0), new Point2D(1, 1)),
        seg2: new LineSegment(new Point2D(2, 0), new Point2D(3, 1)),
        expected: false,
        description: "平行不相交的线段",
      },
    ];

    for (const testCase of testCases) {
      const result = segmentsIntersect(testCase.seg1, testCase.seg2);
      const intersection = segmentIntersection(testCase.seg1, testCase.seg2);

      console.log(`${testCase.description}:`);
      console.log(`  线段1: ${testCase.seg1.toString()}`);
      console.log(`  线段2: ${testCase.seg2.toString()}`);
      console.log(`  是否相交: ${result} (期望: ${testCase.expected})`);
      console.log(`  交点: ${intersection ? intersection.toString() : "无"}`);
      console.log(`  测试结果: ${result === testCase.expected ? "✅" : "❌"}`);
      console.log();
    }
  }

  /**
   * 综合演示
   */
  static demonstrate(): void {
    console.log("=== 计算几何学综合演示 ===\n");

    // 生成测试点集
    const points = [
      new Point2D(0, 0),
      new Point2D(1, 1),
      new Point2D(2, 0),
      new Point2D(2, 2),
      new Point2D(1, 3),
      new Point2D(0, 2),
      new Point2D(3, 1),
      new Point2D(1.5, 1.5), // 内部点
    ];

    console.log("--- 输入点集 ---");
    points.forEach((point, index) => {
      console.log(`点${index + 1}: ${point.toString()}`);
    });

    // 凸包计算
    console.log("\n--- 凸包计算 ---");
    const grahamHull = grahamScan([...points]);
    const jarvisHull = jarvisMarch([...points]);

    console.log("Graham扫描结果:");
    grahamHull.forEach((point, index) => {
      console.log(`  ${index + 1}: ${point.toString()}`);
    });

    console.log("Jarvis步进结果:");
    jarvisHull.forEach((point, index) => {
      console.log(`  ${index + 1}: ${point.toString()}`);
    });

    // 多边形操作
    console.log("\n--- 多边形操作 ---");
    const polygon = new Polygon(grahamHull);
    console.log(`凸包面积: ${polygon.area().toFixed(4)}`);
    console.log(`凸包周长: ${polygon.perimeter().toFixed(4)}`);
    console.log(`是否为凸多边形: ${polygon.isConvex() ? "是" : "否"}`);

    // 点在多边形内判断
    const testPoint = new Point2D(1.5, 1.5);
    console.log(
      `点${testPoint.toString()}在凸包内: ${
        polygon.containsPoint(testPoint) ? "是" : "否"
      }`
    );

    // 最近点对
    console.log("\n--- 最近点对 ---");
    const closestResult = closestPair(points);
    console.log(
      `最近点对: ${closestResult.pair[0].toString()} 和 ${closestResult.pair[1].toString()}`
    );
    console.log(`距离: ${closestResult.distance.toFixed(4)}`);

    // 性能测试
    ComputationalGeometry.performanceTest();
    ComputationalGeometry.closestPairPerformanceTest();
    ComputationalGeometry.segmentIntersectionTest();
  }
}
