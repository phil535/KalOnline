import { gtxToImage } from '../utils/Utils.js'

export async function fetch(load) {
  const canvas = await gtxToImage(load.address);
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(resolve, 'image/png');
  });
  const url = URL.createObjectURL(blob);

  load.metadata.url = url;
  return '';
}

export function instantiate(load) {
  return load.metadata.url;
}
