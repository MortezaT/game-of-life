// TODO: Use SVG as the world
// TODO: Use Canvas as the world
// TODO: Use Workers for calculations

import { Controls } from './controls.js';
import { Store } from '../store/index.js';
import { World } from './world.js';
import { Component } from './component.js';

export class App extends Component {
  constructor(store: Store) {
    super(store);

    this.children = [new Controls(this.store), new World(this.store)];
  }

  protected override createNode(): HTMLElement {
    return document.getElementById('app')!;
  }

  override destroyNode(): void {
    this.node.innerHTML = '';
  }

  override addListeners(): void {}
}
