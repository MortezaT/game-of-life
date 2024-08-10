const app = () => {
  const worldWidth = 100;
  const worldHeight = 50;
  let interval = 50;
  let isPlaying = false;

  const worldNode = document.getElementById('world');
  const playPauseButton = document.getElementById('play-pause');
  const resetButton = document.getElementById('reset');
  const setIntervalButton = document.getElementById('set-interval');
  const intervalInput = document.getElementById('interval-input');

  let worldMap = createWorldMap();
  createWorld();
  // glider
  worldMap[1][1] = true;
  worldMap[1][3] = true;
  worldMap[2][2] = true;
  worldMap[2][3] = true;
  worldMap[3][2] = true;

  renderWorld();
  bindListeners();

  setIntervalButton.addEventListener('click', onChangeInterval());
  intervalInput.addEventListener('keydown', () => {
    if (event.keyCode == 13) {
      onChangeInterval();
    }
  });

  function onChangeInterval() {
    if (intervalInput.value.length > 0) {
      interval = parseInt(intervalInput.value);
      if (isPlaying) {
        togglePlay();
        setTimeout(togglePlay, 1);
      }
    }
  }

  function createWorldMap() {
    const world = [];
    for (let i = 0; i < worldHeight; i++) {
      world[i] = [];
      for (let j = 0; j < worldWidth; j++) {
        world[i][j] = false;
      }
    }
    return world;
  }

  function createWorld() {
    worldMap.forEach((row, i) => {
      const rowNode = document.createElement('div');
      rowNode.className = 'row';

      worldNode.appendChild(rowNode);

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div');
        cellNode.className = 'cell';
        cellNode.id = getCellId(i, j);

        rowNode.appendChild(cellNode);
      });
    });
  }

  function renderWorld() {
    worldMap.forEach((row, i) => {
      row.forEach((isAlive, j) => {
        const cellNode = document.querySelector(`.cell#${getCellId(i, j)}`);

        if (isAlive) {
          cellNode.classList.add('live');
        } else {
          cellNode.classList.remove('live');
        }
      });
    });
  }

  function calculateNextStep() {
    return worldMap.map((row, i) =>
      row.map((isAlive, j) => willSurvive(isAlive, getLiveNeighborsCount(i, j)))
    );
  }

  function getLiveNeighborsCount(i, j) {
    const neighbors = [];
    for (let x = i - 1; x <= i + 1; x++) {
      let row = worldMap[(worldHeight + x) % worldHeight];

      for (let y = j - 1; y <= j + 1; y++) {
        if (x == i && y == j) continue;
        let cell = row[(worldWidth + y) % worldWidth];

        neighbors.push(cell);
      }
    }

    return neighbors.filter(Boolean).length;
  }

  function willSurvive(isAlive, liveNeighborsCount) {
    // Any live cell with fewer than two live neighbors dies, as if by under-population.
    // Any live cell with more than three live neighbors dies, as if by overpopulation.
    if (liveNeighborsCount < 2 || liveNeighborsCount > 3)
      return false;
    // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
    if (liveNeighborsCount == 3)
      return true;
    // Any live cell with two or three live neighbors lives on to the next generation.
    if (liveNeighborsCount == 2)
      return isAlive;
  }

  function next() {
    worldMap = calculateNextStep();
    renderWorld();
  }

  function bindListeners() {
    playPauseButton.addEventListener('click', togglePlay);

    worldNode.addEventListener('click', (e) => {
      const [i, j] = getCoordsFromId(e.target.id);
      worldMap[i][j] = !worldMap[i][j];
      renderWorld();
    });

    resetButton.addEventListener('click', () => {
      if (isPlaying) togglePlay();
      worldMap = createWorldMap();
      renderWorld();
    });
  }

  function togglePlay() {
    if (togglePlay.intervalId) {
      clearInterval(togglePlay.intervalId);
      togglePlay.intervalId = null;
      isPlaying = false;
    } else {
      togglePlay.intervalId = setInterval(next, interval);
      isPlaying = true;
    }
  }

  function getCellId(i, j) {
    return `cell-${i}-${j}`;
  }

  function getCoordsFromId(id) {
    return id.split('-').splice(1).map(Number);
  }
};

app();
