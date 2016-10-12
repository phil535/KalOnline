import 'systemjs-hot-reloader/default-listener.js';
import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls.js';
import GTXLoader from '/src/loaders/GTXLoader.js';
import KCMLoader from '/src/loaders/KCMLoader.js';
import { padStr } from '/src/utils/Utils.js';

const TEXTURE_WIDTH = 8192;
const TEXTURE_HEIGHT = 8192;

const LOADER_KCM = new KCMLoader();
const LOADER_GTX = new GTXLoader();

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });

const ambientLight = new THREE.AmbientLight(0x666666);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 100000);
camera.position.set(0, 15000, 10000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.EditorControls(camera, canvas);

LOADER_KCM.load('/data/MAPS/n_031_031.kcm', async ({ heightMap, textureMaps }) => {
  const map = await createTexture(textureMaps);

  const geometry = new THREE.PlaneGeometry(TEXTURE_WIDTH, TEXTURE_HEIGHT, 256, 256);
  const material = new THREE.MeshLambertMaterial({
    map,
    color: 0xffffff
  });
  const plane = new THREE.Mesh(geometry, material);

  geometry.vertices.forEach((vertex, i) => {
    const { x, y } = vertex;
    vertex.x = y;
    vertex.y = heightMap[i];
    vertex.z = x;
  });

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  scene.add(plane);
});

(function animate() {
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}());

async function createTexture(textureMaps) {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const context = canvas.getContext('2d');

  let first = true;
  for (const { alphaMap, textureID, firstLayer } of textureMaps) {
    const textureUrl = `/data/MAPS/Tex/b_${padStr(Math.max(textureID, 1), 3)}.GTX`;

    const texture = await new Promise((resolve, reject) => {
      const texture = LOADER_GTX.load(textureUrl, () => {
        resolve(texture);
      }, undefined, reject);
    });

    const textureImage = textureToImage(texture);
    const texturePattern = context.createPattern(textureImage, 'repeat');
    const alphaImage = createAlphaMap(alphaMap, 256, 256);

    if (first) {
      context.fillStyle = texturePattern;
      context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

      first = false;
    } else {
      const image = combineAlphaPattern(alphaImage, texturePattern, TEXTURE_WIDTH, TEXTURE_HEIGHT);

      context.drawImage(image, 0, 0);
    }
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}

function createAlphaMap(map, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  const imageData = context.getImageData(0, 0, width, height);

  for (let x = 0; x < width; x ++) {
    for (let y = 0; y < height; y ++) {
      const index = y * width + x;
      const color = map[index];

      imageData.data[index * 4 + 3] = color;
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}

function textureToImage(texture) {
  const { width, height } = texture.image;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  const scene = new THREE.Scene();

  const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);

  scene.add(plane);

  const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1);

  renderer.render(scene, camera);

  return renderer.domElement;
}

function combineAlphaPattern(alpha, pattern, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  context.drawImage(alpha, 0, 0, width, height);

  context.globalCompositeOperation = 'source-in';

  context.fillStyle = pattern;
  context.fillRect(0, 0, width, height);

  return canvas;
}
