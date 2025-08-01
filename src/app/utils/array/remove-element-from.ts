export function removeElementFrom<T>(array: T[], element: T): T[] {
  const index = array.indexOf(element);
  return index === -1
    ? array
    : [...array.slice(0, index), ...array.slice(index + 1)];
}
