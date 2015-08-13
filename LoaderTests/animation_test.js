import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GBLoader from 'src/loaders/GBLoader.js';

let formation = {
	a: {url: '../DATA/Model/Clothes/Cm_0_a01.gb', loaded: false}, 
	p: {url: '../DATA/Model/Clothes/Cm_0_p01.gb', loaded: false}, 
	f: {url: '../DATA/Model/Clothes/Cm_0_f01.gb', loaded: false}, 
	g: {url: '../DATA/Model/Clothes/Cm_0_g01.gb', loaded: false}, 
	s: {url: '../DATA/Model/Clothes/Cm_0_s01.gb', loaded: false}, 
	h: {url: '../DATA/Model/Clothes/Cm_0_h01.gb', loaded: false}, 
	bone: {url: '../DATA/Model/Motion/tm_bone.gb', loaded: false}, 
	animation: {url: '../DATA/Model/Motion/Tm_0_A_02.gb', loaded: false}
};

function init () {
	let materials = [];
	let geometry = new THREE.Geometry();

	for (let i in formation) {
		if (i !== 'bone' && i !== 'animation') {
			let piece = formation[i];

			geometry.merge(piece.geometry, new THREE.Matrix4(), materials.length);
			materials = materials.concat(piece.materials);

			//hack?
			geometry.skinWeights = geometry.skinWeights.concat(piece.geometry.skinWeights);
			geometry.skinIndices = geometry.skinIndices.concat(piece.geometry.skinIndices);
		}
	}

	geometry.computeBoundingSphere();
	geometry.bones = formation.bone.geometry.bones;

	for (let i = 0; i < materials.length; i ++) {
		let material = materials[i];
		material.skinning = true;
	}

	let material = new THREE.MeshFaceMaterial(materials);

	let mesh = new THREE.SkinnedMesh(geometry, material);
	scene.add(mesh);

	geometry.animation = new THREE.Animation(mesh, formation.animation.geometry.animation);
	geometry.animation.play(0);
}

let clock = new THREE.Clock();

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas: canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = -50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);

let loader = new GBLoader();

for (let i in formation) {
	let piece = formation[i];
	((piece) => {
		loader.load(piece.url, (geometry, materials) => {
			piece.geometry = geometry;
			piece.materials = materials;
			piece.loaded = true;

			for (let i in formation) {
				piece = formation[i];
				if (!piece.loaded) {
					return;
				}
			}
			init();
		});
	})(piece);
}

(function animate () {
    requestAnimationFrame(animate);

	let delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);

	renderer.render(scene, camera);
}());