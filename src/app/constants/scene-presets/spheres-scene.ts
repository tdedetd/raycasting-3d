import { Point3d } from '../../geometry/point-3d';
import { Color } from '../../renderer/color';
import { Sphere } from '../../scene/objects/sphere';
import { Scene } from '../../scene/scene';
import { defaultCamera } from '../default-camera';

const colors: Color[] = [
  new Color(255, 0, 128),
  new Color(255, 128, 0),
  new Color(255, 0, 256),
  new Color(255, 0, 0),
];

const countX = 7;
const countY = 7;
const countZ = 7;

const spacing = 3;

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
  backgroundColor: new Color(256, 256, 256),
  objects,
  camera: defaultCamera,
});
