import { Color } from '../renderer/color';
import { SceneObject } from './objects/scene-object';

interface SceneProperties {
  objects?: SceneObject[];
  backgroundColor?: Color;
}

export class Scene {
  public readonly backgroundColor: Color;
  private objects: SceneObject[];

  constructor(properties?: SceneProperties) {
    this.backgroundColor = properties?.backgroundColor ?? new Color(0, 0, 0);
    this.objects = properties?.objects ?? [];
  }

  public addObjects(...objects: SceneObject[]) {
    this.objects.push(...objects);
  }

  public getObjects() {
    return this.objects;
  }
}
