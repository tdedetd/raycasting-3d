import { SystemOfLinearEquations3eq3Var } from '../equations/system-of-linear-equations-3eq-3var';
import { Line3d } from '../geometry/line-3d';
import { Point3d } from '../geometry/point-3d';
import { Intersection } from "../renderer/intersection";
import { Mesh } from './mesh';

export class MeshIntersectionDetector {

  public static getIntersections(line: Line3d, meshes: Mesh[]): Intersection[] {

    const intersections: Intersection[] = [];

    meshes.forEach(mesh => {
      const equationSystem = new SystemOfLinearEquations3eq3Var([
        ...line.getEquations(), mesh.triangle.getPlaneEquation()
      ]);

      const point = MeshIntersectionDetector.getIntersectionPoint(equationSystem);
      if (!point || !mesh.triangle.pointInside(point)) return;

      const inInterval = point.x > line.point1.x && point.x < line.point2.x || point.x > line.point2.x && point.x < line.point1.x;
      if (!inInterval) return;

      intersections.push(new Intersection(mesh.material, point, new Line3d(point, line.point1).getLength()));
    });

    return intersections;
  }

  private static getIntersectionPoint(equationSystem: SystemOfLinearEquations3eq3Var): Point3d | null {
    const solution = equationSystem.getSolution();
    if (!solution) return null;
    return new Point3d(solution[0], solution[1], solution[2]);
  }
}
