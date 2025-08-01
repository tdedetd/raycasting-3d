import { Point3d } from '../geometry/point-3d';
import { Line3d } from '../models/line-3d.models';
import { Ray } from '../models/ray.model';
import { getEquations } from './get-equations';
import { getLength } from './get-length';

export function generateRay(point1: Point3d, point2: Point3d): Ray {
  const line: Line3d = { point1, point2 };
  return {
    line,
    length: getLength(line.point1, line.point2),
    equations: getEquations(line),
  };
}
