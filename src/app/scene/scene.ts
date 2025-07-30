import { Color } from '../models/color.model';
import { Camera } from './camera';
import { SceneObject } from './objects/scene-object';

interface SceneProperties {
  objects?: SceneObject[];
  backgroundColor?: Color;
  camera: Camera;
}

export class Scene {
  public readonly backgroundColor: Color;
  public readonly camera: Camera;

  private objects: SceneObject[];

  constructor(properties: SceneProperties) {
    this.backgroundColor = properties?.backgroundColor ?? [0, 0, 0];
    this.objects = properties?.objects ?? [];
    this.camera = properties.camera;
  }

  // TODO: SceneObject | MeshSceneObject
  public addObjects(...objects: SceneObject[]): void {
    this.objects.push(...objects);
  }

  public getObjects(): SceneObject[] {
    return this.objects;
  }
}
