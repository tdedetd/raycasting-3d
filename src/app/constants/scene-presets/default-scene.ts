import { Point3d } from '../../geometry/point-3d';
import { Color } from '../../renderer/color';
import { Cube } from '../../scene/objects/cube';
import { Sphere } from '../../scene/objects/sphere';
import { Scene } from '../../scene/scene';

export const defaultScene = new Scene({
  objects: [
    new Cube({
      position: new Point3d(0, 0, 2.5),
      material: {
        color: new Color(64, 64, 255)
      },
      width: 5,
    }),
    new Cube({
      position: new Point3d(-2, 4, 1.5),
      material: {
        color: new Color(255, 0, 0)
      },
      width: 3,
    }),
    new Cube({
      position: new Point3d(0, 0, -50),
      material: {
        color: new Color(255, 255, 128)
      },
      width: 100,
    }),
    new Sphere({
      material: {
        color: new Color(255, 0, 128),
      },
      position: new Point3d(5, -7, 2),
      radius: 5,
    }),
  ]
});
