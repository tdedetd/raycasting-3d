import { Line3d } from "../geometry";
import { Resolution } from "../misc/resolution";
import { Camera, Scene } from "../scene";
import { Screen } from './screen';
import { Intersection } from './intersection';

export class Renderer {

  private screen: Screen;

  constructor(private readonly scene: Scene,
              private readonly canvasId: string,
              private readonly camera: Camera) {}

  public getCamera() {
    return this.camera;
  }

  /**
   * @returns time of rendering in miliseconds
   */
  public render(resolution: Resolution): number {

    const t0 = performance.now();
    this.screen = new Screen(this.canvasId, resolution);
    this.camera.resolution = resolution;
    this.camera.updateCanvasConfig();

    for (let y = 0; y < resolution.height; y++) {
      for (let x = 0; x < resolution.width; x++) {
        const ray = this.camera.generateRay(x, y);
        const color = this.getColor(ray);
        this.screen.drawPixel(x, y, color);
      }
    }

    return performance.now() - t0;
  }

  private getColor(ray: Line3d) {
    let closestIntersection: Intersection = null;

    this.scene.getObjects().forEach(obj => {
      const intersections = obj.getIntersections(ray);
      intersections.forEach(intersection => {
        if (!closestIntersection || intersection.distance < closestIntersection.distance) {
          closestIntersection = intersection;
        }
      });
    });

    if (!closestIntersection) return this.scene.backgroundColor;

    const color = closestIntersection.material.color;
    return color.mix(this.scene.backgroundColor, closestIntersection.distance / this.camera.distance);
  }
}
