import { Resolution } from '../models/resolution.model';
import { RenderProperties } from '../models/render-properties.model';
import { Screen } from './screen';
import { Point } from '../models/point.model';

export class RendererProcessingInfo {
  public time = 0;
  public interruptConfirmed = false;
  public primaryRays = 0;
  public totalRays = 0;
  public transparentIntersections = 0;

  public readonly totalPixels: number;
  public readonly properties: RenderProperties;
  public readonly screen: Screen;
  public readonly pointToTrace: Point | null;

  constructor(
    resolution: Resolution,
    canvasId: string,
    properties?: Partial<RenderProperties>,
  ) {
    this.totalPixels = resolution.width * resolution.height;
    this.screen = new Screen(canvasId, resolution);
    this.properties = this.getRenderProperties(properties);
    this.pointToTrace = this.getPointToTrace();
  }

  public getRenderProperties(properties?: Partial<RenderProperties>): RenderProperties {
    const canvasPointToTrace = properties?.canvasPointToTrace ?? null;

    if (canvasPointToTrace && (
      canvasPointToTrace.x < 0 ||
      canvasPointToTrace.x >= this.screen.canvasEl.clientWidth ||
      canvasPointToTrace.y < 0 ||
      canvasPointToTrace.y >= this.screen.canvasEl.clientHeight)
    ) {
      throw new Error(`point to trace specified does not exist (${canvasPointToTrace.x}, ${canvasPointToTrace.y})`);
    }

    return {
      renderMode: properties?.renderMode ?? 'line',
      resultMode: properties?.resultMode ?? 'image',
      canvasPointToTrace: properties?.canvasPointToTrace ?? null,
    };
  }

  public getPointToTrace(): Point | null {
    const point = this.properties.canvasPointToTrace;
    return point
      ? {
        x: Math.floor(point.x / this.screen.canvasEl.clientWidth * this.screen.resolution.width),
        y: Math.floor(point.y / this.screen.canvasEl.clientHeight * this.screen.resolution.height),
      }
      : null;
  }
}
