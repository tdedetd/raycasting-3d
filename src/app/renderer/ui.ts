import { Point3d } from '../geometry/point-3d';
import { getElement } from '../utils/get-element';
import { AxesRenderer } from './axes-renderer';
import { Renderer } from './renderer';

export class Ui {
  private readonly form = {
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

  constructor(private readonly renderer: Renderer) { }

  public init(): void {
    const camera = this.renderer.getCamera();
    const axesRenderer = new AxesRenderer('axes');

    this.form.position.x.value = String(camera.position.x);
    this.form.position.y.value = String(camera.position.y);
    this.form.position.z.value = String(camera.position.z);

    this.form.rotation.x.value = String(camera.rotation.x);
    this.form.rotation.y.value = String(camera.rotation.y);
    this.form.rotation.z.value = String(camera.rotation.z);

    this.form.fov.value = String(camera.fov);
    this.form.distance.value = String(camera.distance);
    this.form.resolution.width.value = String(camera.resolution.width);
    this.form.resolution.height.value = String(camera.resolution.height);

    this.form.renderButton.addEventListener('click', () => {
      camera.position = new Point3d(
        Number(this.form.position.x.value),
        Number(this.form.position.y.value),
        Number(this.form.position.z.value)
      );
      camera.rotation = {
        x: Number(this.form.rotation.x.value),
        y: Number(this.form.rotation.y.value),
        z: Number(this.form.rotation.z.value),
      };
      camera.fov = Number(this.form.fov.value);
      camera.distance = Number(this.form.distance.value);
      this.handleRender();

      axesRenderer.render(camera);
    });

    this.form.interruptRenderButton.addEventListener('click', () => {
      this.renderer.interrupt();
    });

    this.form.resolution.width.addEventListener('change', () => {
      this.form.resolution.height.value = String(Number(this.form.resolution.width.value) * 3 / 4);
    });

    this.handleRender();
    axesRenderer.render(camera);
  }

  private handleRender(): void {
    const renderButton = this.form.renderButton;
    const interruptRenderButton = this.form.interruptRenderButton;

    renderButton.disabled = true;
    interruptRenderButton.disabled = false;
    this.form.time.innerText = '-';

    this.renderer.render({
      width: Number(this.form.resolution.width.value),
      height: Number(this.form.resolution.height.value),
    }).then((time) => {
      this.form.time.innerText = (time / 1000).toFixed(3) + ' s';
      renderButton.disabled = false;
      interruptRenderButton.disabled = true;
    }).catch(() => {
      throw new Error('жопа');
    });
  }
}
