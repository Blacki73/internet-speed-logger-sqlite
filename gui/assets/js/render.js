const getControlsHeight = () => {
  const controls = document.querySelector('#controls');
  if (controls) {
    return controls.offsetHeight;
  }
  return 0;
};

const calculateLayoutSize = () => {
  const webview = document.querySelector('webview');
  const windowWidth = document.documentElement.clientWidth;
  const windowHeight = document.documentElement.clientHeight;
  const controlsHeight = getControlsHeight();
  const webviewHeight = windowHeight - controlsHeight;

  webview.style.width = `${windowWidth - 1}px`;
  webview.style.height = `${webviewHeight - 1}px`;
};

window.addEventListener('DOMContentLoaded', () => {
  calculateLayoutSize();
  window.onresize = calculateLayoutSize();
});

const start = document.getElementById('start');
const stop = document.getElementById('stop');

start.addEventListener('click', async (e) => {
  const state = await window.electronAPI.startDeamon();
  if (state) {
    e.target.classList.add('hidden');
    stop.classList.remove('hidden');
  }
});

stop.addEventListener('click', async (e) => {
  const state = await window.electronAPI.stopDeamon();
  if (state) {
    e.target.classList.add('hidden');
    start.classList.remove('hidden');
  }
});
