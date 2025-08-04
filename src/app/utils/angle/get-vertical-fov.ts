import { toDegrees } from './to-degrees';
import { toRadians } from './to-radians';

export function getVerticalFov(hFov: number, width: number, height: number): number {
  const vFovRad = 2 * Math.atan(
    Math.tan(toRadians(hFov) / 2) * height / width
  );
  return toDegrees(vFovRad);
}
