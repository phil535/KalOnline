import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GBObject from '../src/GBObject.js';
import GTXLoader from '../src/loaders/GTXLoader.js';

let monster = {
	formation: [
		new GBObject('../DATA/Monster/Clothes/M001_H1.gb'), 
		new GBObject('../DATA/Monster/Clothes/M001_B1.gb'), 
	], 
	bone: new GBObject('../DATA/Monster/Motion/T001_Bone.gb'), 
	animation: new GBObject('../DATA/Monster/Motion/T001_0_A_01.gb'), 
};

function createGeometry (formation, bone, animation) {
	return new Promise ((resolve, reject) => {
		(async () => {
			let {geometry: pieceBone} = await bone.load();
			let {geometry: pieceAnimation} = await animation.load();

			let geometry = new THREE.Geometry();
			let materials = [];

			for (let piece of formation) {
				let {geometry: pieceGeometry, materials: pieceMaterials} = await piece.load();

				geometry.merge(pieceGeometry, new THREE.Matrix4(), materials.length);
				materials.push(...pieceMaterials);

				geometry.skinWeights.push(...pieceGeometry.skinWeights);
				geometry.skinIndices.push(...pieceGeometry.skinIndices);
			}

			geometry.computeBoundingSphere();
			geometry.bones = pieceBone.bones;

			for (let material of materials) {
				material.skinning = true;
			}

			let material = new THREE.MeshFaceMaterial(materials);
			// let material = new THREE.MeshBasicMaterial({wireframe: true, skinning: true});
			let mesh = new THREE.SkinnedMesh(geometry, material);

			animation = new THREE.Animation(mesh, pieceAnimation.animation);

			resolve({mesh, animation});
		}());
	});
}

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

let promise = createGeometry(monster.formation, monster.bone, monster.animation);
promise.then(({mesh, animation}) => {
	scene.add(mesh);
	animation.play(0);
});

(function animate () {
    requestAnimationFrame(animate);

	let delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);

	renderer.render(scene, camera);
}());
