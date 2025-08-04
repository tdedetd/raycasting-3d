import { Point3d } from '../../geometry/point-3d';
import { Camera } from '../../scene/camera';
import { Cube } from '../../scene/objects/cube';
import { Parallelepiped } from '../../scene/objects/parallelepiped';
import { Plane } from '../../scene/objects/plane';
import { Prism } from '../../scene/objects/prism';
import { Sphere } from '../../scene/objects/sphere';
import { Scene } from '../../scene/scene';

export const defaultScene = new Scene({
  camera: new Camera({
    position: new Point3d(-19, -11, 6),
    rotation: { x: 0, y: 10, z: 31 },
    resolution: {
      width: 384,
      height: 216,
    },
    distance: 34,
    fov: 40,
  }),
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
      name: 'blue parallelepiped',
      position: new Point3d(0, -5.4, 1.5),
      rotation: { x: 21, y: -12, z: 15 },
      material: {
        color: [200, 200, 255],
        opacity: 0.7,
      },
      sizeX: 4,
      sizeY: 1,
      sizeZ: 2,
    }),
    new Sphere({
      position: new Point3d(-2, 5, 2),
      material: {
        color: [255, 255, 255],
      },
      radius: 2,
    }),
    new Prism({
      name: 'red prism',
      position: new Point3d(-4.5, 0, 1),
      rotation: { x: 0, y: 70, z: 90 },
      material: {
        color: [255, 200, 200],
        opacity: 0.8,
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
