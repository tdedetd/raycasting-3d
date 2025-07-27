// TODO: to function
export class QuadraticEquation {
  constructor(public readonly a: number,
              public readonly b: number,
              public readonly c: number) {}

  public solve(): number[] {
    const d = this.b * this.b - 4 * this.a * this.c;
    if (d < 0) {
      return [];
    }

    const denominator = 2 * this.a;
    if (d === 0) return [-this.b / denominator];

    const sqrtd = Math.sqrt(d);
    return [(-this.b + sqrtd) / denominator, (-this.b - sqrtd) / denominator];
  }
}
