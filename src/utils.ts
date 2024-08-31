import { WorldState } from './world';

type CalcOptions = {
  i: number;
  j: number;
  height: number;
  width: number;
};
const neighborsCoordinates = Array(3)
  .fill(null)
  .map((_, i) =>
    Array(3)
      .fill(null)
      .map((_, j) => [i - 1, j - 1])
      .filter(([i, j]) => i || j)
  );

const normalizeValue = (value: number, max: number) => (max + value) % value;

const getLiveNeighborsCount = (
  state: WorldState,
  { i, j, height, width }: CalcOptions
) =>
  neighborsCoordinates
    .flatMap((row) =>
      row.map(
        ([x, y]) =>
          state[normalizeValue(x + i, height)][normalizeValue(y + j, width)]
      )
    )
    .filter(Boolean).length;

function willCellSurvive(
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

export const calculateNextState = (
  prev: WorldState,
  options: Pick<CalcOptions, 'height' | 'width'>
) =>
  prev.map((row, i) =>
    row.map((isAlive, j) =>
      willCellSurvive(
        isAlive,
        getLiveNeighborsCount(prev, { i, j, ...options })
      )
    )
  );

export const resize = (
  state: WorldState,
  {
    width = state.length,
    height = state[0].length,
  }: { width?: number; height: number }
) =>
  Array.from({ length: width }, (_, i) =>
    Array.from({ length: height }, (_, j) => state?.[i]?.[j] ?? false)
  );
