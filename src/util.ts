export const arrayOf = <A>(n: number, val: A): A[] => new Array(n).fill(val);
export const divMod = (n: number, m: number): [number, number] => [n / m | 0, n % m];

export function range(start: number, end: number, step?: number): number[] {
  const res = [];
  step = step ?? 1;
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      res.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      res.push(i);
    }
  }
  return res
}