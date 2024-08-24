export const initControls = (world) => {
  const playPauseButton = document.getElementById('play-pause');
  const nextStepButton = document.getElementById('next-step');
  const resetButton = document.getElementById('reset');
  const clearButton = document.getElementById('clear');
  const applyChangesButton = document.getElementById('apply-changes');
  const intervalInput = document.getElementById('interval-input');
  const widthInput = document.getElementById('width-input');
  const heightInput = document.getElementById('hight-input');
  const inputGroup = document.getElementById('inputs-section');

  intervalInput.value = world.interval;
  widthInput.value = world.width;
  heightInput.value = world.height;

  world.addEventListener('resume', () => playPauseButton.classList.add('play-pause-active'));
  world.addEventListener('stop', () => playPauseButton.classList.remove('play-pause-active'));
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
      if (event.key == 'ArrowUp' && world.interval > 10)
        world.interval -= 10;

      if (event.key == 'ArrowDown')
        world.interval += 10;
      intervalInput.value = world.interval;
    }
  });

  function onChange() {
    if (intervalInput.value > 0) {
      world.interval = +intervalInput.value;
    }
    if (widthInput.value > 0) {
      world.width = +widthInput.value;
    }
    if (heightInput.value > 0) {
      world.height = +heightInput.value;
    }
  }
};