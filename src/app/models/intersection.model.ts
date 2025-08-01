import { Point3d } from '../geometry/point-3d';
import { SceneObject } from '../scene/objects/scene-object';
import { Material } from './material.model';

export interface Intersection {
  material: Material;
  point: Point3d;
  distance: number;
  object: SceneObject;
}
