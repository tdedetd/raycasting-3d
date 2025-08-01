import { SystemOfLinearEquations3eq3Var } from '../equations/system-of-linear-equations-3eq-3var';
import { Point3d } from '../geometry/point-3d';
import { Intersection } from '../models/intersection.model';
import { getLength } from '../utils/get-length';
import { Ray } from '../models/ray.model';
import { Mesh } from './mesh';
import { SceneObject } from './objects/scene-object';

export class MeshIntersectionDetector {
  public static getIntersections(ray: Ray, meshes: Mesh[], object: SceneObject): Intersection[] {

    const intersections: Intersection[] = [];

    meshes.forEach(mesh => {
      const equationSystem = new SystemOfLinearEquations3eq3Var([
        ...ray.equations, mesh.equation,
      ]);

      const point = MeshIntersectionDetector.getIntersectionPoint(equationSystem);
      if (!point || !mesh.triangle.pointInside(point)) {
        return;
      }

      const inInterval = (
        point.x > ray.line.point1.x &&
        point.x < ray.line.point2.x || point.x > ray.line.point2.x &&
        point.x < ray.line.point1.x
      );

      if (inInterval) {
        intersections.push({
          material: mesh.material,
          point,
          distance: getLength(ray.line.point1, point),
          object,
        });
      }
    });

    return intersections;
  }

  private static getIntersectionPoint(equationSystem: SystemOfLinearEquations3eq3Var): Point3d | null {
    const solution = equationSystem.getSolution();
    return solution ? new Point3d(solution[0], solution[1], solution[2]) : null;
  }
}
