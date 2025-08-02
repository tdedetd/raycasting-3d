import { Point3d } from '../../geometry/point-3d';
import { Intersection } from '../../models/intersection.model';
import { Ray } from '../../models/ray.model';
import { Material } from '../../models/material.model';
import { SceneObjectProperties } from '../object-properties/scene-object-properties';
import { Rotation } from '../../models/rotation.model';

export abstract class SceneObject {
  private static constructorCounters: Partial<Record<string, number>> = {};

  private static readonly defaultMaterial: Material = {
    color: [255, 255, 255],
  };

  public readonly name: string;
  public readonly type: string;
  public readonly position: Point3d;
  public readonly rotation: Rotation;
  public readonly material: Material;

  constructor(properties: SceneObjectProperties) {
    this.name = properties.name ?? SceneObject.getDefaultName(this.constructor.name);
    this.type = this.constructor.name;
    this.position = properties.position;
    this.rotation = properties.rotation ?? { x: 0, y: 0, z: 0 };
    this.material = properties.material ?? SceneObject.defaultMaterial;

    this.validateOpacity();
    this.validateColor();
  }

  public abstract getIntersections(ray: Ray): Intersection[];

  private static getDefaultName(name: string) {
    const id = SceneObject.constructorCounters[name] ?? 0;
    SceneObject.constructorCounters[name] = id + 1;
    return `${name} ${id}`;
  }

  private validateOpacity(): void {
    const opacity = this.material.opacity;
    if (typeof opacity !== 'undefined' && (opacity < 0 || opacity > 1)) {
      throw new Error(`opacity is not in interval [0, 1]. Current value - ${opacity}`);
    }
  }

  private validateColor(): void {
    const color = this.material.color;
    if (
      color[0] < 0 || color[0] > 255 ||
      color[1] < 0 || color[1] > 255 ||
      color[2] < 0 || color[2] > 255
    ) {
      throw new Error(`incorrect value of the color - [${color[0]}, ${color[1]}, ${color[2]}]`);
    }
  }
}
