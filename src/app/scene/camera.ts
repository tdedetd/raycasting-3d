import { Line3d } from '../geometry/line-3d';
import { Point3d } from '../geometry/point-3d';
import { Resolution } from '../misc/resolution';
import { Rotator } from '../misc/rotator';
import { Rotation } from './rotation';

interface CameraOptions {
  position: Point3d;
  rotation?: Rotation;
  fov?: number;
  distance?: number;
  resolution: Resolution;
}

export class Camera {
  public position: Point3d;
  public rotation: Rotation;
  public fov: number;
  public distance: number;
  public resolution: Resolution;

  /** Global width of canvas on scene */
  private canvasWidth = 0;

  /** Global height of canvas on scene */
  private canvasHeight = 0;

  /** Global size of 1 pixel on scene */
  private canvasPixelSize = 0;

  /** Global X when camera has no rotation */
  private canvasCoordX = 0;

  private rotator = new Rotator();

  constructor({ position, rotation, fov, distance, resolution }: CameraOptions) {
    this.position = position;
    this.rotation = rotation ?? new Rotation(0, 0, 0);
    this.fov = fov ?? 90;
    this.distance = distance ?? 100;
    this.resolution = resolution;
    this.updateCanvasConfig(position);
  }

  /** The first point is always position of camera */
  generateRay(x: number, y: number): Line3d {

    const coordY = (this.canvasPixelSize * x + this.canvasPixelSize / 2) - this.canvasWidth / 2;
    const coordZ = (this.canvasPixelSize * (this.resolution.height - y - 1) + this.canvasPixelSize / 2) - this.canvasHeight / 2;
    const rotatedPoint = this.rotator.rotatePoint(this.rotation, new Point3d(this.canvasCoordX, coordY, coordZ));

    return new Line3d(this.position, rotatedPoint);
  }

  updateCanvasConfig(position?: Point3d) {
    this.canvasWidth = 2 * this.distance * Math.tan(this.fov / 2 * Math.PI / 180);
    this.canvasPixelSize = this.canvasWidth / this.resolution.width;
    this.canvasHeight = this.canvasPixelSize * this.resolution.height;
    this.canvasCoordX = this.position.x + this.distance;
    this.rotator = new Rotator(position ?? this.position);
  }
}
