import { LinearEquation } from '../models/linear-equation.model';
import { Line3d } from '../models/line-3d.models';
import { Point3d } from '../geometry/point-3d';
import { Triangle3d } from '../geometry/triangle-3d';

export function getEquations(line: Line3d): LinearEquation[] {
  const triangle1 = new Triangle3d(line.point1, line.point2, line.point1.add(new Point3d(3.124543, 6.83475, 0)));
  const triangle2 = new Triangle3d(line.point1, line.point2, line.point1.add(new Point3d(3.124543, 0, 6.83475)));
  return [
    triangle1.getPlaneEquation(),
    triangle2.getPlaneEquation()
  ];
}
