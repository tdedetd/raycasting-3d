import { LinearEquation } from '../equations/linear-equation';
import { Point3d } from './point-3d';
import { Triangle3d } from './triangle-3d';

export class Line3d {

  constructor(public readonly point1: Point3d,
              public readonly point2: Point3d) {}

  public getEquations(): LinearEquation[] {
    const triangle1 = new Triangle3d(this.point1, this.point2, this.point1.add(new Point3d(3.124543, 6.83475, 0)));
    const triangle2 = new Triangle3d(this.point1, this.point2, this.point1.add(new Point3d(3.124543, 0, 6.83475)));
    return [
      triangle1.getPlaneEquation(),
      triangle2.getPlaneEquation()
    ];
  }

  public getLength(): number {
    return Math.sqrt(
      (this.point1.x - this.point2.x) * (this.point1.x - this.point2.x) +
      (this.point1.y - this.point2.y) * (this.point1.y - this.point2.y) +
      (this.point1.z - this.point2.z) * (this.point1.z - this.point2.z));
  }
}
