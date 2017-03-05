import GTXLoader from '../loaders/GTXLoader.js';

export const MathExtended = {
  clamb(value, min, max) {
    return (value > min) ? ((value < max) ? value : max) : min;
  },
  randomInt(min, max) {
    return Math.floor(MathExtended.random(min, max + 1));
  },
  random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
  },
  sign(value) {
    return (value > 0) ? 1 : ((value < 0) ? -1 : 0);
  }
};

export function padStr(str, length) {
  str = String(str);
  while (str.length < length) {
    str = `0${str}`;
  }

  return str;
}

export function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export const loadGTX = (() => {
  const GTX_LOADER = new GTXLoader();

  return (url) => {
    return new Promise((resolve, reject) => {
      const texture = GTX_LOADER.load(url, () => {
        resolve(texture);
      }, undefined, reject);
    });
  };
})();

export const textureToImage = (() => {
  const RENDERER = new THREE.WebGLRenderer();
  RENDERER.preserverDrawingBuffer = true;
  const SCENE = new THREE.Scene();

  return (texture) => {
    const { width, height } = texture.image;

    RENDERER.setSize(width, height);

    const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);

    SCENE.add(plane);

    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1);

    RENDERER.render(SCENE, camera);

    return RENDERER.domElement;
  };
})();

export const canvasToBlob = canvas => new Promise(resolve => {
  canvas.toBlob(resolve, 'image/png');
});
