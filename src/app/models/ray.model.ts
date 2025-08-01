import { LinearEquation } from './linear-equation.model';
import { Line3d } from './line-3d.models';

export interface Ray {
  /** The first point is orgin of the ray */
  line: Line3d;
  equations: LinearEquation[];
  length: number;
}
