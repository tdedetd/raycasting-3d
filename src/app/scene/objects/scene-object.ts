import { Line3d } from '../../geometry/line-3d';
import { Intersection } from '../../renderer/intersection';
import { ObjectProperties } from '../object-properties/object-properties';

export interface SceneObject {
  properties: ObjectProperties;
  getIntersections(ray: Line3d): Intersection[];
}
