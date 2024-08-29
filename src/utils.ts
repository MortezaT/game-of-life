export function willCellSurvive(isAlive: boolean, liveNeighborsCount: number): boolean {
  // Any live cell with fewer than two live neighbors dies, as if by under-population.
  // Any live cell with more than three live neighbors dies, as if by overpopulation.
  if (liveNeighborsCount < 2 || liveNeighborsCount > 3) return false;
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  if (liveNeighborsCount == 3) return true;
  // Any live cell with two or three live neighbors lives on to the next generation.
  if (liveNeighborsCount == 2) return isAlive;

  return false;
}
