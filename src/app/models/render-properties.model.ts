import { Point } from './point.model';
import { RenderMode } from './render-mode.model';
import { ResultMode } from './result-mode.model';

export interface RenderProperties {
  resultMode: ResultMode;
  renderMode: RenderMode;
  canvasPointToTrace: Point | null;
}
