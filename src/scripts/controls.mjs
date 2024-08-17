export const initControls = (world) => {
  const playPauseButton = document.getElementById('play-pause');
  const resetButton = document.getElementById('reset');
  const setIntervalButton = document.getElementById('set-interval');
  const intervalInput = document.getElementById('interval-input');

  world.addEventListener('resume', () => playPauseButton.classList.add('play-pause-active'));
  world.addEventListener('stop', () => playPauseButton.classList.remove('play-pause-active'));
  setIntervalButton.addEventListener('click', onChangeInterval);
  playPauseButton.addEventListener('click', world.toggle);
  resetButton.addEventListener('click', world.reset);
  intervalInput.addEventListener('keydown', (event) => {

    if (event.key == 'Enter') {
      onChangeInterval();
    }
  });

  function onChangeInterval() {
    if (intervalInput.value.length > 0) {
      world.interval = +intervalInput.value;
    }
  }
};