export function solveQuadraticEquation(
  a: number,
  b: number,
  c: number,
): number[] {
  const d = b * b - 4 * a * c;
  if (d < 0) {
    return [];
  }

  const denominator = 2 * a;
  if (d === 0) return [-b / denominator];

  const sqrtd = Math.sqrt(d);
  return [(-b + sqrtd) / denominator, (-b - sqrtd) / denominator];
}
