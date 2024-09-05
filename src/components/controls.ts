import {
  AppState,
  AppStateDiff,
  Store,
  StoreEventHandler,
  StoreWatchHandler,
} from '../store/index.js';
import { Component } from './component.js';

type KeyToActionMapper<TValue = any> = Record<
  string,
  (store: Store, value: TValue) => void
>;

type ActionMap = {
  input: KeyToActionMapper<number>;
  keyboard: { [key in 'raw' | 'shift']: KeyToActionMapper };
};

const runningActiveClassName = 'toggle-active';

export class Controls extends Component {
  get #toggleBtn() {
    return this._query('button.toggle');
  }

  get #inputs() {
    return this._queryAll<HTMLInputElement>('input');
  }

  #actionMaps: ActionMap = {
    keyboard: {
      raw: {
        ' ': (store) => store.toggle(),
        Escape: (store) => store.clear(),
        ArrowRight: (store) => {
          store.pause();
          store.next();
        },
      },
      shift: {
        ArrowUp: (store) => store.speedUp(),
        ArrowDown: (store) => store.speedDown(),
      },
    },
    input: {
      width: (store, width) => store.resize({ width }),
      height: (store, height) => store.resize({ height }),
      speed: (store, speed) => store.setSpeed(speed),
    },
  };

  override createNode(): HTMLElement {
    return document.createElement('aside');
  }

  override init(): void {
    const { width, height, speed, running } = this.store.state;
    this.node.innerHTML = `
<button class="toggle">Play/Pause</button>
<button class="next">Next step</button>
<button class="clear">Clear</button>
<div class="spacer"></div>
<label class="text-field">
  <span>Width</span>
  <input 
    class="width" 
    name="width" 
    type="number" 
    value="${width}"/>
</label>
<label class="text-field">
  <span>Height</span>
  <input 
    class="height" 
    name="height" 
    type="number" 
    value="${height}"/>
</label>
<label class="text-field">
  <span>Speed</span>
  <input 
    class="speed" 
    name="speed" 
    type="number" 
    value="${speed}"/>
</label>
<button class="apply" type="button">Apply changes</button>
`;

    if (running) this.#toggleBtn?.classList.add('toggle-active');
    super.init();
  }

  override render(): void {
    const { state } = this.store;
    this.node
      .querySelectorAll('input')
      .forEach(
        (input) =>
          (input.value = state[input.name as keyof AppState].toString())
      );
  }

  override addListeners(): void {
    this._listen(document, 'keydown', this.#onKeydown);
    this._listen(this.node, 'keydown', this.#onEnter);
    this._listen(this.#toggleBtn!, 'click', this.store.toggle);
    this._listen('.next', 'click', this.store.next);
    this._listen('.clear', 'click', this.store.clear);
    this._listen('button.apply', 'click', this.#onApplyChanges);
    this._watchStore(['height', 'width', 'speed'], this.#updateInputs);
    this._watchStore('running', ({ running }) => {
      running
        ? this.#toggleBtn!.classList.add(runningActiveClassName)
        : this.#toggleBtn!.classList.remove(runningActiveClassName);
    });
  }

  #onKeydown = (event: KeyboardEvent) => {
    const { key, shiftKey } = event;

    let map = shiftKey
      ? this.#actionMaps.keyboard.shift
      : this.#actionMaps.keyboard.raw;

    map[key]?.(this.store, key);
  };

  #onEnter = (e: KeyboardEvent) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.#onApplyChanges();
    }
  };
  #onApplyChanges = () => {
    this.#inputs.forEach(({ name, value }) => {
      this.#actionMaps.input[name]?.(this.store, +value);
    });
  };

  #updateInputs: StoreWatchHandler = (changes) => {
    this.#inputs.forEach((input) => {
      if (input.name in changes)
        input.value = changes[input.name as keyof AppStateDiff]!.toString();
    });
  };
}
