import { Line3d, Point3d } from '../geometry';
import { Rotator } from '../misc';
import { Resolution } from '../misc/resolution';
import { Rotation } from './rotation';

export class Camera {

  public position: Point3d = new Point3d(0, 0, 0);
  public rotation: Rotation = new Rotation(0, 0, 0);
  public fov: number = 90;
  public distance: number = 100;
  public resolution: Resolution = new Resolution(320, 240);

  /** Global width of canvas on scene */
  private canvasWidth: number;

  /** Global height of canvas on scene */
  private canvasHeight: number;

  /** Global size of 1 pixel on scene */
  private canvasPixelSize: number;

  /** Global X when camera has no rotation */
  private canvasCoordX: number;

  private rotator: Rotator;

  /** The first point is always position of camera */
  generateRay(x: number, y: number): Line3d {

    const coordY = (this.canvasPixelSize * x + this.canvasPixelSize / 2) - this.canvasWidth / 2;
    const coordZ = (this.canvasPixelSize * (this.resolution.height - y - 1) + this.canvasPixelSize / 2) - this.canvasHeight / 2;
    const rotatedPoint = this.rotator.rotatePoint(this.rotation, new Point3d(this.canvasCoordX, coordY, coordZ));

    return new Line3d(this.position, rotatedPoint);
  }

  updateCanvasConfig() {
    this.canvasWidth = 2 * this.distance * Math.tan(this.fov / 2 * Math.PI / 180);
    this.canvasPixelSize = this.canvasWidth / this.resolution.width;
    this.canvasHeight = this.canvasPixelSize * this.resolution.height;
    this.canvasCoordX = this.position.x + this.distance;
    this.rotator = new Rotator(this.position);
  }
}
