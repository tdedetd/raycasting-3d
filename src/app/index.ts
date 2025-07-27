import { defaultScene } from './constants/scene-presets/default-scene';
import { Point3d } from './geometry/point-3d';
import { Renderer } from './renderer/renderer';
import { Camera } from './scene/camera';
import { init } from './utils/ui';

const camera = new Camera({
  position: new Point3d(-7, -5, 6),
  rotation: { x: 0, y: 11, z: 17 },
  distance: 17,
  resolution: {
    width: 160,
    height: 120,
  },
  fov: 90,
});

init(new Renderer(defaultScene, 'canvas', camera));
