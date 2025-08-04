import { RenderMode } from '../models/render-mode.model';
import { Resolution } from '../models/resolution.model';

export class RendererProcessingInfo {
  public time = 0;
  public interruptConfirmed = false;
  public primaryRays = 0;
  public totalRays = 0;
  public transparentIntersections = 0;

  public readonly mode: RenderMode;
  public readonly totalPixels: number;

  constructor(resolution: Resolution, mode: RenderMode = 'main') {
    this.mode = mode;
    this.totalPixels = resolution.width * resolution.height;
  }
}
