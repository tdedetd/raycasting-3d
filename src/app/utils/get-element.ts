export function getElement<T extends HTMLElement>(id: string): T {
  const canvasEl = document.querySelector<T>(`#${id}`);
  if (canvasEl) {
    return canvasEl;
  }
  throw new Error(`element '${id}' not found`);
}
