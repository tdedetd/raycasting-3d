import { Resolution } from '../models/resolution.model';
import { Screen } from './screen';
import { Intersection } from '../models/intersection.model';
import { Scene } from '../scene/scene';
import { Camera } from '../scene/camera';
import { Counters } from '../debug/counters';
import { CameraRay } from '../models/camera-ray.model';
import { Color } from './color';

export class Renderer {
  constructor(
    private readonly scene: Scene,
    private readonly canvasId: string,
    private readonly camera: Camera
  ) {}

  public getCamera(): Camera {
    return this.camera;
  }

  /**
   * @returns time of rendering in miliseconds
   */
  public render(resolution: Resolution): number {
    const t0 = performance.now();
    const screen = new Screen(this.canvasId, resolution);
    this.camera.resolution = resolution;
    this.camera.updateCanvasConfig();

    for (let y = 0; y < resolution.height; y++) {
      for (let x = 0; x < resolution.width; x++) {
        const ray = this.camera.generateRay(x, y);
        const color = this.getColor(ray);
        screen.drawPixel(x, y, color);
      }
    }

    Counters.log();
    return performance.now() - t0;
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
      return color.mix(this.scene.backgroundColor, closestIntersection.distance / this.camera.distance);
    }
    return this.scene.backgroundColor;
  }
}
