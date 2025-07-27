import { Point3d } from '../geometry/point-3d';
import { Material } from './material.model';

export interface Intersection {
  material: Material;
  point: Point3d;
  distance: number;
}
