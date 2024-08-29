import type { WorldState } from './world.js';

export class Store {
  #state: { [key in string]: WorldState } = {};
  // #state: Record<string, WorldState> = {};
  #storeKey = 'store';
  #persist = false;

  constructor(persist = false) {
    this.#persist = persist;
    if (!persist) return;

    const data = localStorage.getItem(this.#storeKey);
    if (data) {
      this.#state = JSON.parse(data);
    }
  }

  get = (key: string | number) => this.#state[key];

  set = (key: string | number, value: WorldState) => {
    this.#state[key] = value;
    if (this.#persist) this.#updateDb();
  };

  #updateDb = () => {
    localStorage.setItem(this.#storeKey, JSON.stringify(this.#state));
  };
}
