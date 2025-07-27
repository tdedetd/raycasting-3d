import { Point3d } from '../../geometry/point-3d';
import { Material } from '../../models/material.model';
import { Rotation } from '../../models/rotation.model';

export interface ObjectProperties {
  position: Point3d;
  rotation?: Rotation;
  material: Material;
}
