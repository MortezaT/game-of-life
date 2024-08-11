// TODO: Make everything functional (intro to functional programming)
// TODO: Auto-resize world based on window sizes
// TODO: Provide the option to add entities (like glider, etc)
// TODO: Persist world state
// TODO: Use SVG as the world
// TODO: Use Canvas as the world
// TODO: Use Workers as the world

import { initControls } from './controls.mjs';
import { World } from './world.mjs';

/** @type {boolean[][]} */
// glider
// 20, 50
const glider = [
  [true, false, true],
  [false, true, true],
  [false, true, false],
];
// X O X
// O X X
// O X O
// worldMap[1][1] = true;
// worldMap[1][3] = true;
// worldMap[2][2] = true;
// worldMap[2][3] = true;
// worldMap[3][2] = true;

const app = {
  init: () => {
    const worlds = [];
    window.worlds = worlds;
    const nodes = document.querySelectorAll('.world');
    nodes.forEach(node => {

      const world = new World(node, 10, 10);
      initControls(world);
      worlds.push(world);
    });

    // window.world2 = new World('world2');
    // window.world3 = new World('world3');
    // initControls(window.world2);
    // initControls(window.world3);
  }
};

app.init();
