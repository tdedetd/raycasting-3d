import { Resolution } from '../models/resolution.model';
import { Screen } from './screen';
import { Intersection } from '../models/intersection.model';
import { Scene } from '../scene/scene';
import { Camera } from '../scene/camera';
import { Ray } from '../models/ray.model';
import { Color } from '../models/color.model';
import { mixColors } from '../utils/mix-colors';
import { generateRay } from '../utils/generate-ray';
import { getLength } from '../utils/get-length';
import { SceneObject } from '../scene/objects/scene-object';
import { removeElementFrom } from '../utils/array/remove-element-from';
import { RendererProcessingInfo } from './renderer-processing-info';
import { RenderMode } from '../models/render-mode.model';
import { Point } from '../models/point.model';

interface RenderSummary {
  time: number;
  primaryRays: number;
  totalRays: number;
  transparentIntersections: number;
  progress: number;
  status: 'success' | 'interrupted';
}

export class Renderer {
  private processingInfo: RendererProcessingInfo;

  constructor(
    private readonly scene: Scene,
    private readonly canvasId: string,
  ) {
    this.processingInfo = new RendererProcessingInfo(this.resolution);
  }

  public get camera(): Camera {
    return this.scene.camera;
  }

  private get resolution(): Resolution {
    return this.camera.resolution;
  }

  /**
   * @returns time of rendering in miliseconds
   */
  public render(mode: RenderMode = 'main', progressive = false): Promise<RenderSummary> {
    const screen = new Screen(this.canvasId, this.resolution);
    this.camera.updateCanvasConfig();

    this.processingInfo = new RendererProcessingInfo(this.resolution, mode);
    return new Promise((resolve, reject) => {
      if (progressive) {
        this.runTaskProgressive(
          resolve,
          reject,
          screen,
          { x: 0, y: 0 },
          this.resolution.width,
          this.resolution.height,
          true
        );
      } else {
        this.runTask(resolve, reject, this.resolution, screen, 0);
      }
    });
  }

  public interrupt(): void {
    this.processingInfo.interruptConfirmed = true;
  }

  private runTask(
    resolve: (value: RenderSummary | PromiseLike<RenderSummary>) => void,
    reject: (reason?: unknown) => void,
    resolution: Resolution,
    screen: Screen,
    yStart: number,
  ): void {
    setTimeout(() => {
      const timestamp = performance.now();

      for (let x = 0; x < resolution.width; x++) {
        const primaryRay = this.camera.generateRayV2(x, yStart);
        this.processingInfo.primaryRays++;
        const color = this.castRay(primaryRay, this.scene.getObjects());
        screen.drawPixel(x, yStart, color);
      }

      const newYStart = yStart + 1;

      if (!this.processingInfo.interruptConfirmed && this.processingInfo.primaryRays < this.processingInfo.totalPixels) {
        this.runTask(resolve, reject, resolution, screen, newYStart);
        this.processingInfo.time += performance.now() - timestamp;
      } else {
        this.processingInfo.time += performance.now() - timestamp;
        resolve({
          time: this.processingInfo.time,
          primaryRays: this.processingInfo.primaryRays,
          totalRays: this.processingInfo.totalRays,
          transparentIntersections: this.processingInfo.transparentIntersections,
          progress: this.processingInfo.primaryRays / this.processingInfo.totalPixels,
          status: this.processingInfo.primaryRays >= this.processingInfo.totalPixels ? 'success' : 'interrupted',
        });
      }
    });
  }

  private runTaskProgressive(
    resolve: (value: RenderSummary | PromiseLike<RenderSummary>) => void,
    reject: (reason?: unknown) => void,
    screen: Screen,
    startPoint: Point,
    width: number,
    hegiht: number,
    initial = false
  ): void {
    setTimeout(() => {
      const timestamp = performance.now();

      const stepX = Math.round(width / 10);
      const stepY = Math.round(hegiht / 10);

      if (stepX < 2 || stepY < 2) {
        for (let y = startPoint.y; y < startPoint.y + hegiht; y++) {
          for (let x = startPoint.x; x < startPoint.x + width; x++) {
            const primaryRay = this.camera.generateRayV2(x, y);
            this.processingInfo.primaryRays++;
            const color = this.castRay(primaryRay, this.scene.getObjects());
            screen.drawPixel(x, y, color);
          }
        }
      } else {
        for (let y = startPoint.y; y < startPoint.y + hegiht; y += stepY) {
          for (let x = startPoint.x; x < startPoint.x + width; x += stepX) {
            if (initial || x !== startPoint.x || y !== startPoint.y) {
              const primaryRay = this.camera.generateRayV2(x, y);
              this.processingInfo.primaryRays++;
              const color = this.castRay(primaryRay, this.scene.getObjects());

              const newWidth = Math.min(stepX, Math.abs(x + stepX - width));
              const newHeight = Math.min(stepY, Math.abs(y + stepY - hegiht));
              screen.drawRectangle(x, y, newWidth, newHeight, color);

              this.runTaskProgressive(
                resolve,
                reject,
                screen,
                { x, y },
                newWidth,
                newHeight
              );
            }
          }
        }
      }

      this.processingInfo.time += performance.now() - timestamp;
      const renderingIsDone = this.processingInfo.primaryRays >= this.processingInfo.totalPixels;
      if (this.processingInfo.interruptConfirmed || renderingIsDone) {
        resolve({
          time: this.processingInfo.time,
          primaryRays: this.processingInfo.primaryRays,
          totalRays: this.processingInfo.totalRays,
          transparentIntersections: this.processingInfo.transparentIntersections,
          progress: this.processingInfo.primaryRays / this.processingInfo.totalPixels,
          status: renderingIsDone ? 'success' : 'interrupted',
        });
      }
    });
  }

  private castRay(ray: Ray, objects: SceneObject[]): Color {
    this.processingInfo.totalRays++;
    let closestIntersection: Intersection | undefined;

    objects.forEach(obj => {
      const intersections = obj.getIntersections(ray);
      intersections.forEach(intersection => {
        if (!closestIntersection || intersection.distance < closestIntersection.distance) {
          closestIntersection = intersection;
        }
      });
    });

    if (this.processingInfo.mode === 'depthMap') {
      return this.getDephColor(closestIntersection);
    }

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

  private getDephColor(intersection?: Intersection): Color {
    const colorFrom: Color = [255, 255, 255];
    const colorTo: Color = [0, 0, 0];

    if (intersection) {
      const distanceToCamera = getLength(this.camera.position, intersection.point);
      return distanceToCamera > this.camera.distance
        ? [255, 0, 0]
        : mixColors(colorFrom, colorTo, distanceToCamera / this.camera.distance);
    } else {
      return colorTo;
    }
  }
}
