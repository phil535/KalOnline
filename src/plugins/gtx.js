import GTXLoader from '../loaders/GTXLoader.js';

const RENDERER = new THREE.WebGLRenderer();
RENDERER.preserverDrawingBuffer = true;
const GTX_LOADER = new GTXLoader();
const SCENE = new THREE.Scene();

export async function fetch(load) {
  const texture = await new Promise((resolve, reject) => {
    const texture = GTX_LOADER.load(load.address, () => {
      resolve(texture);
    }, undefined, reject);
  });

  const canvas = textureToImage(texture);
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

function textureToImage(texture) {
  const { width, height } = texture.image;

  RENDERER.setSize(width, height);

  const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);

  SCENE.add(plane);

  const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1);

  RENDERER.render(SCENE, camera);

  return RENDERER.domElement;
}
