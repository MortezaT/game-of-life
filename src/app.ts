// TODO: Use SVG as the world
// TODO: Use Canvas as the world
// TODO: Use Workers as the world

import { initControls } from './controls.js';
import { Store } from './store.js';
import { World } from './world.js';

class App {
  #worlds: { id: number; world: World }[] = [];
  #store = new Store(true);
  init = () => {
    const nodes = document.querySelectorAll<HTMLElement>('.world');
    nodes.forEach((node, id) => {
      const world = new World(node, { initialState: this.#store.get(id) });
      initControls(world);
      this.#worlds.push({ id, world });
      this.#addListeners();
    });
  };

  #addListeners = () => {
    this.#worlds.forEach(({ id, world }) => {
      world.addEventListener('change', () => {
        this.#store.set(id, world.state);
      });
    });
  };
}

const app = new App();

app.init();
