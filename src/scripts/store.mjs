export class Store {
  #state = {};
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

  get = (key) => this.#state[key];

  set = (key, value) => {
    this.#state[key] = value;
    if (this.#persist) this.#updateDb();
  };

  #updateDb = () => {
    localStorage.setItem(this.#storeKey, JSON.stringify(this.#state));
  };
}

