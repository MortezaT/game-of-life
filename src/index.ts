import { App } from './components/index.js';
import { getPattern } from './constants/patterns.js';
import { AppState, Store } from './store/index.js';


const initialState: AppState = {
  running: true,
  width: 30,
  height: 30,
  speed: 5,
  world: getPattern('oscillators.pentaDecathlon'),
};

const store = new Store(initialState);
const app = new App(store);

app.init();
app.render();
