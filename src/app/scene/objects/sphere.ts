import { Point3d } from '../../geometry/point-3d';
import { Intersection } from '../../models/intersection.model';
import { getLength } from '../../utils/get-length';
import { solveQuadraticEquation } from '../../utils/solve-quadratic-equation';
import { CameraRay } from '../../models/camera-ray.model';
import { SphereProperties } from '../object-properties/sphere-properties';
import { SceneObject } from './scene-object';

export class Sphere extends SceneObject {
  public readonly radius: number;

  constructor(properties: SphereProperties) {
    super(properties);
    this.radius = properties.radius;
  }

  public getIntersections(ray: CameraRay): Intersection[] {
    const p1 = ray.line.point1;
    const p2 = ray.line.point2;
    const v = p2.subtract(p1);
    const o = this.position;
    const r = this.radius;
    const x0 = o.x;
    const y0 = o.y;
    const z0 = o.z;
    const x1 = p1.x;
    const y1 = p1.y;
    const z1 = p1.z;

    const a = v.x * v.x + v.y * v.y + v.z * v.z;
    const b = 2 * (x1 * v.x - x0 * v.x + y1 * v.y - y0 * v.y + z1 * v.z - z0 * v.z);
    const c = x0 * x0 + x1 * x1 + y0 * y0 + y1 * y1 + z0 * z0 + z1 * z1 - r * r - 2 * (x0 * x1 + y0 * y1 + z0 * z1);

    const solutions = solveQuadraticEquation(a, b, c);

    return solutions.map((solution) => {
      const point = new Point3d(x1 + v.x * solution, y1 + v.y * solution, z1 + v.z * solution);
      return {
        material: this.material,
        point,
        distance: getLength(ray.line.point1, point),
      };
    });
  }
}
