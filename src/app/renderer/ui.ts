import { Point3d } from '../geometry/point-3d';
import { getElement } from '../utils/get-element';
import { AxesRenderer } from './axes-renderer';
import { Renderer } from './renderer';

export class Ui {
  private readonly aspectRatio: number;
  private readonly axesRenderer: AxesRenderer;

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
    resolution: {
      width: getElement<HTMLInputElement>('input-width'),
      height: getElement<HTMLInputElement>('input-height'),
    },
    renderButton: getElement<HTMLButtonElement>('button-render'),

    time: getElement<HTMLDivElement>('div-time'),
    interruptRenderButton: getElement<HTMLButtonElement>('button-interrupt'),
  };

  private disabledElementsDuringRender: (HTMLInputElement | HTMLButtonElement)[];

  constructor(private readonly renderer: Renderer) {
    this.disabledElementsDuringRender = [
      this.form.position.x,
      this.form.position.y,
      this.form.position.z,
      this.form.rotation.x,
      this.form.rotation.y,
      this.form.rotation.z,
      this.form.fov,
      this.form.distance,
      this.form.resolution.width,
      this.form.resolution.height,
      this.form.renderButton,
    ];

    this.aspectRatio = renderer.camera.resolution.width / renderer.camera.resolution.height;
    this.axesRenderer = new AxesRenderer('canvas-axes');
  }

  public init(): void {
    const camera = this.renderer.camera;

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
    });

    this.form.interruptRenderButton.addEventListener('click', () => {
      this.renderer.interrupt();
    });

    this.form.resolution.width.addEventListener('change', (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const newHight = Math.round(Number(event.target.value) / this.aspectRatio);
        this.form.resolution.height.value = String(newHight);
      }
    });

    this.form.resolution.height.addEventListener('change', (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const newWidth = Math.round(Number(event.target.value) * this.aspectRatio);
        this.form.resolution.width.value = String(newWidth);
      }
    });

    this.handleRender();
  }

  private handleRender(): void {
    const interruptRenderButton = this.form.interruptRenderButton;

    this.setDisabledFor(this.disabledElementsDuringRender, true);
    interruptRenderButton.disabled = false;
    this.form.time.innerText = '-';

    this.axesRenderer.render(this.renderer.camera);
    this.renderer.render({
      width: Number(this.form.resolution.width.value),
      height: Number(this.form.resolution.height.value),
    }).then((summary) => {
      // eslint-disable-next-line no-console
      console.info(summary);

      this.form.time.innerText = (summary.time / 1000).toFixed(3) + ' s';
      this.setDisabledFor(this.disabledElementsDuringRender, false);
      interruptRenderButton.disabled = true;
    });
  }

  private setDisabledFor(elements: typeof this.disabledElementsDuringRender, disabled: boolean): void {
    elements.forEach((element) => {
      element.disabled = disabled;
    });
  }
}
