import { Component } from './component.js';

export class World extends Component {
  override createNode() {
    const node = document.createElement('div');
    node.classList.add('world');

    return node;
  }

  override init = () => {
    this.node.innerHTML = '';
    const { world } = this.store.state;

    world.forEach((row, i) => {
      const rowNode = document.createElement('div');
      rowNode.className = 'row';

      this.node.appendChild(rowNode);

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div');
        cellNode.className = 'cell';
        cellNode.dataset.coords = [i, j].join();

        rowNode.appendChild(cellNode);
      });
    });

    super.init();
  };

  override render = () => {
    const cells = this.node.getElementsByClassName('cell');
    const { world, width } = this.store.state;
    world.forEach((row, i) =>
      row.forEach((isAlive, j) => {
        const cellNode = cells[i * width + j];
        const lastStatus = cellNode.classList.contains('live');

        if (isAlive != lastStatus) cellNode.classList.toggle('live');
      })
    );
  };

  override addListeners(): void {
    this._listen(this.node, 'click', this.#cellToggleListener);
    this._listenToStore('resize', this.init);
    this._listenToStore('next', this.render);
    // TODO: render world on state change
    // this._watchStore('world', ({ world }) => world);
  }

  #cellToggleListener = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target! as HTMLElement;
    const [i, j] = target.dataset.coords!.split(',').map(Number);

    this.store.toggleCell(i, j);
  };
}
