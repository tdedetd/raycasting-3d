import { Point3d } from '../../geometry/point-3d';
import { PointSpherical } from '../../geometry/point-spherical';
import { Triangle3d } from '../../geometry/triangle-3d';
import { Rotator } from '../../renderer/rotator';
import { genArray } from '../../utils/array/gen-array';
import { Mesh } from '../mesh';
import { PrismProperties } from '../object-properties/prism-properties';
import { MeshSceneObject } from './mesh-scene-object';

export class Prism extends MeshSceneObject {
  constructor(properties: PrismProperties) {
    super(properties);
  }

  protected getMeshes(properties: PrismProperties): Mesh[] {
    const angles = properties.angles ?? 3;
    const radius = properties.radius ?? 1;
    const hight = properties.hight ?? 1;

    if (angles < 3) {
      throw new Error(`amount of angles is less than 3 (${angles})`);
    }

    const rotator = new Rotator(this.rotation, this.position);
    const halfHight = hight / 2;

    const bottomBaseCenter = this.position.subtract(new Point3d(0, 0, halfHight));
    const bottomBaseCenterRotated = rotator.rotatePoint(bottomBaseCenter);
    const bottomBaseVertices = this.getBaseVartices(bottomBaseCenter, angles, radius);
    const bottomBaseVerticesRotated = rotator.rotatePoints(bottomBaseVertices);

    const upperBaseCenter = this.position.add(new Point3d(0, 0, halfHight));
    const upperBaseCenterRotated = rotator.rotatePoint(upperBaseCenter);
    const upperBaseVertices = this.getBaseVartices(upperBaseCenter, angles, radius);
    const upperBaseVerticesRotated = rotator.rotatePoints(upperBaseVertices);

    const facesTriangles = genArray<[Triangle3d, Triangle3d]>(angles, (i) => {
      const nextIndex = (i + 1) % angles;
      return [
        new Triangle3d(
          bottomBaseVerticesRotated[i],
          bottomBaseVerticesRotated[nextIndex],
          upperBaseVerticesRotated[i],
        ),
        new Triangle3d(
          bottomBaseVerticesRotated[nextIndex],
          upperBaseVerticesRotated[nextIndex],
          upperBaseVerticesRotated[i],
        ),
      ];
    }).flat();

    return [
      ...this.getBaseTriangles(bottomBaseCenterRotated, bottomBaseVerticesRotated),
      ...this.getBaseTriangles(upperBaseCenterRotated, upperBaseVerticesRotated),
      ...facesTriangles,
    ].map((triangle) => new Mesh(triangle, this.material));
  }

  private getBaseVartices(origin: Point3d, count: number, radius: number): Point3d[] {
    const angle = 360 / count;
    return genArray(count, (i) => new PointSpherical(radius, 0, angle * i).toCartesian(origin));
  }

  private getBaseTriangles(center: Point3d, points: Point3d[]): Triangle3d[] {
    return genArray(points.length, (i) => {
      return new Triangle3d(
        center,
        points[i],
        points[(i + 1) % points.length],
      );
    });
  }
}
