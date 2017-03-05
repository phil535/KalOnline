import { canvasToBlob } from '../utils/Utils.js';
import pixelBitmap from 'pixel-bmp';

const CANVAS = document.createElement('canvas');
const CONTEXT = CANVAS.getContext('2d');

export async function fetch(load) {
  const [imageData] = await pixelBitmap.parse(load.address);

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
