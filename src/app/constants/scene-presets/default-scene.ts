import { Point3d } from '../../geometry/point-3d';
import { Cube } from '../../scene/objects/cube';
import { Parallelepiped } from '../../scene/objects/parallelepiped';
import { Plane } from '../../scene/objects/plane';
import { Sphere } from '../../scene/objects/sphere';
import { Scene } from '../../scene/scene';
import { defaultCamera } from '../default-camera';

export const defaultScene = new Scene({
  camera: defaultCamera,
  objects: [
    new Cube({
      position: new Point3d(0, -1, 2.5),
      rotation: { x: 0, y: 0, z: -10 },
      material: {
        color: [64, 64, 255],
      },
      size: 5,
    }),
    new Parallelepiped({
      position: new Point3d(0, -5.4, 1.5),
      rotation: { x: 21, y: -12, z: 15 },
      material: {
        color: [255, 0, 0],
      },
      sizeX: 4,
      sizeY: 1,
      sizeZ: 2,
    }),
    new Sphere({
      position: new Point3d(-2, 5, 1.5),
      material: {
        color: [255, 0, 128],
      },
      radius: 2,
    }),
    new Plane({
      position: new Point3d(0, 0, 0),
      material: {
        color: [255, 255, 0],
      },
      sizeX: 100,
    }),
  ],
});
