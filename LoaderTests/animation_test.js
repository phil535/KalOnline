import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import Archer from '/src/model/Archer.js';
import GBObject from '/src/model/GBObject.js';

let clock = new THREE.Clock();

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 0;
camera.position.y = 20;
camera.position.z = -50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);

let model = new Archer();
scene.add(model.container);

(function animate () {
    requestAnimationFrame(animate);

	let delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);

	renderer.render(scene, camera);
}());
