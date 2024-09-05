import { AppState } from '../store/index.js';
import { OneOrMany } from '../types.js';

type CalcOptions = {
  i: number;
  j: number;
  height: number;
  width: number;
};

const neighborsCoordinateOffset = Array(3)
  .fill(null)
  .map((_, i) =>
    Array(3)
      .fill(null)
      .map((_, j) => [i - 1, j - 1])
      .filter(([i, j]) => i || j)
  );

const normalizeValue = (value: number, max: number) => (max + value) % max;

export const getLiveNeighborsCount = (
  state: AppState['world'],
  { i, j, height, width }: CalcOptions
) =>
  neighborsCoordinateOffset
    .flatMap((row) =>
      row.map(
        ([x, y]) =>
          state[normalizeValue(x + i, height)][normalizeValue(y + j, width)]
      )
    )
    .filter(Boolean).length;

export function willCellSurvive(
  isAlive: boolean,
  liveNeighborsCount: number
): boolean {
  // Any live cell with fewer than two live neighbors dies, as if by under-population.
  // Any live cell with more than three live neighbors dies, as if by overpopulation.
  if (liveNeighborsCount < 2 || liveNeighborsCount > 3) return false;
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  if (liveNeighborsCount == 3) return true;
  // Any live cell with two or three live neighbors lives on to the next generation.
  if (liveNeighborsCount == 2) return isAlive;

  return false;
}

export const makeArrayIfSingle = <TItem>(items: OneOrMany<TItem>) =>
  Array.isArray(items) ? items : [items];
