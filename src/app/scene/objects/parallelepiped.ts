import { Point3d } from '../../geometry/point-3d';
import { Triangle3d } from '../../geometry/triangle-3d';
import { CameraRay } from '../../models/camera-ray.model';
import { Intersection } from '../../models/intersection.model';
import { Rotator } from '../../renderer/rotator';
import { Mesh } from '../mesh';
import { MeshIntersectionDetector } from '../mesh-intersection-detector';
import { ParallelepipedProperties } from '../object-properties/parallelepiped-properties';
import { SceneObject } from './scene-object';

export class Parallelepiped extends SceneObject {
  public readonly sizeX: number;
  public readonly sizeY: number;
  public readonly sizeZ: number;

  private meshes: Mesh[];

  constructor(properties: ParallelepipedProperties) {
    super(properties);
    this.sizeX = properties.sizeX;
    this.sizeY = properties.sizeY;
    this.sizeZ = properties.sizeZ;
    this.meshes = this.getMeshes();
  }

  public getIntersections(ray: CameraRay): Intersection[] {
    return MeshIntersectionDetector.getIntersections(ray, this.meshes);
  }

  private getMeshes(): Mesh[] {
    const halfSizeX = this.sizeX / 2;
    const halfSizeY = this.sizeY / 2;
    const halfSizeZ = this.sizeZ / 2;

    const rotator = new Rotator(this.position);
    const vertices = rotator.rotatePoints(this.rotation, [
      new Point3d(this.position.x - halfSizeX, this.position.y - halfSizeY, this.position.z - halfSizeZ),
      new Point3d(this.position.x + halfSizeX, this.position.y - halfSizeY, this.position.z - halfSizeZ),
      new Point3d(this.position.x + halfSizeX, this.position.y + halfSizeY, this.position.z - halfSizeZ),
      new Point3d(this.position.x - halfSizeX, this.position.y + halfSizeY, this.position.z - halfSizeZ),
      new Point3d(this.position.x - halfSizeX, this.position.y - halfSizeY, this.position.z + halfSizeZ),
      new Point3d(this.position.x + halfSizeX, this.position.y - halfSizeY, this.position.z + halfSizeZ),
      new Point3d(this.position.x + halfSizeX, this.position.y + halfSizeY, this.position.z + halfSizeZ),
      new Point3d(this.position.x - halfSizeX, this.position.y + halfSizeY, this.position.z + halfSizeZ),
    ]);

    return ([
      [vertices[3], vertices[4], vertices[7]],
      [vertices[0], vertices[3], vertices[4]],
      [vertices[0], vertices[2], vertices[3]],
      [vertices[0], vertices[1], vertices[2]],
      [vertices[1], vertices[4], vertices[5]],
      [vertices[0], vertices[1], vertices[4]],
      [vertices[4], vertices[6], vertices[7]],
      [vertices[4], vertices[5], vertices[6]],
      [vertices[3], vertices[6], vertices[7]],
      [vertices[2], vertices[3], vertices[6]],
      [vertices[2], vertices[5], vertices[6]],
      [vertices[1], vertices[2], vertices[5]],
    ] satisfies [Point3d, Point3d, Point3d][])
      .map(
        ([point1, point2, point3]) => new Mesh(new Triangle3d(point1, point2, point3), this.material)
      );
  }
}
