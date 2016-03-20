import 'mrdoob/three.js';
import GTXLoader from '/src/loaders/GTXLoader.js';
import KCMLoader from '/src/loaders/KCMLoader.js';
import { padStr } from '/src/utils/Utils.js';
import Worker from '/src/utils/WorkerShim.js';
import { transfer } from 'casperlamboo/canvas-webworker';

const worker = new Worker('/LoaderTests/kcm_texture_webworker.worker.js');

const loaderKCM = new KCMLoader();
const loaderGTX = new GTXLoader();
loaderKCM.load('/data/MAPS/n_031_031.kcm', async ({ textureMaps }) => {
  const buffers = [];
  const transferData = [];

  for (const { alphaMap, textureID, firstLayer } of textureMaps) {
		const textureUrl = `/data/MAPS/Tex/b_${ padStr(Math.max(textureID, 1), 3) }.GTX`;

		const texture = await new Promise((resolve, reject) => {
			const texture = loaderGTX.load(textureUrl, () => {
				resolve(texture);
			}, undefined, reject);
		});

		const textureImage = textureToImage(texture);

    const { data, buffer } = transfer.encode(textureImage);

    transferData.push({
      texture: data,
      alphaMap: alphaMap
    });

    buffers.push(buffer);
	}

  worker.postMessage({
    msg: 'KCM_DATA',
    transfer: transferData,
  }, buffers);
});

worker.addEventListener('message', ({ data }) => {
  switch (data.msg) {
    case 'TEXTURE':
      const canvas = transfer.decode(data.transfer);

      document.body.appendChild(canvas);

      worker.terminate();
      break;
  }
});

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
