import { Point3d } from '../../geometry/point-3d';
import { Intersection } from '../../renderer/intersection';
import { CameraRay } from '../camera-ray';
import { Material } from '../material';
import { ObjectProperties } from '../object-properties/object-properties';
import { Rotation } from '../rotation';

export abstract class SceneObject {
  public readonly position: Point3d;
  public readonly rotation: Rotation;
  public readonly material: Material;

  constructor(properties: ObjectProperties) {
    this.position = properties.position;
    this.rotation = properties.rotation ?? new Rotation(0, 0, 0);
    this.material = properties.material;
  }

  public getIntersections(ray: CameraRay): Intersection[] {
    throw new Error('Method is not implemented');
  }
}
