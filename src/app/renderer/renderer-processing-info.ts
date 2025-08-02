import { RenderMode } from '../models/render-mode.model';

export class RendererProcessingInfo {
  public time = 0;
  public interruptConfirmed = false;
  public primaryRays = 0;
  public totalRays = 0;
  public transparentIntersections = 0;
  public mode: RenderMode = 'main';
}
