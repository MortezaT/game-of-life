// TODO: Use SVG as the world
// TODO: Use Canvas as the world
// TODO: Use Workers for calculations

import { Controls } from './controls.js';
import { Store } from '../store/index.js';
import { World } from './world.js';
import { Component } from './component.js';

export class App extends Component {
  children: Component[] = [new Controls(this.store), new World(this.store)];

  constructor(store: Store) {
    super(store);
    this.#tick();
  }

  override getNode(): HTMLElement {
    return document.getElementById('app')!;
  }

  override init(): void {
    this.children.forEach((child) => {
      this.node.appendChild(child.node);
      child.init();
    });

    super.init();
  }

  override destroyNode(): void {
    this.node.innerHTML = '';
  }

  override render(): void {
    this.children.forEach((child) => child.render());
  }

  override addListeners(): void {
    this.store.watch(this.#changeListener);
  }
  override removeListeners(): void {
    this.store.unwatch(this.#changeListener);
  }

  #changeListener = () => {
    this.render();
  };

  #tick = () => {
    const { running } = this.store.state;

    if (running) this.store.next();

    setTimeout(this.#tick, this.store.interval);
  };
}
