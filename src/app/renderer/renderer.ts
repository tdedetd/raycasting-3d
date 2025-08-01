import { Resolution } from '../models/resolution.model';
import { Screen } from './screen';
import { Intersection } from '../models/intersection.model';
import { Scene } from '../scene/scene';
import { Camera } from '../scene/camera';
import { Counters } from '../debug/counters';
import { Ray } from '../models/ray.model';
import { Color } from '../models/color.model';
import { mixColors } from '../utils/mix-colors';
import { generateRay } from '../utils/generate-ray';
import { getLength } from '../utils/get-length';
import { SceneObject } from '../scene/objects/scene-object';
import { removeElementFrom } from '../utils/array/remove-element-from';
import { RendererProcessingInfo } from './renderer-processing-info';

interface RenderSummary {
  time: number;
  primaryRays: number;
  totalRays: number;
  transparentIntersections: number;
  progress: number;
  status: 'success' | 'interrupted';
}

export class Renderer {
  private processingInfo = new RendererProcessingInfo();

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
  public render(resolution: Resolution): Promise<RenderSummary> {
    const screen = new Screen(this.canvasId, resolution);
    this.camera.resolution = resolution;
    this.camera.updateCanvasConfig();

    this.processingInfo = new RendererProcessingInfo();
    return new Promise((resolve, reject) => {
      this.renderPixel(resolve, reject, resolution, screen, 0);
    });
  }

  public interrupt(): void {
    this.processingInfo.interruptConfirmed = true;
  }

  private renderPixel(
    resolve: (value: RenderSummary | PromiseLike<RenderSummary>) => void,
    reject: (reason?: unknown) => void,
    resolution: Resolution,
    screen: Screen,
    yStart: number,
  ): void {
    setTimeout(() => {
      const timestamp = performance.now();

      for (let x = 0; x < resolution.width; x++) {
        const primaryRay = this.camera.generateRay(x, yStart);
        this.processingInfo.primaryRays++;
        const color = this.castRay(primaryRay, this.scene.getObjects());
        screen.drawPixel(x, yStart, color);
      }

      const newYStart = yStart + 1;

      if (!this.processingInfo.interruptConfirmed && newYStart !== resolution.height) {
        this.renderPixel(resolve, reject, resolution, screen, newYStart);
        this.processingInfo.time += performance.now() - timestamp;
      } else {
        Counters.log();
        this.processingInfo.time += performance.now() - timestamp;
        resolve({
          time: this.processingInfo.time,
          primaryRays: this.processingInfo.primaryRays,
          totalRays: this.processingInfo.totalRays,
          transparentIntersections: this.processingInfo.transparentIntersections,
          progress: newYStart / this.camera.resolution.height,
          status: newYStart === this.camera.resolution.height ? 'success' : 'interrupted',
        });
      }
    });
  }

  private castRay(ray: Ray, objects: SceneObject[]): Color {
    this.processingInfo.totalRays++;
    let closestIntersection: Intersection | null = null;

    objects.forEach(obj => {
      const intersections = obj.getIntersections(ray);
      intersections.forEach(intersection => {
        if (!closestIntersection || intersection.distance < closestIntersection.distance) {
          closestIntersection = intersection;
        }
      });
    });

    return closestIntersection
      ? this.handleIntersection(closestIntersection, ray, objects)
      : this.scene.backgroundColor;
  }

  private handleIntersection(
    intersection: Intersection,
    ray: Ray,
    objects: SceneObject[],
  ): Color {
    const distanceToCamera = getLength(this.camera.position, intersection.point);

    const currentIntersectionColor = mixColors(
      intersection.material.color,
      this.scene.backgroundColor,
      this.getMixFogCoefficient(distanceToCamera)
    );

    const opacity = intersection.material.opacity;
    if (typeof opacity !== 'undefined' && opacity !== 1) {
      this.processingInfo.transparentIntersections++;
      const newRay = generateRay(
        intersection.point,
        ray.line.point2,
      );
      return mixColors(
        this.castRay(newRay, removeElementFrom(objects, intersection.object)),
        currentIntersectionColor,
        opacity
      );
    }

    return currentIntersectionColor;
  }

  private getMixFogCoefficient(distance: number): number {
    if (distance < this.camera.fogStart) {
      return 0;
    }

    return (distance - this.camera.fogStart) / (this.camera.distance - this.camera.fogStart);
  }
}
