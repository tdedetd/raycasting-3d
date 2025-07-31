import { Point3d } from '../../geometry/point-3d';
import { Triangle3d } from '../../geometry/triangle-3d';
import { Rotator } from '../../renderer/rotator';
import { Mesh } from '../mesh';
import { ParallelepipedProperties } from '../object-properties/parallelepiped-properties';
import { MeshSceneObject } from './mesh-scene-object';

export class Parallelepiped extends MeshSceneObject {
  constructor(properties: ParallelepipedProperties) {
    super(properties);
  }

  protected getMeshes({ sizeX, sizeY, sizeZ }: ParallelepipedProperties): Mesh[] {
    const halfSizeX = (sizeX ?? 1) / 2;
    const halfSizeY = (sizeY ?? 1) / 2;
    const halfSizeZ = (sizeZ ?? 1) / 2;

    const rotator = new Rotator(this.rotation, this.position);
    const vertices = rotator.rotatePoints([
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
