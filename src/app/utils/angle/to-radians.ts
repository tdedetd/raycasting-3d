const coef = Math.PI / 180;

export function toRadians(degrees: number): number {
  return degrees * coef;
}
