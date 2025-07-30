import { RendererError } from '../errors/renderer-error';
import { Point } from '../models/point.model';
import { Resolution } from '../models/resolution.model';
import { getElement } from '../utils/get-element';
import { Color } from '../models/color.model';

export class Screen {
  public readonly resolution: Resolution;
  private readonly background: string;
  private readonly canvasEl: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(id: string, resolution: Resolution, background: string = 'black') {
    this.resolution = resolution;
    this.background = background;
    this.canvasEl = getElement(id);

    this.canvasEl.width = resolution.width;
    this.canvasEl.height = resolution.height;
    this.context = this.getContext(this.canvasEl);
  }

  public clear(): void {
    this.context.fillStyle = this.background;
    this.context.clearRect(0, 0, this.resolution.width, this.resolution.height);
  }

  public drawLine(point1: Point, point2: Point, color: Color, width = 1): void {
    this.context.strokeStyle = this.colorToString(color);
    this.context.lineWidth = width;
    this.context.lineCap = 'round';
    this.context.beginPath();
    this.context.moveTo(point1.x, point1.y);
    this.context.lineTo(point2.x, point2.y);
    this.context.stroke();
  }

  public drawPixel(x: number, y: number, color: Color): void {
    this.context.fillStyle = this.colorToString(color);
    this.context.fillRect(x, y, 1, 1);
  }

  private getContext(element: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = element.getContext('2d');
    if (context) {
      return context;
    }
    throw new RendererError('No contaxt for canvas element');
  }

  private colorToString(color: Color): string {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }
}
