import { OneRequired } from '../types.js';
import { getLiveNeighborsCount, willCellSurvive } from '../utils/index.js';

export type StoreEventType =
  | 'all'
  | 'clear'
  | 'cell-toggle'
  | 'next'
  | 'pause'
  | 'play'
  | 'resize'
  | 'running'
  | 'speed'
  | 'speed-down'
  | 'speed-up'
  | 'toggle';

export type AppState = {
  readonly running: boolean;
  readonly width: number;
  readonly height: number;
  readonly speed: number;
  readonly world: boolean[][];
};

export type StoreEvent = {
  state: AppState;
  reason: StoreEventType;
};

type StoreEventHandler = (event: StoreEvent) => void;

export class Store {
  get state() {
    return this._state;
  }

  get interval() {
    return Math.round(1000 / this._state.speed);
  }

  #eventHandlers: Record<string, StoreEventHandler[]> = {};

  constructor(private _state: AppState) {
    const { width, height } = this._state;
    this.resetWorld({ width, height });
  }

  toggleCell = (i: number, j: number) => {
    if (!this._state.world[i]) return;

    const world = this._state.world.map((row) => row.map((value) => value));
    world[i][j] = !world[i][j];

    this.setChange({ world }, 'cell-toggle');
  };

  play = () => this.setChange({ running: true }, ['running', 'play']);

  pause = () => this.setChange({ running: false }, ['running', 'pause']);

  toggle = () =>
    this.setChange({ running: !this._state.running }, ['running', 'toggle']);

  clear = () => {
    const world = this._state.world.map((row) => row.map((_) => false));
    this.setChange({ world }, 'clear');
  };

  next = () => {
    const { width, height } = this._state;

    const world = this._state.world.map((row, i) =>
      row.map((isAlive, j) =>
        willCellSurvive(
          isAlive,
          getLiveNeighborsCount(this._state.world, { i, j, width, height })
        )
      )
    );

    this.setChange({ world }, 'next');
  };

  resize = (dimensions: OneRequired<Pick<AppState, 'width' | 'height'>>) => {
    const { width, height } = { ...this._state, ...dimensions };
    if (width == this._state.width && height == this._state.height) return;

    this.resetWorld({ width, height, ...dimensions });
    this.#emit('resize');
  };

  setSpeed = (speed: number) => this.changeSpeed(speed, 'speed');
  speedUp = () =>
    this.changeSpeed(this._state.speed + 1, ['speed', 'speed-up']);
  speedDown = () =>
    this.changeSpeed(this._state.speed - 1, ['speed', 'speed-down']);

  private changeSpeed = (
    speed: number,
    reason: StoreEventType | StoreEventType[]
  ) => {
    if (100 < speed || speed < 0) return;

    this.setChange({ speed }, reason);
  };

  watch = (handler: StoreEventHandler) => this.addEventListener('all', handler);

  unwatch = (handler: StoreEventHandler) =>
    this.removeEventListener('all', handler);

  addEventListener = (
    type: StoreEventType,
    eventHandler: StoreEventHandler
  ) => {
    if (!this.#eventHandlers[type]) {
      this.#eventHandlers[type] = [];
    }
    this.#eventHandlers[type].push(eventHandler);
  };

  removeEventListener = (
    type: StoreEventType,
    eventHandler: StoreEventHandler
  ) => {
    this.#eventHandlers[type] = (this.#eventHandlers[type] || []).filter(
      (handler) => handler != eventHandler
    );
  };

  #emit = (reason: StoreEventType) => {
    const handlers = (this.#eventHandlers.all || []).concat(
      this.#eventHandlers[reason] || []
    );
    handlers.forEach((handle) => handle({ reason, state: this._state }));
  };

  private resetWorld(dimensions: { width: number; height: number }) {
    const { width, height } = dimensions;
    const world = Array.from({ length: height }, (_, i) =>
      Array.from(
        { length: width },
        (_, j) => this._state.world?.[i]?.[j] ?? false
      )
    );

    this.setChange({ ...dimensions, world });
  }

  private setRunning = (
    type: StoreEventType,
    setter: (running: boolean) => boolean
  ) => {
    this.setChange({ running: setter(this._state.running) }, type);
  };

  private setChange = (
    changes: Partial<AppState>,
    type?: StoreEventType | StoreEventType[]
  ) => {
    this._state = { ...this._state, ...changes };

    if (!type) return;

    (Array.isArray(type) ? type : [type]).forEach(this.#emit);
  };
}
