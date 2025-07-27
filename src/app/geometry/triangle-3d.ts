import { LinearEquation } from '../models/linear-equation.model';
import { Point3d } from './point-3d';
import { Vector } from './vector-3d';

export class Triangle3d {

  constructor(public readonly point1: Point3d,
              public readonly point2: Point3d,
              public readonly point3: Point3d) { }

  /* Generic matrix
    | x - x0   x1 - x0   x2 - x0 |
    | y - y0   y1 - y0   y2 - y0 |
    | z - z0   z1 - z0   z2 - z0 |
  */
  public getPlaneEquation(): LinearEquation {
    const x0 = this.point1.x;
    const y0 = this.point1.y;
    const z0 = this.point1.z;
    const x1 = this.point2.x;
    const y1 = this.point2.y;
    const z1 = this.point2.z;
    const x2 = this.point3.x;
    const y2 = this.point3.y;
    const z2 = this.point3.z;

    const dx1 = x1 - x0;
    const dx2 = x2 - x0;
    const dy1 = y1 - y0;
    const dy2 = y2 - y0;
    const dz1 = z1 - z0;
    const dz2 = z2 - z0;

    const coefX = dy1 * dz2 - dy2 * dz1;
    const coefY = dx2 * dz1 - dx1 * dz2;
    const coefZ = dx1 * dy2 - dx2 * dy1;
    const constant = x0 * (dy2 * dz1 - dy1 * dz2) +
                     y0 * (dx1 * dz2 - dx2 * dz1) +
                     z0 * (dx2 * dy1 - dx1 * dy2);

    return {
      coefficients: [coefX, coefY, coefZ],
      constant
    };
  }

  /**
   * Is guaranteed, that the point is on triangle plane
   */
  public pointInside(point: Point3d): boolean {
    const vector1 = new Vector(this.point1.subtract(point));
    const vector2 = new Vector(this.point2.subtract(point));
    const vector3 = new Vector(this.point3.subtract(point));

    const angle = vector1.getAngle(vector2) + vector2.getAngle(vector3) + vector3.getAngle(vector1);
    return angle >= 359.999999;
  }
}
