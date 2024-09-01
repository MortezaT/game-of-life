import { Store } from '../store/index.js';

export abstract class Component {

  node: HTMLElement;
  abstract getNode(): HTMLElement;
  abstract destroyNode(): void;
  abstract render(): void;
  abstract addListeners(): void;
  abstract removeListeners(): void;

  constructor(protected store: Store) {
    this.node = this.getNode();
  }

  init() {
    this.addListeners();
  }

  destroy() {
    this.removeListeners();
    this.destroyNode();
  }
}
