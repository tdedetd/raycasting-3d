import { Point3d } from '../../geometry/point-3d';
import { Intersection } from '../../models/intersection.model';
import { CameraRay } from '../../models/camera-ray.model';
import { Material } from '../../models/material.model';
import { SceneObjectProperties } from '../object-properties/scene-object-properties';
import { Rotation } from '../../models/rotation.model';

export abstract class SceneObject {
  private static readonly defaultMaterial: Material = {
    color: [255, 255, 255],
  };

  public readonly position: Point3d;
  public readonly rotation: Rotation;
  public readonly material: Material;

  constructor(properties: SceneObjectProperties) {
    this.position = properties.position;
    this.rotation = properties.rotation ?? { x: 0, y: 0, z: 0 };
    this.material = properties.material ?? SceneObject.defaultMaterial;
  }

  public abstract getIntersections(ray: CameraRay): Intersection[];
}
