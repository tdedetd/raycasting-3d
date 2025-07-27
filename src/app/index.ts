import { defaultScene } from './constants/scene-presets/default-scene';
import { Point3d } from './geometry/point-3d';
import { Resolution } from './misc/resolution';
import { Renderer } from './renderer/renderer';
import { Camera } from './scene/camera';
import { Rotation } from './scene/rotation';
import { uiUtils } from './utils/index';

const camera = new Camera({
  position: new Point3d(-7, -5, 6),
  rotation: new Rotation(0, 11, 17),
  distance: 17,
  resolution: new Resolution(160, 120),
  fov: 90,
});

uiUtils.init(new Renderer(defaultScene, 'canvas', camera));
