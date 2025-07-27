import { PointSpherical } from './point-spherical';

export class Point3d {

  constructor(public readonly x: number,
              public readonly y: number,
              public readonly z: number) {}

  public add(point: Point3d): Point3d {
    return new Point3d(this.x + point.x, this.y + point.y, this.z + point.z);
  }

  public subtract(point: Point3d): Point3d {
    return new Point3d(this.x - point.x, this.y - point.y, this.z - point.z);
  }

  public toSpherical(origin?: Point3d): PointSpherical {
    const { x, y, z } = origin ? this.subtract(origin) : this;
    const r = Math.sqrt(x * x + y * y + z * z);

    return new PointSpherical(
      r,
      Math.acos(z / r) * 180 / Math.PI - 90,
      Math.atan(y / x) * 180 / Math.PI
    );
  }
}
