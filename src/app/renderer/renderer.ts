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
import { Point } from '../models/point.model';
import { RenderProperties } from '../models/render-properties.model';

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
    this.processingInfo = this.getProcessingInfo();
  }

  public get camera(): Camera {
    return this.scene.camera;
  }

  private get resolution(): Resolution {
    return this.camera.resolution;
  }

  private get properties(): RenderProperties {
    return this.processingInfo.properties;
  }

  private get screen(): Screen {
    return this.processingInfo.screen;
  }

  /**
   * @returns time of rendering in miliseconds
   */
  public render(properties?: Partial<RenderProperties>): Promise<RenderSummary> {
    this.camera.updateCanvasConfig();

    this.processingInfo = this.getProcessingInfo(properties);
    return new Promise((resolve) => {
      if (this.processingInfo.pointToTrace) {
        this.runDebugRender(
          resolve,
          this.processingInfo.pointToTrace.x,
          this.processingInfo.pointToTrace.y,
        );
      } else if (this.properties.renderMode === 'progressive') {
        this.runTaskProgressive(
          resolve,
          { x: 0, y: 0 },
          this.resolution.width,
          this.resolution.height,
          true,
        );
      } else {
        this.runTask(resolve, this.resolution, 0);
      }
    });
  }

  public interrupt(): void {
    this.processingInfo.interruptConfirmed = true;
  }

  private runTask(
    resolve: (value: RenderSummary | PromiseLike<RenderSummary>) => void,
    resolution: Resolution,
    yStart: number,
  ): void {
    setTimeout(() => {
      const timestamp = performance.now();

      for (let x = 0; x < resolution.width; x++) {
        const color = this.getColor(x, yStart);
        this.screen.drawPixel(x, yStart, color);
      }

      const newYStart = yStart + 1;

      if (!this.processingInfo.interruptConfirmed && this.processingInfo.primaryRays < this.processingInfo.totalPixels) {
        this.runTask(resolve, resolution, newYStart);
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
            const color = this.getColor(x, y);
            this.screen.drawPixel(x, y, color);
          }
        }
      } else {
        for (let y = startPoint.y; y < startPoint.y + hegiht; y += stepY) {
          for (let x = startPoint.x; x < startPoint.x + width; x += stepX) {
            if (initial || x !== startPoint.x || y !== startPoint.y) {
              const color = this.getColor(x, y);
              const newWidth = Math.min(stepX, Math.abs(x + stepX - width));
              const newHeight = Math.min(stepY, Math.abs(y + stepY - hegiht));
              this.screen.drawRectangle(x, y, newWidth, newHeight, color);

              this.runTaskProgressive(
                resolve,
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

  private runDebugRender(
    resolve: (value: RenderSummary | PromiseLike<RenderSummary>) => void,
    x: number,
    y: number,
  ): void {
    const timestamp = performance.now();
    const color = this.getColor(x, y);

    // eslint-disable-next-line no-console
    console.info('result color', color);
    resolve({
      time: performance.now() - timestamp,
      primaryRays: this.processingInfo.primaryRays,
      totalRays: this.processingInfo.totalRays,
      transparentIntersections: this.processingInfo.transparentIntersections,
      progress: 1,
      status: 'success',
    });
  }

  private castRay(ray: Ray, objects: SceneObject[]): Color {

    // eslint-disable-next-line no-console
    if (this.processingInfo.pointToTrace) {
      console.info('ray casted', ray);
    }
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

    if (this.properties.resultMode === 'depthMap') {
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

    if (this.processingInfo.pointToTrace) {

      // eslint-disable-next-line no-console
      console.info(
        `intersection with ${intersection.object.name} (${intersection.object.type})`,
        {
          distance: intersection.distance,
          point: intersection.point,
          currentIntersectionColor,
        },
      );
    }

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

  private getColor(x: number, y: number): Color {
    const primaryRay = this.camera.generateRayV2(x, y);
    this.processingInfo.primaryRays++;
    return this.castRay(primaryRay, this.scene.getObjects());
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

  private getProcessingInfo(properties?: Partial<RenderProperties>): RendererProcessingInfo {
    return new RendererProcessingInfo(this.resolution, this.canvasId, properties);
  }
}
