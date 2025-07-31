export function areElementsEqual<T>(list: T[]): boolean {
  if (list.length === 0) {
    return true;
  }

  for (const element of list) {
    if (element !== list[0]) {
      return false;
    }
  }

  return true;
}
