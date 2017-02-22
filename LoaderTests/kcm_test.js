import 'systemjs-hot-reloader/default-listener.js';
import 'three';
import 'three/controls/EditorControls.js';
import GTXLoader from '/src/loaders/GTXLoader.js';
import KCMLoader from '/src/loaders/KCMLoader.js';

const WIDTH = 256;
const HEIGHT = 256;

const loaderKCM = new KCMLoader();
loaderKCM.load('/data/MAPS/n_031_031.kcm', (kcm) => {
  const { colorMap } = kcm;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const context = canvas.getContext('2d');
  const imageData = context.getImageData(0, 0, WIDTH, HEIGHT);

  let imageDataIndex = 0;
  let colorMapIndex = 0;
  const length = WIDTH * HEIGHT;
  for (let i = 0; i < length; i ++) {
    imageData.data[imageDataIndex ++] = colorMap[colorMapIndex ++]; // r
    imageData.data[imageDataIndex ++] = colorMap[colorMapIndex ++]; // g
    imageData.data[imageDataIndex ++] = colorMap[colorMapIndex ++]; // b
    imageData.data[imageDataIndex ++] = 255; // a
  }
  context.putImageData(imageData, 0, 0);

  document.body.appendChild(canvas);
});
