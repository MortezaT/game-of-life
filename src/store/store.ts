import { OneRequired, UnsubscribeFn } from '../types.js';
import {
  getLiveNeighborsCount,
  makeArrayIfSingle,
  willCellSurvive,
} from '../utils/index.js';

export type StoreEventType =
  | 'cell-toggle'
  | 'change'
  | 'clear'
  | 'next'
  | 'pause'
  | 'play'
  | 'resize'
  | 'running'
  | 'speed-down'
  | 'speed-up'
  | 'speed'
  | 'tick'
  | 'toggle';

type StateDiffType = keyof AppStateDiff;

export type AppState = {
  readonly running: boolean;
  readonly width: number;
  readonly height: number;
  readonly speed: number;
  readonly world: boolean[][];
};

export type AppStateDiff = Partial<Omit<AppState, 'world'>> & {
  world?: number[][];
};

export type StoreEvent = {
  state: AppState;
  reason: StoreEventType;
};

export type StoreEventHandler = (state: StoreEvent) => void;
export type StoreWatchHandler = (diff: AppStateDiff, state: AppState) => void;

export class Store {
  protected get _hasChanges() {
    return Object.values(this._diffs).length > 0;
  }

  protected _eventHandlers: Record<string, StoreEventHandler[]> = {};

  get state() {
    return this._state;
  }

  get interval() {
    return Math.round(1000 / this._state.speed);
  }

  constructor(private _state: AppState, private _diffs: AppStateDiff = {}) {
    const { width, height } = this._state;
    this.resetWorld({ width, height });
    this.#tick();
  }

  toggleCell = (i: number, j: number) => {
    if (!this._state.world[i]) return;

    const world = this._state.world.map((row) => row.map((value) => value));
    world[i][j] = !world[i][j];

    this._onChange({ world }, 'cell-toggle');
  };

  play = () => this._onChange({ running: true }, ['running', 'play']);

  pause = () => this._onChange({ running: false }, ['running', 'pause']);

  toggle = () =>
    this._onChange({ running: !this._state.running }, ['running', 'toggle']);

  clear = () => {
    const world = this._state.world.map((row) => row.map((_) => false));
    this._onChange({ world }, 'clear');
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

    this._onChange({ world }, 'next');
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

    this._onChange({ speed }, reason);
  };

  watch = (
    keys: StateDiffType | StateDiffType[],
    handlerFn: StoreWatchHandler
  ): UnsubscribeFn => {
    keys = makeArrayIfSingle(keys);
    const handler: StoreEventHandler = () =>
      keys.some((key) => key in this._diffs) &&
      handlerFn(this._diffs, this._state);

    this.addEventListener('tick', handler);

    return () => this.removeEventListener('tick', handler);
  };

  addEventListener = (
    type: StoreEventType,
    eventHandler: StoreEventHandler
  ) => {
    if (!this._eventHandlers[type]) {
      this._eventHandlers[type] = [];
    }
    this._eventHandlers[type].push(eventHandler);
  };

  removeEventListener = (
    type: StoreEventType,
    eventHandler: StoreEventHandler
  ) => {
    this._eventHandlers[type] = (this._eventHandlers[type] || []).filter(
      (handler) => handler != eventHandler
    );
  };

  #emit = (reason: StoreEventType) => {
    const handlers = (this._eventHandlers.all || []).concat(
      this._eventHandlers[reason] || []
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

    this._onChange({ ...dimensions, world });
  }

  private _onChange = (
    changes: Partial<AppState>,
    type?: StoreEventType | StoreEventType[]
  ) => {
    const { world, ...rest } = changes;

    this._diffs = !world
      ? rest
      : { ...rest, world: this.#getWorldDiff(this._state.world, world) };

    this._state = { ...this._state, ...changes };

    if (!type) return;

    (Array.isArray(type) ? type : [type]).forEach(this.#emit);
  };

  #getWorldDiff = (prev: AppState['world'], current: AppState['world']) =>
    prev
      .flatMap((row, i) =>
        row.map(
          (lastStatus, j) =>
            (lastStatus != current[i]?.[j] ? [i, j] : undefined)!
        )
      )
      .filter(Boolean);

  #tick = () => {
    const { running } = this._state;
    this.#emit('tick');

    if (running) this.next();

    setTimeout(this.#tick, this.interval);
  };
}
