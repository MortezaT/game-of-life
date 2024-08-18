// TODO: Use SVG as the world
// TODO: Use Canvas as the world
// TODO: Use Workers as the world

import { initControls } from './controls.mjs';
import { Store } from './store.mjs';
import { World } from './world.mjs';

class App {
  #worlds = [];
  #store = new Store(true);
  init = () => {
    const nodes = document.querySelectorAll('.world');
    nodes.forEach((node, id) => {
      const world = new World(node, {
        width: 100,
        height: 50,
        initialState: this.#store.get(id),
      });
      initControls(world);
      this.#worlds.push({ id, world, });
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
};

const app = new App();

app.init();
