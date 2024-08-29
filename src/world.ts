import { willCellSurvive } from './utils.js';

export type WorldState = boolean[][];

type WorldOptions = {
  width?: number;
  height?: number;
  interval?: number;
  initialState: WorldState;
};

const defaultOptions: Required<WorldOptions> = {
  width: 20,
  height: 30,
  interval: 50,
  initialState: [],
};

type WorldEvents = 'change' | 'resume' | 'stop';

export class World {
  #intervalId: number | null = null;
  #interval = defaultOptions.interval;
  #width = defaultOptions.width;
  #height = defaultOptions.height;
  #eventHandlers: Record<string, (() => void)[]> = {};
  #initialState: WorldState = [];

  state: WorldState = [];
  isRunning = false;

  get interval() {
    return this.#interval;
  }

  set interval(value) {
    if (isNaN(value)) return;
    this.#interval = +value;
    this.reload();
  }

  get width() {
    return this.#width;
  }

  set width(value) {
    if (isNaN(value)) return;
    this.#width = +value;
    this.#onResize();
    this.reload();
  }

  get height() {
    return this.#height;
  }

  set height(value) {
    if (isNaN(value)) return;
    this.#height = +value;
    this.#onResize();
    this.reload();
  }

  constructor(public node: HTMLElement, options: WorldOptions) {
    Object.entries(defaultOptions).forEach(
      ([key, value]) =>
        (options[key as keyof WorldOptions] = (options as any)[key] ?? value)
    );

    this.#width = options.width!;
    this.#height = options.height!;
    this.#initialState = options.initialState!;

    this.#init();
  }

  toggle = () => (this.isRunning ? this.stop() : this.resume());

  reload = () => {
    if (this.isRunning) {
      this.stop();
      this.resume();
    }
  };

  stop = () => {
    if (this.#intervalId) clearInterval(this.#intervalId);
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
    this.#initialState = [];
    this.#initState();
    this.#render();
  };

  getLiveNeighborsCount(i: number, j: number) {
    const neighbors: boolean[] = [];
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

  addEventListener = (eventType: WorldEvents, eventHandler: () => void) => {
    if (!this.#eventHandlers[eventType]) {
      this.#eventHandlers[eventType] = [];
    }
    this.#eventHandlers[eventType].push(eventHandler);
  };

  removeEventListener = (eventType: WorldEvents, eventHandler: () => void) => {
    const handlers = this.#eventHandlers[eventType];
    if (!handlers?.length) return;
    this.#eventHandlers[eventType] = handlers.filter(
      (handler) => handler != eventHandler
    );
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
      row.map((isAlive, j) =>
        willCellSurvive(isAlive, this.getLiveNeighborsCount(i, j))
      )
    );
    this.state = newState;
  };

  nextStep = () => {
    this.#calculateNextState();
    this.#render();
    this.#emit('change');
  };

  #emit = (eventType: WorldEvents) => {
    this.#eventHandlers[eventType]?.forEach((handler) => handler());
  };

  #onResize = () => {
    const wasRunning = this.isRunning;
    if (wasRunning) this.stop();

    this.#initialState = this.state;
    this.#init();

    if (wasRunning) this.resume();
  };

  #init = () => {
    this.#initState();
    this.#initUI();
    this.#render();
  };

  #initState = () => {
    const state: WorldState = [];

    for (let i = 0; i < this.height; i++) {
      state[i] = [];
      for (let j = 0; j < this.width; j++) {
        state[i][j] = this.#initialState[i]?.[j] || false;
      }
    }

    this.state = state;
  };

  #initUI = () => {
    this.node.innerHTML = '';
    this.state.forEach((row, i) => {
      const rowNode = document.createElement('div');
      rowNode.className = 'row';

      this.node.appendChild(rowNode);

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div');
        cellNode.className = 'cell';
        cellNode.dataset.i = '' + i;
        cellNode.dataset.j = '' + j;

        rowNode.appendChild(cellNode);
      });
    });

    this.node.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target! as HTMLElement;
      const i = +target.dataset.i!;
      const j = +target.dataset.j!;

      this.state[i][j] = !this.state[i][j];
      this.#render();
    });
  };
}
