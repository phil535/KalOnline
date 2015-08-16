import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GTXLoader from 'src/loaders/GTXLoader.js';

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas: canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = camera.position.y = camera.position.z = 50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);
controls.addEventListener('change', () => {
	renderer.render(scene, camera);
});

let loader = new GTXLoader();
let map = loader.load('../DATA/Monster/Clothes/tex/M001.gtx', () => {
	renderer.render(scene, camera);
});

let geometry = new THREE.PlaneGeometry(50, 50, 5, 5);
let material = new THREE.MeshBasicMaterial({map: map});
let mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
