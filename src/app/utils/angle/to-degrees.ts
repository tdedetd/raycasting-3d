const coef = 180 / Math.PI;

export function toDegrees(radians: number): number {
  return radians * coef;
}
