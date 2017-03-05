import { canvasToBlob } from '../utils/Utils.js';
import pixelBitmap from 'pixel-bmp';

const CANVAS = document.createElement('canvas');
const CONTEXT = CANVAS.getContext('2d');

export async function fetch(load) {
  const [imageData] = await pixelBitmap.parse(load.address);

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] !== 0) continue;
    if (imageData.data[i + 1] !== 0) continue;
    if (imageData.data[i + 2] !== 0) continue;

    imageData.data[i + 3] = 0;
  }

  CANVAS.width = imageData.width;
  CANVAS.height = imageData.height;
  CONTEXT.putImageData(imageData, 0, 0);

  const blob = await canvasToBlob(CANVAS);
  const url = URL.createObjectURL(blob);

  load.metadata.url = url;
  return '';
}

export function instantiate(load) {
  return load.metadata.url;
}
