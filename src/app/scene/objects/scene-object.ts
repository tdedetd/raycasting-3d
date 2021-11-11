import { Line3d } from '../../geometry';
import { Intersection } from '../../renderer/intersection';
import { ObjectProperties } from "../object-properties";

export interface SceneObject {
  properties: ObjectProperties;
  getIntersections(ray: Line3d): Intersection[];
}
