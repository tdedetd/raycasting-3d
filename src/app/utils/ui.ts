import { Renderer } from '../renderer/renderer';
import { AxesRenderer } from '../renderer/axes-renderer';
import { Rotation } from '../scene/rotation';
import { Resolution } from '../misc/resolution';
import { Point3d } from '../geometry/point-3d';

// TODO: to object
export function init(renderer: Renderer) {
  const camera = renderer.getCamera();
  const button = byId('button-draw');
  const axesRenderer = new AxesRenderer('axes');

  const form = {
    position: {
      x: <HTMLInputElement>byId('input-position-x'),
      y: <HTMLInputElement>byId('input-position-y'),
      z: <HTMLInputElement>byId('input-position-z'),
    },
    rotation: {
      x: <HTMLInputElement>byId('input-rotation-x'),
      y: <HTMLInputElement>byId('input-rotation-y'),
      z: <HTMLInputElement>byId('input-rotation-z'),
    },
    fov: <HTMLInputElement>byId('input-fov'),
    distance: <HTMLInputElement>byId('input-distance'),
    time: <HTMLDivElement>byId('div-time'),
    resolution: {
      width: <HTMLInputElement>byId('input-width'),
      height: <HTMLInputElement>byId('input-height')
    }
  };

  form.position.x.value = String(camera.position.x);
  form.position.y.value = String(camera.position.y);
  form.position.z.value = String(camera.position.z);

  form.rotation.x.value = String(camera.rotation.x);
  form.rotation.y.value = String(camera.rotation.y);
  form.rotation.z.value = String(camera.rotation.z);

  form.fov.value = String(camera.fov);
  form.distance.value = String(camera.distance);
  form.resolution.width.value = String(camera.resolution.width);
  form.resolution.height.value = String(camera.resolution.height);

  button?.addEventListener('click', () => {
    camera.position = new Point3d(+form.position.x.value, +form.position.y.value, +form.position.z.value);
    camera.rotation = new Rotation(+form.rotation.x.value, +form.rotation.y.value, +form.rotation.z.value);
    camera.fov = +form.fov.value;
    camera.distance = +form.distance.value;
    updateTime(form.time, renderer.render(new Resolution(+form.resolution.width.value, +form.resolution.height.value)));
    axesRenderer.render(camera);
  });

  form.resolution.width.addEventListener('change', () => {
    form.resolution.height.value = String(+form.resolution.width.value * 3 / 4);
  });

  updateTime(form.time, renderer.render(new Resolution(+form.resolution.width.value, +form.resolution.height.value)));
  axesRenderer.render(camera);
}

function byId(id: string) {
  return document.getElementById(id);
}

function updateTime(element: HTMLDivElement, time: number) {
  element.innerText = (time / 1000).toFixed(3) + ' s';
}
