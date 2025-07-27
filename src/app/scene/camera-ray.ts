import { LinearEquation } from '../equations/linear-equation';
import { Line3d } from '../geometry/line-3d';

export interface CameraRay {
  line: Line3d;
  equations: LinearEquation[];
  length: number;
}
