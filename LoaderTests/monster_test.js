import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GBObject from 'src/model/GBObject.js';
import GTXLoader from 'src/loaders/GTXLoader.js';
import Model from 'src/model/Model.js';

let formation = [
	new GBObject('/DATA/Monster/Clothes/M001_H1.gb'), 
	new GBObject('/DATA/Monster/Clothes/M001_B1.gb')
];
let bones = new GBObject('/DATA/Monster/Motion/T001_Bone.gb');
let animation = new GBObject('/DATA/Monster/Motion/T001_0_A_01.gb');

let clock = new THREE.Clock();

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = -50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);

let monster = new Model();
monster.createGeometry(formation, bones);
monster.setAnimation(animation);

scene.add(monster.container);

(function animate () {
	let delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);

	renderer.render(scene, camera);

    requestAnimationFrame(animate);
}());
