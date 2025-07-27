import { Line3d } from '../../geometry/line-3d';
import { Point3d } from '../../geometry/point-3d';
import { PointSpherical } from '../../geometry/point-spherical';
import { Triangle3d } from '../../geometry/triangle-3d';
import { CameraRay } from '../camera-ray';
import { Mesh } from "../mesh";
import { MeshIntersectionDetector } from "../mesh-intersection-detector";
import { CubeProperties } from '../object-properties/cube-properties';
import { SceneObject } from './scene-object';

const V_ANGLE = Math.atan(1 / Math.sqrt(2)) * 180 / Math.PI;

export class Cube extends SceneObject {
  public readonly width: number;

  private meshes: Mesh[];

  constructor(properties: CubeProperties) {
    super(properties);
    this.width = properties.width;
    this.meshes = this.getMeshes();
  }

  getIntersections(ray: CameraRay) {
    return MeshIntersectionDetector.getIntersections(ray, this.meshes);
  }

  private getMeshes(): Mesh[] {
    const radius = 0.5 * this.width / Math.sin(V_ANGLE * Math.PI / 180);

    // TODO: rotation
    const vertices: Point3d[] = [];

    [-V_ANGLE, V_ANGLE].forEach(vAngle => {
      for (let hAngle = 45; hAngle < 360; hAngle += 90) {
        vertices.push(new PointSpherical(radius, vAngle, hAngle).toCartesian(this.position));
      }
    });

    return ([
      [vertices[3], vertices[7], vertices[4]],
      [vertices[3], vertices[0], vertices[4]],
      [vertices[0], vertices[4], vertices[5]],
      [vertices[0], vertices[1], vertices[5]],
      [vertices[1], vertices[5], vertices[6]],
      [vertices[1], vertices[2], vertices[6]],
      [vertices[2], vertices[6], vertices[7]],
      [vertices[2], vertices[3], vertices[7]],
      [vertices[0], vertices[1], vertices[2]],
      [vertices[0], vertices[3], vertices[2]],
      [vertices[5], vertices[6], vertices[7]],
      [vertices[5], vertices[4], vertices[7]],
    ] satisfies [Point3d, Point3d, Point3d][])
      .map(
        ([point1, point2, point3]) => new Mesh(new Triangle3d(point1, point2, point3), this.material)
      );
  }
}
