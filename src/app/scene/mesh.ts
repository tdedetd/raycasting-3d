import { LinearEquation } from '../equations/linear-equation';
import { Triangle3d } from '../geometry/triangle-3d';
import { Material } from "./material";

export class Mesh {
  public readonly equation: LinearEquation;

  constructor(
    public readonly triangle: Triangle3d,
    public readonly material: Material
  ) {
    this.equation = this.triangle.getPlaneEquation();
  }
}
