export function repeatItem<T>(item: T, n: number): T[] {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(item);
  }
  return arr;
}
