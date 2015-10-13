import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls.js';
import GTXLoader from '/src/loaders/GTXLoader.js';
import KCMLoader from '/src/loaders/KCMLoader.js';
import ImageData from '/src/utils/ImageData.js';

let loaderKCM = new KCMLoader();
let loaderGTX = new GTXLoader();
loaderKCM.load('/data/MAPS/n_031_031.kcm').then(async ({textureMaps}) => {

	let colorMap = [];

	for (let {alphaMap, textureID, firstLayer} of textureMaps) {

		let textureUrl = `../data/MAPS/Tex/b_00${textureID + 1}.GTX`;

		let map = await new Promise((resolve, reject) => {
			let map = loaderGTX.load(textureUrl, () => {
				resolve(map);
			}, reject);
		});

		let imageData = textureToImageData(map);

		for (let x = 0; x < imageData.width; x ++) {
			for (let y = 0; y < imageData.height; y ++) {
				let i = y * imageData.width + x;

				let color = imageData.getPixel(x, y);

				if (firstLayer) {
					colorMap[i] = color;
				}
				else {
					let _i = Math.floor(y/2) * imageData.width / 2 + Math.floor(x/2);

					let alpha = alphaMap[_i];

					color.a = alpha;

					colorMap[i].a = alpha / 256;

					// colorMap[i] = colorMap[i].blend(color);
				}
			}
		}
	}

	let texture = new ImageData(512, 512);

	for (let x = 0; x < texture.width; x ++) {
		for (let y = 0; y < texture.height; y ++) {
			let i = y * texture.width + x;
			let color = colorMap[i];

			texture.setPixel(color, x, y);
		}
	}

	let canvas = document.getElementById('canvas');
	let context = canvas.getContext('2d');

	let imageData = context.getImageData(0, 0, texture.width, texture.height);
	for (let i = 0; i < imageData.data.length; i ++) {
		imageData.data[i] = texture.data[i];
	}

	context.putImageData(imageData, 0, 0);
});

function createAlphaMap (map, width, height) {
	let canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	let context = canvas.getContext('2d');

	for (let x = 0; x < width; x ++) {
		for (let y = 0; y < height; y ++) {
			let i = y * canvas.width + x;
			let color = map[i];
			context.fillStyle = `rgb(${color}, ${color}, ${color})`;
			context.fillRect(x, y, 1, 1);
		}
	}

	return canvas;
}

function textureToImageData (texture) {
	let {width, height} = texture.image;

	let webGLCanvas = document.createElement('canvas');
	webGLCanvas.width = width;
	webGLCanvas.height = height;

	let renderer = new THREE.WebGLRenderer({
	    preserveDrawingBuffer: true, 
		canvas: webGLCanvas
	});

	let scene = new THREE.Scene();

	let geometry = new THREE.PlaneGeometry(width, height, 1, 1);
	let material = new THREE.MeshBasicMaterial({map: texture});
	let plane = new THREE.Mesh(geometry, material);

	scene.add(plane);

	let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1);

	renderer.render(scene, camera);

	let canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext('2d');

	context.drawImage(webGLCanvas, 0, 0);

	let imageData = new ImageData(context);

	return imageData;
}
