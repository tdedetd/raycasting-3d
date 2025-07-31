export function genArray<T>(count: number, mapper: (index: number) => T): T[] {
  return Array(count).fill(null).map((_, i) => mapper(i));
}
