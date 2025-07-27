import { Renderer } from '../renderer/renderer';
import { AxesRenderer } from '../renderer/axes-renderer';
import { Point3d } from '../geometry/point-3d';
import { getElement } from './get-element';

const form = {
  position: {
    x: getElement<HTMLInputElement>('input-position-x'),
    y: getElement<HTMLInputElement>('input-position-y'),
    z: getElement<HTMLInputElement>('input-position-z'),
  },
  rotation: {
    x: getElement<HTMLInputElement>('input-rotation-x'),
    y: getElement<HTMLInputElement>('input-rotation-y'),
    z: getElement<HTMLInputElement>('input-rotation-z'),
  },
  fov: getElement<HTMLInputElement>('input-fov'),
  distance: getElement<HTMLInputElement>('input-distance'),
  time: getElement<HTMLDivElement>('div-time'),
  resolution: {
    width: getElement<HTMLInputElement>('input-width'),
    height: getElement<HTMLInputElement>('input-height'),
  },
  renderButton: getElement<HTMLButtonElement>('button-render'),
  interruptRenderButton: getElement<HTMLButtonElement>('button-interrupt'),
};

// TODO: to object
// eslint-disable-next-line max-lines-per-function
export function init(renderer: Renderer): void {
  const camera = renderer.getCamera();
  const axesRenderer = new AxesRenderer('axes');

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

  form.renderButton.addEventListener('click', () => {
    camera.position = new Point3d(
      Number(form.position.x.value),
      Number(form.position.y.value),
      Number(form.position.z.value)
    );
    camera.rotation = {
      x: Number(form.rotation.x.value),
      y: Number(form.rotation.y.value),
      z: Number(form.rotation.z.value),
    };
    camera.fov = Number(form.fov.value);
    camera.distance = Number(form.distance.value);
    handleRender(renderer);

    axesRenderer.render(camera);
  });

  form.interruptRenderButton.addEventListener('click', () => {
    renderer.interrupt();
  });

  form.resolution.width.addEventListener('change', () => {
    form.resolution.height.value = String(Number(form.resolution.width.value) * 3 / 4);
  });

  handleRender(renderer);
  axesRenderer.render(camera);
}

function handleRender(renderer: Renderer): void {
  form.renderButton.disabled = true;
  form.interruptRenderButton.disabled = false;
  form.time.innerText = '-';

  renderer.render({
    width: Number(form.resolution.width.value),
    height: Number(form.resolution.height.value),
  }).then((time) => {
    form.time.innerText = (time / 1000).toFixed(3) + ' s';
    form.renderButton.disabled = false;
    form.interruptRenderButton.disabled = true;
  });
}
