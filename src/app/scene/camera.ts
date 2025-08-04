import { Point3d } from '../geometry/point-3d';
import { Resolution } from '../models/resolution.model';
import { Rotator } from '../renderer/rotator';
import { Ray } from '../models/ray.model';
import { Rotation } from '../models/rotation.model';
import { generateRay } from '../utils/generate-ray';
import { PointSpherical } from '../geometry/point-spherical';
import { getVerticalFov } from '../utils/angle/get-vertical-fov';
import { toDegrees } from '../utils/angle/to-degrees';
import { toRadians } from '../utils/angle/to-radians';

interface CameraOptions {
  position: Point3d;
  rotation?: Rotation;
  fov?: number;

  /** Must be bigger then 0 */
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

  /**
   * Global width of canvas on scene
   * 
   * @deprecated
   */
  private canvasWidth = 0;

  /**
   * Global height of canvas on scene
   * 
   * @deprecated
   */
  private canvasHeight = 0;

  /**
   * Global size of 1 pixel on scene
   * 
   * @deprecated
   */
  private canvasPixelSize = 0;

  /**
   * Global X when camera has no rotation
   * 
   * @deprecated
   */
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

    this.validateDistance();

    this.updateCanvasConfig();
  }

  public generateRay(x: number, y: number): Ray {
    const coordY = (this.canvasPixelSize * x + this.canvasPixelSize / 2) - this.canvasWidth / 2;
    const coordZ =
      (this.canvasPixelSize * (this.resolution.height - y - 1) + this.canvasPixelSize / 2) - this.canvasHeight / 2;
    const rotatedPoint = this.rotator.rotatePoint(new Point3d(this.canvasCoordX, coordY, coordZ));

    return generateRay(this.position, rotatedPoint);
  }

  // With correct ray lenth, but with fish eye
  public generateRayV2(x: number, y: number): Ray {
    const vFov = getVerticalFov(this.fov, this.resolution.width, this.resolution.height);
    const projectionWidth = 2 * this.distance * Math.tan(toRadians(this.fov / 2));
    const projectionHeight = 2 * this.distance * Math.tan(toRadians(vFov / 2));
    const canvasPixelSizeWidth = projectionWidth / (this.resolution.width - 1);
    const canvasPixelSizHeight = projectionHeight / (this.resolution.height - 1);

    const coordY = canvasPixelSizeWidth * x - projectionWidth / 2;
    const coordZ = canvasPixelSizHeight * y - projectionHeight / 2;

    const horizontalAngleRad = Math.atan(coordY / this.distance);
    const verticalAngleRad = Math.atan(coordZ / this.distance);

    const endOfRayPoint = new PointSpherical(
      this.distance,
      toDegrees(verticalAngleRad),
      toDegrees(horizontalAngleRad)
    ).toCartesian(this.position);

    return generateRay(
      this.position,
      this.rotator.rotatePoint(endOfRayPoint)
    );
  }

  public updateCanvasConfig(): void {
    this.canvasWidth = 2 * this.distance * Math.tan(this.fov / 2 * Math.PI / 180);
    this.canvasPixelSize = this.canvasWidth / this.resolution.width;
    this.canvasHeight = this.canvasPixelSize * this.resolution.height;
    this.canvasCoordX = this.position.x + this.distance;
    this.rotator = new Rotator(this.rotation, this.position);
  }

  private validateDistance(): void {
    if (this.distance <= 0) {
      throw new Error(`camera distance less or equals 0 (${this.distance})`);
    }
  }
}
