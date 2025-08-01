import { Point3d } from '../geometry/point-3d';
import { Resolution } from '../models/resolution.model';
import { Rotator } from '../renderer/rotator';
import { Ray } from '../models/ray.model';
import { Rotation } from '../models/rotation.model';
import { generateRay } from '../utils/generate-ray';

interface CameraOptions {
  position: Point3d;
  rotation?: Rotation;
  fov?: number;
  distance?: number;
  fogStart?: number;
  resolution: Resolution;
}

export class Camera {
  public position: Point3d;
  public rotation: Rotation;
  public fov: number;
  public distance: number;
  public fogStart: number;
  public resolution: Resolution;

  /** Global width of canvas on scene */
  private canvasWidth = 0;

  /** Global height of canvas on scene */
  private canvasHeight = 0;

  /** Global size of 1 pixel on scene */
  private canvasPixelSize = 0;

  /** Global X when camera has no rotation */
  private canvasCoordX = 0;

  private rotator: Rotator;

  constructor({ position, rotation, fov, distance, fogStart, resolution }: CameraOptions) {
    this.position = position;
    this.rotation = rotation ?? { x: 0, y: 0, z: 0 };
    this.fov = fov ?? 90;
    this.distance = distance ?? 100;
    this.fogStart = fogStart ?? 0;
    this.resolution = resolution;
    this.rotator = new Rotator(this.rotation);
    this.updateCanvasConfig(position);
  }

  public generateRay(x: number, y: number): Ray {
    const coordY = (this.canvasPixelSize * x + this.canvasPixelSize / 2) - this.canvasWidth / 2;
    const coordZ =
      (this.canvasPixelSize * (this.resolution.height - y - 1) + this.canvasPixelSize / 2) - this.canvasHeight / 2;
    const rotatedPoint = this.rotator.rotatePoint(new Point3d(this.canvasCoordX, coordY, coordZ));

    return generateRay(this.position, rotatedPoint);
  }

  public updateCanvasConfig(position?: Point3d): void {
    this.canvasWidth = 2 * this.distance * Math.tan(this.fov / 2 * Math.PI / 180);
    this.canvasPixelSize = this.canvasWidth / this.resolution.width;
    this.canvasHeight = this.canvasPixelSize * this.resolution.height;
    this.canvasCoordX = this.position.x + this.distance;
    this.rotator = new Rotator(this.rotation, position ?? this.position);
  }
}
