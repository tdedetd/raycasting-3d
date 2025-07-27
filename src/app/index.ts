import { Point3d } from './geometry/point-3d';
import { Resolution } from './misc/resolution';
import { Color } from './renderer/color';
import { Renderer } from './renderer/renderer';
import { Camera } from './scene/camera';
import { Cube } from './scene/objects/cube';
import { Sphere } from './scene/objects/sphere';
import { Rotation } from './scene/rotation';
import { Scene } from './scene/scene';
import { uiUtils } from './utils/index';

const ROTATION = new Rotation(0, 0, 0);

const scene = new Scene();
scene.addObjects(
  new Cube({
    position: new Point3d(0, 0, 2.5),
    rotation: ROTATION,
    material: {
      color: new Color(64, 64, 255)
    },
    width: 5
  }),
  new Cube({
    position: new Point3d(-2, 4, 1.5),
    rotation: ROTATION,
    material: {
      color: new Color(255, 0, 0)
    },
    width: 3
  }),
  new Cube({
    position: new Point3d(0, 0, -50),
    rotation: ROTATION,
    material: {
      color: new Color(255, 255, 128)
    },
    width: 100
  }),
  new Sphere({
    material: {
      color: new Color(255, 0, 128),
    },
    position: new Point3d(5, -7, 2),
    radius: 5,
    rotation: ROTATION,
  }),
);

const camera = new Camera();
camera.position = new Point3d(-7, -5, 6);
camera.rotation = new Rotation(0, 11, 17);
camera.distance = 17;
camera.resolution = new Resolution(160, 120);
camera.fov = 90;

uiUtils.init(new Renderer(scene, 'canvas', camera));
