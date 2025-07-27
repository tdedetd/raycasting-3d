import { Point3d } from '../geometry/point-3d';

export function getLength(point1: Point3d, point2: Point3d): number {
  return Math.sqrt(
    (point1.x - point2.x) * (point1.x - point2.x) +
    (point1.y - point2.y) * (point1.y - point2.y) +
    (point1.z - point2.z) * (point1.z - point2.z));
}
