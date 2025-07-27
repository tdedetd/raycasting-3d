import { Color } from '../renderer/color';
import { SceneObject } from './objects/scene-object';

export class Scene {

  public backgroundColor: Color = new Color(0, 0, 0);
  private objects: SceneObject[] = [];

  public addObjects(...objects: SceneObject[]) {
    this.objects.push(...objects);
  }

  public getObjects() {
    return this.objects;
  }
}
