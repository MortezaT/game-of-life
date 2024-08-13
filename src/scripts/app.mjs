// TODO: Make everything functional (intro to functional programming)
// TODO: Provide the option to add entities (like glider, etc)
// TODO: Persist world state
// TODO: Use SVG as the world
// TODO: Use Canvas as the world
// TODO: Use Workers as the world

import { initControls } from './controls.mjs';
import { World } from './world.mjs';

const app = {
  init: () => {
    const worlds = [];
    window.worlds = worlds;
    const nodes = document.querySelectorAll('.world');
    nodes.forEach(node => {

      const world = new World(node, 50, 50);
      initControls(world);
      worlds.push(world);
    });
  }
};

app.init();
