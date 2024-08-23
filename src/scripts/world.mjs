import { willCellSurvive } from './utils.mjs';

const defaultOptions = {
  width: 100,
  height: 50,
  initialState: []
};

export class World {
  #intervalId = null;
  #interval = 50;
  #width = defaultOptions.width;
  #height = defaultOptions.height;
  #eventHandlers = {};

  state = null;
  isRunning = false;

  get interval() { return this.#interval; };

  set interval(value) {
    if (isNaN(value)) return;
    this.#interval = +value;
    this.reload();
  }

  get width() { return this.#width; };

  set width(value) {
    if (isNaN(value)) return;
    this.#width = +value;
    this.reload();
  }

  get height() { return this.#height; };

  set height(value) {
    if (isNaN(value)) return;
    this.#height = +value;
    this.reload();
  }

  constructor(
    node,
    options
  ) {
    const { width, height, initialState = defaultOptions.initialState } = options;
    this.width = width;
    this.height = height;
    this.node = node;
    this.initialState = initialState;

    this.#init();
  }

  toggle = () => this.isRunning ? this.stop() : this.resume();

  reload = () => {
    if (this.isRunning) {
      this.stop();
      this.resume();
    }
  };

  stop = () => {
    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.isRunning = false;
    this.#emit('stop');
  };

  resume = () => {
    this.#intervalId = setInterval(this.nextStep, this.#interval);
    this.isRunning = true;
    this.#emit('resume');
  };

  reset = () => {
    this.stop();
    this.#initState();
    this.#render();
  };

  clear = () => {
    this.stop();
    this.initialState = [];
    this.#initState();
    this.#render();
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

  addEventListener = (eventType, eventHandler) => {
    if (!this.#eventHandlers[eventType]) {
      this.#eventHandlers[eventType] = [];
    }
    this.#eventHandlers[eventType].push(eventHandler);
  };

  removeEventListener = (eventType, eventHandler) => {
    const handlers = this.#eventHandlers[eventType];
    if (!handlers?.length) return;
    this.#eventHandlers[eventType] = handlers.filter((handler) => handler != eventHandler);
  };

  #render = () => {
    const cells = this.node.getElementsByClassName('cell');
    this.state.forEach((row, i) => {
      row.forEach((isAlive, j) => {
        const cellNode = cells[i * this.width + j];

        if (isAlive) {
          cellNode.classList.add('live');
        } else {
          cellNode.classList.remove('live');
        }
      });
    });
  };

  #calculateNextState = () => {
    const newState = this.state.map((row, i) =>
      row.map((isAlive, j) => willCellSurvive(isAlive, this.getLiveNeighborsCount(i, j)))
    );
    this.state = newState;
  };

  nextStep = () => {
    this.#calculateNextState();
    this.#render();
    this.#emit('change');
  };

  #emit = (eventType) => {
    this.#eventHandlers[eventType]?.forEach(handler => handler());
  };

  #init = () => {
    this.#initState();
    this.#initUI();
    this.#render();
  };

  #initState = () => {
    const state = [];

    for (let i = 0; i < this.height; i++) {
      state[i] = [];
      for (let j = 0; j < this.width; j++) {
        state[i][j] = this.initialState[i]?.[j] || false;
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
      this.#render();
    });
  };
}
