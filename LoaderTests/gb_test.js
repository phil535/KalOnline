import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GBLoader from 'src/loaders/GBLoader.js';

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas: canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = -50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);

function loaded (geometry, materials) {
	let mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

	scene.add(mesh);
}

let loader = new GBLoader();
loader.load('../DATA/Model/Clothes/Cm_10_a01.gb', loaded);
loader.load('../DATA/Model/Clothes/Cm_10_p01.gb', loaded);
loader.load('../DATA/Model/Clothes/Cm_0_f01.gb', loaded);
loader.load('../DATA/Model/Clothes/Cm_10_g01.gb', loaded);
loader.load('../DATA/Model/Clothes/Cm_10_s01.gb', loaded);
loader.load('../DATA/Model/Clothes/Cm_10_h01.gb', loaded);

// loader.load('../Data/OBJECTS/b/1/land/[a]tree_p02.gb', loaded);

(function animate () {
    requestAnimationFrame(animate);

	renderer.render(scene, camera);
}());
