import { Point3d } from '../../geometry/point-3d';
import { Material } from '../../models/material.model';
import { Rotation } from '../../models/rotation.model';

export interface SceneObjectProperties {
  name?: string;
  position: Point3d;
  rotation?: Rotation;
  material?: Material;
}
