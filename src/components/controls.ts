import { AppState, Store } from '../store/index.js';
import { Component } from './component.js';

type KeyToActionMapper<TValue = any> = Record<
  string,
  (store: Store, value: TValue) => void
>;

type ActionMap = {
  input: KeyToActionMapper<number>;
  keyboard: { [key in 'raw' | 'shift']: KeyToActionMapper };
};

export class Controls extends Component {
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

  override getNode(): HTMLElement {
    return document.createElement('aside');
  }
  override destroyNode(): void {
    this.node.remove();
  }
  override init(): void {
    const { width, height, speed } = this.store.state;
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

    super.init();
  }

  override render(): void {
    const { state } = this.store;
    const toggle = <HTMLButtonElement>this.node.querySelector('.toggle');
    state.running
      ? toggle.classList.add('toggle-active')
      : toggle.classList.remove('toggle-active');

    this.node
      .querySelectorAll('input')
      .forEach(
        (input) =>
          (input.value = state[input.name as keyof AppState].toString())
      );
  }

  override addListeners(): void {
    document.addEventListener('keydown', this.#keyboardShortcuts);

    this.node
      .querySelector('.toggle')
      ?.addEventListener('click', this.store.toggle);

    this.node
      .querySelector('.next')
      ?.addEventListener('click', this.store.next);

    this.node
      .querySelector('.clear')
      ?.addEventListener('click', this.store.clear);

    this.node
      .querySelectorAll('input')
      .forEach((input) => input.addEventListener('change', this.#inputChange));
  }

  override removeListeners(): void {
    document.removeEventListener('keydown', this.#keyboardShortcuts);

    this.node
      .querySelector('.toggle')
      ?.removeEventListener('click', this.store.toggle);

    this.node
      .querySelector('.next')
      ?.removeEventListener('click', this.store.next);

    this.node
      .querySelector('.clear')
      ?.removeEventListener('click', this.store.clear);
    this.node
      .querySelectorAll('input')
      .forEach((input) =>
        input.removeEventListener('change', this.#inputChange)
      );
  }

  #keyboardShortcuts = (event: KeyboardEvent) => {
    const { key, shiftKey } = event;

    let map = shiftKey
      ? this.#actionMaps.keyboard.shift
      : this.#actionMaps.keyboard.raw;

    map[key]?.(this.store, key);
  };

  #inputChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;

    this.#actionMaps.input[name]?.(this.store, +value);
  };
}
