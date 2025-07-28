import { Point3d } from '../../geometry/point-3d';
import { Triangle3d } from '../../geometry/triangle-3d';
import { CameraRay } from '../../models/camera-ray.model';
import { Intersection } from '../../models/intersection.model';
import { Rotator } from '../../renderer/rotator';
import { Mesh } from '../mesh';
import { MeshIntersectionDetector } from '../mesh-intersection-detector';
import { PlaneProperties } from '../object-properties/plane-properties';
import { SceneObject } from './scene-object';

export class Plane extends SceneObject {
  public readonly sizeX: number;
  public readonly sizeY: number;

  private meshes: Mesh[];

  constructor(properties: PlaneProperties) {
    super(properties);
    this.sizeX = properties.sizeX;
    this.sizeY = properties.sizeY ?? properties.sizeX;
    this.meshes = this.getMeshes();
  }

  public getIntersections(ray: CameraRay): Intersection[] {
    return MeshIntersectionDetector.getIntersections(ray, this.meshes);
  }

  private getMeshes(): Mesh[] {
    const halfSizeX = this.sizeX / 2;
    const halfSizeY = this.sizeY / 2;

    const rotator = new Rotator(this.position);
    const vertices = rotator.rotatePoints(this.rotation, [
      new Point3d(this.position.x - halfSizeX, this.position.y - halfSizeY, this.position.z),
      new Point3d(this.position.x + halfSizeX, this.position.y - halfSizeY, this.position.z),
      new Point3d(this.position.x + halfSizeX, this.position.y + halfSizeY, this.position.z),
      new Point3d(this.position.x - halfSizeX, this.position.y + halfSizeY, this.position.z),
    ]);

    return ([
      [vertices[0], vertices[1], vertices[2]],
      [vertices[0], vertices[2], vertices[3]],
    ] satisfies [Point3d, Point3d, Point3d][])
      .map(
        ([point1, point2, point3]) => new Mesh(new Triangle3d(point1, point2, point3), this.material)
      );
  }
}
