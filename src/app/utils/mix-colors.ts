import { Color } from '../models/color.model';

export function mixColors(color1: Color, color2: Color, ratio = 0.5): Color {
  const ratioCurrent = 1 - ratio;
  return [
    color1[0] * ratioCurrent + color2[0] * ratio,
    color1[1] * ratioCurrent + color2[1] * ratio,
    color1[2] * ratioCurrent + color2[2] * ratio,
  ];
}
