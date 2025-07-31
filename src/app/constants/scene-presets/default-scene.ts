import { Point3d } from '../../geometry/point-3d';
import { Cube } from '../../scene/objects/cube';
import { Parallelepiped } from '../../scene/objects/parallelepiped';
import { Plane } from '../../scene/objects/plane';
import { Prism } from '../../scene/objects/prism';
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
        color: [225, 255, 225],
      },
      size: 5,
    }),
    new Parallelepiped({
      position: new Point3d(0, -5.4, 1.5),
      rotation: { x: 21, y: -12, z: 15 },
      material: {
        color: [200, 200, 255],
      },
      sizeX: 4,
      sizeY: 1,
      sizeZ: 2,
    }),
    new Sphere({
      position: new Point3d(-2, 5, 1.5),
      material: {
        color: [255, 255, 255],
      },
      radius: 2,
    }),
    new Prism({
      rotation: { x: 90, y: 45, z: -40 },
      position: new Point3d(-3.5, 0, 1.5),
      material: {
        color: [255, 200, 200],
      },
      angles: 3,
      hight: 2,
      radius: 1,
    }),
    new Plane({
      position: new Point3d(0, 0, 0),
      material: {
        color: [255, 255, 200],
      },
      sizeX: 100,
    }),
  ],
});
