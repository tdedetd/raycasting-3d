import { Point3d } from './point-3d';

export class PointSpherical {

  /**
   * @param distance distance from origin to point
   * @param angleVertical latitude. from -90 to 90
   * @param angleHorizontal azimuthal angle
   */
  constructor(public readonly distance: number,
              public readonly angleVertical: number,
              public readonly angleHorizontal: number) {}

  public toCartesian(origin?: Point3d): Point3d {
    const angleVerticalRad = (this.angleVertical + 90) * Math.PI / 180;
    const angleHorizontalRad = this.angleHorizontal * Math.PI / 180;

    const x = this.distance * Math.sin(angleVerticalRad) * Math.cos(angleHorizontalRad);
    const y = this.distance * Math.sin(angleVerticalRad) * Math.sin(angleHorizontalRad);
    const z = this.distance * Math.cos(angleVerticalRad);

    const point = new Point3d(x, y, z);
    if (origin) {
      return point.add(origin);
    }
    return point;
  }
}
