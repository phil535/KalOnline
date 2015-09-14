import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GTXLoader from '/src/loaders/GTXLoader.js';
import KCMLoader from '/src/loaders/KCMLoader.js';

let loaderKCM = new KCMLoader();
loaderKCM.load('/data/MAPS/n_031_031.kcm').then((kcm) => {
	let {colorMap} = kcm;

	let canvas = document.getElementById('canvas');
	let context = canvas.getContext('2d');

	for (let i = 0; i < colorMap.length; i += 3) {
		let [r, g, b] = [colorMap[i], colorMap[i + 1], colorMap[i + 2]];
		let x = (i/3) % 256;
		let y = Math.floor((i/3) / 256);

		context.fillStyle = `rgb(${r}, ${g}, ${b})`;
		context.fillRect(x, y, 1, 1);
	}
});