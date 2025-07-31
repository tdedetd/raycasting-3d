import { Point3d } from '../geometry/point-3d';
import { Camera } from '../scene/camera';

export const defaultCamera = new Camera({
  position: new Point3d(-7, -5, 6),
  rotation: { x: 0, y: 11, z: 17 },
  distance: 17,
  resolution: {
    width: 480,
    height: 280,
  },
  fov: 90,
});
