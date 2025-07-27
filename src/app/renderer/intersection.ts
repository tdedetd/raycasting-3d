import { Point3d } from '../geometry/point-3d';
import { Material } from '../scene/material';

export class Intersection {

  constructor(public readonly material: Material,
              public readonly point: Point3d,
              public readonly distance: number) {}
}
