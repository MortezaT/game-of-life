import { App } from './components/index.js';
import { patterns } from './constants/patterns.js';
import { AppState, Store } from './store/index.js';

const initialState: AppState = {
  running: false,
  width: 50,
  height: 70,
  speed: 1,
  world: patterns.spaceships.glider,
};

const store = new Store(initialState);
const app = new App(store);

app.init();
app.render();
