import { StoreEvent } from '../store/index.js';
import { Component } from './component.js';

export class World extends Component {
  override getNode() {
    const node = document.createElement('div');
    node.classList.add('world');

    return node;
  }

  override destroyNode(): void {
    this.node.remove();
  }

  override init = () => {
    this.node.innerHTML = '';
    const { world } = this.store.state;

    world.forEach((row, i) => {
      const rowNode = document.createElement('div');
      rowNode.className = 'row';

      this.node.appendChild(rowNode);

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div');
        cellNode.className = 'cell';
        cellNode.dataset.coords = [i, j].join();

        rowNode.appendChild(cellNode);
      });
    });

    super.init();
  };

  override render = () => {
    const cells = this.node.getElementsByClassName('cell');
    const { world, width } = this.store.state;
    world.forEach((row, i) =>
      row.forEach((isAlive, j) => {
        const cellNode = cells[i * width + j];
        const lastStatus = cellNode.classList.contains('live');

        if (isAlive != lastStatus) cellNode.classList.toggle('live');
      })
    );
  };

  override addListeners(): void {
    this.node.addEventListener('click', this.#cellToggleListener);
    this.store.removeEventListener('resize', this.#resizeListener);
  }

  override removeListeners(): void {
    this.node.removeEventListener('click', this.#cellToggleListener);
    this.store.removeEventListener('resize', this.#resizeListener);
  }

  #cellToggleListener = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target! as HTMLElement;
    const [i, j] = target.dataset.coords!.split(',').map(Number);

    this.store.toggleCell(i, j);
  };

  #resizeListener = () => {
    this.init();
  };

  // toggle = () => (this.isRunning ? this.stop() : this.resume());

  /* reload = () => {
    if (this.isRunning) {
      this.stop();
      this.resume();
    }
  }; */

  /* stop = () => {
    if (this.#intervalId) clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.isRunning = false;
    this.#emit('stop');
  };

  resume = () => {
    this.#intervalId = setInterval(this.nextStep, this.#interval);
    this.isRunning = true;
    this.#emit('resume');
  }; */

  /* reset = () => {
    this.stop();
    this.#initState();
    this.#render();
  }; */

  /* clear = () => {
    this.stop();
    this.#initialState = [];
    this.#initState();
    this.#render();
  }; */

  /*   addEventListener = (eventType: WorldEvents, eventHandler: () => void) => {
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
  }; */

  // nextStep = () => {
  //   this.state = calculateNextState(this.state, {
  //     height: this.height,
  //     width: this.width,
  //   });
  //   this.#render();
  //   this.#emit('change');
  // };

  // #emit = (eventType: WorldEvents) => {
  //   this.#eventHandlers[eventType]?.forEach((handler) => handler());
  // };

  // #onResize = () => {
  //   const wasRunning = this.isRunning;
  //   if (wasRunning) this.stop();

  //   this.#initialState = resize(this.state, {
  //     width: this.width,
  //     height: this.height,
  //   });
  //   this.#initUI();
  //   this.#render();
  //   this.#emit('change');

  //   if (wasRunning) this.resume();
  // };

  // #init = () => {
  //   this.#initState();
  //   this.#initUI();
  //   this.#render();
  // };

  // #initState = () => {
  //   const state: WorldState = [];

  //   for (let i = 0; i < this.height; i++) {
  //     state[i] = [];
  //     for (let j = 0; j < this.width; j++) {
  //       state[i][j] = this.#initialState[i]?.[j] || false;
  //     }
  //   }

  //   this.state = state;
  // };
}
