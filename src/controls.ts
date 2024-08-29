import { World } from './world.js';

export const initControls = (world: World) => {
  const playPauseButton = document.getElementById('play-pause') as HTMLButtonElement;
  const nextStepButton = <HTMLButtonElement>document.getElementById('next-step');
  const resetButton = document.getElementById('reset')!;
  const clearButton = document.getElementById('clear')!;
  const applyChangesButton = document.getElementById('apply-changes')!;
  const inputGroup = document.getElementById('inputs-section')!;
  const intervalInput =
    document.querySelector<HTMLInputElement>('#interval-input')!;
  const widthInput = document.querySelector<HTMLInputElement>('#width-input')!;
  const heightInput = document.querySelector<HTMLInputElement>('#hight-input')!;

  intervalInput.value = '' + world.interval;
  widthInput.value = '' + world.width;
  heightInput.value = '' + world.height;

  world.addEventListener('resume', () =>
    playPauseButton.classList.add('play-pause-active')
  );
  world.addEventListener('stop', () =>
    playPauseButton.classList.remove('play-pause-active')
  );
  applyChangesButton.addEventListener('click', onChange);
  playPauseButton.addEventListener('click', world.toggle);
  nextStepButton.addEventListener('click', world.nextStep);
  resetButton.addEventListener('click', world.reset);
  clearButton.addEventListener('click', world.clear);
  inputGroup.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
      onChange();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key == ' ') world.toggle();

    if (event.key == 'Escape') world.clear();

    if (event.shiftKey) {
      if (event.key == 'ArrowUp' && world.interval > 10) world.interval -= 10;

      if (event.key == 'ArrowDown') world.interval += 10;
      intervalInput.value = '' + world.interval;
    }
  });

  function onChange() {
    if (intervalInput.value) {
      world.interval = +intervalInput.value;
    }
    if (widthInput.value) {
      world.width = +widthInput.value;
    }
    if (heightInput.value) {
      world.height = +heightInput.value;
    }
  }
};
