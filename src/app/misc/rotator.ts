import { Point3d } from '../geometry/point-3d';
import { Matrix } from '../matrix/matrix';
import { Rotation } from '../scene/rotation';

export class Rotator {

  constructor(public readonly pivot?: Point3d) {
    if (!pivot) this.pivot = new Point3d(0, 0, 0);
  }

  /**
   * Return point rotated by specific angles
   */
  public rotatePoint(rotation: Rotation, point: Point3d): Point3d {
    const xRad = rotation.x * Math.PI / 180;
    const yRad = rotation.y * Math.PI / 180;
    const zRad = rotation.z * Math.PI / 180;
    const point0 = point.subtract(this.pivot);

    const rotationMatrixX = new Matrix([
      [1, 0, 0],
      [0, Math.cos(xRad), -Math.sin(xRad)],
      [0, Math.sin(xRad), Math.cos(xRad)]
    ]);

    const rotationMatrixY = new Matrix([
      [Math.cos(yRad), 0, Math.sin(yRad)],
      [0, 1, 0],
      [-Math.sin(yRad), 0, Math.cos(yRad)]
    ]);

    const rotationMatrixZ = new Matrix([
      [Math.cos(zRad), -Math.sin(zRad), 0],
      [Math.sin(zRad), Math.cos(zRad), 0],
      [0, 0, 1]
    ]);

    const coordsRotatedX = rotationMatrixX.multiply(new Matrix([[point0.x], [point0.y], [point0.z]]));
    const coordsRotatedXY = rotationMatrixY.multiply(coordsRotatedX);
    const coordsRotatedXYZ = rotationMatrixZ.multiply(coordsRotatedXY);
    const x1 = coordsRotatedXYZ.values[0][0];
    const y1 = coordsRotatedXYZ.values[1][0];
    const z1 = coordsRotatedXYZ.values[2][0];

    return new Point3d(x1, y1, z1).add(this.pivot);
  }

  /**
   * Return points rotated by specific angles
   */
  public rotatePoints(rotation: Rotation, points: Point3d[]): Point3d[] {
    return points.map(point => this.rotatePoint(rotation, point));
  }
}
