import { LinearEquation } from './linear-equation.model';
import { Line3d } from './line-3d.models';

export interface CameraRay {
  line: Line3d;
  equations: LinearEquation[];
  length: number;
}
