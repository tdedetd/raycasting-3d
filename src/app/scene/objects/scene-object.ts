import { Point3d } from '../../geometry/point-3d';
import { Intersection } from '../../models/intersection.model';
import { CameraRay } from '../../models/camera-ray.model';
import { Material } from '../../models/material.model';
import { ObjectProperties } from '../object-properties/object-properties';
import { Rotation } from '../../models/rotation.model';

export abstract class SceneObject {
  public readonly position: Point3d;
  public readonly rotation: Rotation;
  public readonly material: Material;

  constructor(properties: ObjectProperties) {
    this.position = properties.position;
    this.rotation = properties.rotation ?? { x: 0, y: 0, z: 0 };
    this.material = properties.material;
  }

  public getIntersections(ray: CameraRay): Intersection[] {
    throw new Error('Method is not implemented');
  }
}
