import 'mrdoob/three.js';
import OPLLoader from '/src/loaders/OPLLoader.js';
import GBLoader from '/src/loaders/GBLoader.js';

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 150;
camera.position.y = 150;
camera.position.z = -150;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var loaderOPL = new OPLLoader();
loaderOPL.load('/data/MAPS/n_031_031.opl').then(({header, opl}) => {
	let mesh;
	let loader = new GBLoader();

	let done = [];

	(async () => {
		for (let {url} of opl) {
			if (done.indexOf(url) !== -1) {
				continue;
			}
			done.push(url);

			if (mesh) {
				mesh.geometry.dispose();
				scene.remove(mesh);
			}

			let {geometry, materials} = await loader.load(`/${url}`);

			let material = new THREE.MeshFaceMaterial(materials);
			mesh = new THREE.Mesh(geometry, material);

			scene.add(mesh);

			try {
				renderer.render(scene, camera);
			}
			catch (error) {
				console.log(error, url);
			}

			await new Promise ((resolve, reject) => {
				setTimeout(resolve, 1000);
			});
		}
		console.log('finish');
	}());
});
