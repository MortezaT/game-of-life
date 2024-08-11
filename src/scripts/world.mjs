import { willCellSurvive } from './utils.mjs';

export class World {
  #intervalId = null;
  #interval = 50;

  state = null;
  isRunning = false;

  set interval(value) {
    value = + value;
    if (isNaN(value)) return;
    this.#interval = value;
    if (this.isRunning) {
      this.toggle();
    }
  }

  constructor(
    node,
    width = 100,
    height = 50
  ) {
    this.width = width;
    this.height = height;
    this.node = node;

    this.#init();
  }

  toggle = () => this.isRunning ? this.stop() : this.resume();
  stop = () => {
    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.isRunning = false;
  };
  resume = () => {
    this.#intervalId = setInterval(this.next, this.#interval);
    this.isRunning = true;
  };
  reset = () => {
    this.stop();
    this.#initState();
    this.render();
  };
  render = () => {
    const cells = this.node.getElementsByClassName('cell');
    this.state.forEach((row, i) => {
      row.forEach((isAlive, j) => {
        const cellNode = cells[i * this.width + j];
        // const cellNode = this.node.querySelector(`.cell#${getCellId(this.nodeName, i, j)}`);

        if (isAlive) {
          cellNode.classList.add('live');
        } else {
          cellNode.classList.remove('live');
        }
      });
    });
  };
  calculateNextState = () => {
    const newState = this.state.map((row, i) =>
      row.map((isAlive, j) => willCellSurvive(isAlive, this.getLiveNeighborsCount(i, j)))
    );
    this.state = newState;
  };
  next = () => {
    this.calculateNextState();
    this.render();
  };
  getLiveNeighborsCount(i, j) {
    const neighbors = [];
    for (let x = i - 1; x <= i + 1; x++) {
      let row = this.state[(this.height + x) % this.height];

      for (let y = j - 1; y <= j + 1; y++) {
        if (x == i && y == j) continue;
        let cell = row[(this.width + y) % this.width];

        neighbors.push(cell);
      }
    }

    return neighbors.filter(Boolean).length;
  }
  #init = () => {
    this.#initState();
    this.#initUI();
  };
  #initState = () => {
    const state = [];
    for (let i = 0; i < this.height; i++) {
      state[i] = [];
      for (let j = 0; j < this.width; j++) {
        state[i][j] = false;
      }
    }
    this.state = state;
  };
  #initUI = () => {
    this.state.forEach((row, i) => {
      const rowNode = document.createElement('div');
      rowNode.className = 'row';

      this.node.appendChild(rowNode);

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div');
        cellNode.className = 'cell';
        cellNode.dataset.i = i;
        cellNode.dataset.j = j;

        rowNode.appendChild(cellNode);
      });
    });

    this.node.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const i = +e.target.dataset['i'];
      const j = +e.target.dataset['j'];

      this.state[i][j] = !this.state[i][j];
      this.render();
    });
  };
}
