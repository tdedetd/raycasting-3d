import { CameraRay } from '../../models/camera-ray.model';
import { Intersection } from '../../models/intersection.model';
import { Mesh } from '../mesh';
import { MeshIntersectionDetector } from '../mesh-intersection-detector';
import { SceneObjectProperties } from '../object-properties/scene-object-properties';
import { SceneObject } from './scene-object';

export abstract class MeshSceneObject extends SceneObject {
  private meshes: Mesh[];

  constructor(properties: SceneObjectProperties) {
    super(properties);
    this.meshes = this.getMeshes(properties);
  }

  public getIntersections(ray: CameraRay): Intersection[] {
    return MeshIntersectionDetector.getIntersections(ray, this.meshes);
  }

  protected abstract getMeshes(properties: SceneObjectProperties): Mesh[];
}
