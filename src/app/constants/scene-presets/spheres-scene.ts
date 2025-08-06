import { Point3d } from '../../geometry/point-3d';
import { Color } from '../../models/color.model';
import { Camera } from '../../scene/camera';
import { Sphere } from '../../scene/objects/sphere';
import { Scene } from '../../scene/scene';

const colors: Color[] = [
  [255, 0, 128],
  [255, 128, 0],
  [255, 0, 255],
  [255, 0, 0],
];

const countX = 7;
const countY = 7;
const countZ = 7;

const spacing = 3.4;

const objects: Sphere[] = [];

for (let x = 0; x < countX; x++) {
  for (let y = 0; y < countY; y++) {
    for (let z = 0; z < countZ; z++) {
      const objectIndex = x + y + z;
      objects.push(
        new Sphere({
          material: {
            color: colors[objectIndex % colors.length],
          },
          position: new Point3d(-2 + spacing * x, -8 + spacing * y, -7 + spacing * z),
          radius: 0.6,
        })
      );
    }
  }
}

export const spheresScene = new Scene({
  backgroundColor: [255, 255, 255],
  objects,
  camera: new Camera({
    position: new Point3d(-14, -6, 5),
    rotation: { x: 0, y: 12, z: 14 },
    distance: 40,
    resolution: {
      width: 384,
      height: 216,
    },
    fov: 40,
  }),
});
