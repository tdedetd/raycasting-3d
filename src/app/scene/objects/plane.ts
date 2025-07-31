import { Point3d } from '../../geometry/point-3d';
import { Triangle3d } from '../../geometry/triangle-3d';
import { Rotator } from '../../renderer/rotator';
import { Mesh } from '../mesh';
import { PlaneProperties } from '../object-properties/plane-properties';
import { MeshSceneObject } from './mesh-scene-object';

export class Plane extends MeshSceneObject {
  constructor(properties: PlaneProperties) {
    super(properties);
  }

  protected getMeshes(properties: PlaneProperties): Mesh[] {
    const sizeX = properties.sizeX;
    const sizeY = properties.sizeY ?? properties.sizeX;
    const halfSizeX = sizeX / 2;
    const halfSizeY = sizeY / 2;

    const rotator = new Rotator(this.rotation, this.position);
    const vertices = rotator.rotatePoints([
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
