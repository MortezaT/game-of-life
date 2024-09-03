import {
  Store,
  StoreEventHandler,
  StoreEventType
} from '../store/index.js';
import { UnsubscribeFn } from '../types.js';

export abstract class Component {
  #node: HTMLElement | null = null;
  children: Component[] = [];
  protected _unSubscribeCallbackList: UnsubscribeFn[] = [];

  protected abstract createNode(): HTMLElement;
  abstract addListeners(): void;

  get node() {
    if (!this.#node) this.#node = this.createNode();

    return this.#node;
  }

  constructor(protected store: Store) {}

  init() {
    this._unsubscribe();
    this._forEachChild((child) => {
      this.node.appendChild(child.node);
      child.init();
    });
    this.addListeners();
  }

  render() {
    this._forEachChild((child) => child.render());
  }

  destroy() {
    this._unsubscribe();
    this.destroyNode();
    this._forEachChild((child) => child.destroy());
  }

  destroyNode() {
    this.node.remove();
  }

  protected _forEachChild = (callback: (child: Component) => void) =>
    this.children.forEach(callback);

  protected _listen<K extends keyof DocumentEventMap>(
    query: string,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  protected _listen<K extends keyof DocumentEventMap>(
    el: Element | Document,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  protected _listen(
    store: Store,
    type: StoreEventType,
    listener: StoreEventHandler
  ): void;
  protected _listen(eventSource: any, ...args: any[]) {
    if (typeof eventSource == 'string') eventSource = this._query(eventSource);
    if (!eventSource) return;

    eventSource.addEventListener(...args);
    this._unSubscribeCallbackList.push(() =>
      eventSource.removeEventListener(...args)
    );
  }

  protected _listenToStore = (
    type: StoreEventType,
    listener: StoreEventHandler
  ) => this._listen(this.store, type, listener);

  protected _watchStore = (...args: Parameters<Store['watch']>) => {
    this._unSubscribeCallbackList.push(this.store.watch(...args));
  };

  protected _unsubscribe = () =>
    this._unSubscribeCallbackList.forEach((cb) => cb());

  protected _query = <TElement extends HTMLElement = HTMLElement>(
    selector: string
  ) => this.node.querySelector<TElement>(selector);
  protected _queryAll = <TElement extends HTMLElement = HTMLElement>(
    selector: string
  ) => this.node.querySelectorAll<TElement>(selector);
}
