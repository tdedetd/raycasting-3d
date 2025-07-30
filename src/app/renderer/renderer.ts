import { Resolution } from '../models/resolution.model';
import { Screen } from './screen';
import { Intersection } from '../models/intersection.model';
import { Scene } from '../scene/scene';
import { Camera } from '../scene/camera';
import { Counters } from '../debug/counters';
import { CameraRay } from '../models/camera-ray.model';
import { Color } from '../models/color.model';
import { mixColors } from '../utils/mix-colors';

export class Renderer {
  private startRenderTimestamp: number | null = null;
  private interruptConfirmed = false;

  constructor(
    private readonly scene: Scene,
    private readonly canvasId: string,
  ) {}

  public get camera(): Camera {
    return this.scene.camera;
  }

  /**
   * @returns time of rendering in miliseconds
   */
  public render(resolution: Resolution): Promise<number> {
    const screen = new Screen(this.canvasId, resolution);
    this.camera.resolution = resolution;
    this.camera.updateCanvasConfig();

    this.startRenderTimestamp = performance.now();
    return new Promise((resolve, reject) => {
      this.renderPixel(resolve, reject, resolution, screen, 0);
    });
  }

  public interrupt(): void {
    this.interruptConfirmed = true;
  }

  private renderPixel(
    resolve: (value: number | PromiseLike<number>) => void,
    reject: (reason?: unknown) => void,
    resolution: Resolution,
    screen: Screen,
    y: number,
  ): void {
    setTimeout(() => {
      for (let x = 0; x < resolution.width; x++) {
        const ray = this.camera.generateRay(x, y);
        const color = this.getColor(ray);
        screen.drawPixel(x, y, color);
      }

      const newY = y + 1;

      if (!this.interruptConfirmed && newY !== resolution.height) {
        this.renderPixel(resolve, reject, resolution, screen, newY);
      } else {
        Counters.log();
        if (this.startRenderTimestamp !== null) {
          resolve(performance.now() - this.startRenderTimestamp);
        } else {
          reject('no value for startRenderTimestamp');
        }
        this.startRenderTimestamp = null;
        this.interruptConfirmed = false;
      }
    });
  }

  private getColor(ray: CameraRay): Color {
    let closestIntersection: Intersection | undefined;

    this.scene.getObjects().forEach(obj => {
      const intersections = obj.getIntersections(ray);
      intersections.forEach(intersection => {
        if (!closestIntersection || intersection.distance < closestIntersection.distance) {
          closestIntersection = intersection;
        }
      });
    });

    if (closestIntersection) {
      const color = closestIntersection.material.color;
      return mixColors(color, this.scene.backgroundColor, this.getMixFogCoefficient(closestIntersection.distance));
    }
    return this.scene.backgroundColor;
  }

  private getMixFogCoefficient(distance: number): number {
    if (distance < this.camera.fogStart) {
      return 0;
    }

    return (distance - this.camera.fogStart) / (this.camera.distance - this.camera.fogStart);
  }
}
