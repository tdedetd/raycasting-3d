export class Color {

  constructor(public r: number,
              public g: number,
              public b: number) {}

  public mix(color: Color, ratio = 0.5): Color {
    const ratioCurrent = 1 - ratio;
    return new Color(
      this.r * ratioCurrent + color.r * ratio,
      this.g * ratioCurrent + color.g * ratio,
      this.b * ratioCurrent + color.b * ratio
    );
  }

  public toString(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}
