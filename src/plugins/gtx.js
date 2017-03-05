import { loadGTX, canvas, canvasToBlob } from '../utils/Utils.js';

export async function fetch(load) {
  const texture = await loadGTX(load.address);
  const canvas = textureToImage(texture);
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);

  load.metadata.url = url;
  return '';
}

export function instantiate(load) {
  return load.metadata.url;
}
