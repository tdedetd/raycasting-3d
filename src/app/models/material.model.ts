import { Color } from './color.model';

export interface Material {
  color: Color;

  /** Must be in interval [0; 1] */
  opacity?: number;
}
